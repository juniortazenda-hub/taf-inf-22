const Database = require('better-sqlite3');
const path = require('path');

// Chemin vers le fichier de base de données
const DB_PATH = path.join(__dirname, '../../data/blog.db');

let db;

/**
 * Obtenir l'instance de la base de données
 * @returns {Database} Instance de la base de données SQLite
 */
function getDatabase() {
    if (!db) {
        const fs = require('fs');
        const dataDir = path.join(__dirname, '../../data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
    }
    return db;
}

/**
 * Initialiser la base de données et créer les tables
 */
function initDatabase() {
    const database = getDatabase();

    // Créer la table des articles
    database.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titre VARCHAR(255) NOT NULL,
      contenu TEXT NOT NULL,
      auteur VARCHAR(100) NOT NULL,
      date_publication DATETIME DEFAULT CURRENT_TIMESTAMP,
      date_modification DATETIME DEFAULT CURRENT_TIMESTAMP,
      tags TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Créer les index pour optimiser les recherches
    database.exec(`
    CREATE INDEX IF NOT EXISTS idx_articles_auteur ON articles(auteur);
    CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(date_publication);
    CREATE INDEX IF NOT EXISTS idx_articles_titre ON articles(titre);
  `);

    console.log('✅ Base de données initialisée avec succès');
}

/**
 * Fermer la connexion à la base de données
 */
function closeDatabase() {
    if (db) {
        db.close();
        db = null;
        console.log('🔒 Connexion à la base de données fermée');
    }
}

module.exports = {
    getDatabase,
    initDatabase,
    closeDatabase
};