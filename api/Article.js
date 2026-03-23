const { getDatabase } = require('./database');

class Article {
    /**
     * Créer un nouvel article
     * @param {Object} articleData - Données de l'article
     * @returns {Object} Article créé avec son ID
     */
    static create(articleData) {
        const db = getDatabase();
        const { titre, contenu, auteur, tags = [] } = articleData;
        const date_publication = articleData.date_publication || new Date().toISOString();
        const tagsJson = JSON.stringify(tags);

        const stmt = db.prepare(`
      INSERT INTO articles (titre, contenu, auteur, date_publication, tags)
      VALUES (?, ?, ?, ?, ?)
    `);

        const result = stmt.run(titre, contenu, auteur, date_publication, tagsJson);

        return {
            id: result.lastInsertRowid,
            titre,
            contenu,
            auteur,
            date_publication,
            tags,
            created_at: new Date().toISOString()
        };
    }

    /**
     * Récupérer tous les articles avec filtres optionnels
     * @param {Object} filters - Filtres (auteur, date, tag)
     * @returns {Array} Liste des articles
     */
    static findAll(filters = {}) {
        const db = getDatabase();
        let query = 'SELECT * FROM articles WHERE 1=1';
        const params = [];

        // Filtre par auteur
        if (filters.auteur) {
            query += ' AND auteur LIKE ?';
            params.push(`%${filters.auteur}%`);
        }

        // Filtre par date (format: YYYY-MM-DD)
        if (filters.date) {
            query += ' AND DATE(date_publication) = ?';
            params.push(filters.date);
        }

        // Filtre par tag
        if (filters.tag) {
            query += ' AND tags LIKE ?';
            params.push(`%${filters.tag}%`);
        }

        // Tri par date de publication (plus récent en premier)
        query += ' ORDER BY date_publication DESC';

        // Pagination
        if (filters.limit) {
            query += ' LIMIT ?';
            params.push(parseInt(filters.limit));
        }
        if (filters.offset) {
            query += ' OFFSET ?';
            params.push(parseInt(filters.offset));
        }

        const articles = db.prepare(query).all(...params);

        // Parser les tags JSON pour chaque article
        return articles.map(article => ({
            ...article,
            tags: JSON.parse(article.tags || '[]')
        }));
    }

    /**
     * Récupérer un article par son ID
     * @param {number} id - ID de l'article
     * @returns {Object|null} Article trouvé ou null
     */
    static findById(id) {
        const db = getDatabase();
        const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);

        if (!article) return null;

        return {
            ...article,
            tags: JSON.parse(article.tags || '[]')
        };
    }

    /**
     * Mettre à jour un article
     * @param {number} id - ID de l'article
     * @param {Object} updateData - Données à mettre à jour
     * @returns {Object|null} Article mis à jour ou null
     */
    static update(id, updateData) {
        const db = getDatabase();

        // Vérifier que l'article existe
        const existing = this.findById(id);
        if (!existing) return null;

        const fields = [];
        const values = [];

        // Construire dynamiquement la requête de mise à jour
        if (updateData.titre !== undefined) {
            fields.push('titre = ?');
            values.push(updateData.titre);
        }
        if (updateData.contenu !== undefined) {
            fields.push('contenu = ?');
            values.push(updateData.contenu);
        }
        if (updateData.auteur !== undefined) {
            fields.push('auteur = ?');
            values.push(updateData.auteur);
        }
        if (updateData.date_publication !== undefined) {
            fields.push('date_publication = ?');
            values.push(updateData.date_publication);
        }
        if (updateData.tags !== undefined) {
            fields.push('tags = ?');
            values.push(JSON.stringify(updateData.tags));
        }

        // Toujours mettre à jour la date de modification
        fields.push('date_modification = ?');
        fields.push('updated_at = ?');
        const now = new Date().toISOString();
        values.push(now, now);

        if (fields.length === 2) {
            // Aucun champ à mettre à jour (seulement les dates)
            return existing;
        }

        values.push(id);

        const query = `UPDATE articles SET ${fields.join(', ')} WHERE id = ?`;
        db.prepare(query).run(...values);

        return this.findById(id);
    }

    /**
     * Supprimer un article
     * @param {number} id - ID de l'article
     * @returns {boolean} true si supprimé, false sinon
     */
    static delete(id) {
        const db = getDatabase();
        const result = db.prepare('DELETE FROM articles WHERE id = ?').run(id);
        return result.changes > 0;
    }

    /**
     * Rechercher des articles par texte
     * @param {string} query - Texte à rechercher
     * @returns {Array} Articles correspondants
     */
    static search(query) {
        const db = getDatabase();
        const searchTerm = `%${query}%`;

        const articles = db.prepare(`
      SELECT * FROM articles
      WHERE titre LIKE ? OR contenu LIKE ?
      ORDER BY date_publication DESC
    `).all(searchTerm, searchTerm);

        return articles.map(article => ({
            ...article,
            tags: JSON.parse(article.tags || '[]')
        }));
    }

    /**
     * Compter le nombre total d'articles
     * @returns {number} Nombre total d'articles
     */
    static count() {
        const db = getDatabase();
        const result = db.prepare('SELECT COUNT(*) as total FROM articles').get();
        return result.total;
    }
}

module.exports = Article;