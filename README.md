# taf-inf-22
devellopement backend d'une API pour gerer un blog simple
# 📝 Blog API - Projet INF222

API RESTful pour la gestion d'un blog, développée avec **Node.js**, **Express** et **SQLite**.

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Démarrage](#démarrage)
- [Structure du projet](#structure-du-projet)
- [Endpoints de l'API](#endpoints-de-lapi)
- [Exemples de requêtes](#exemples-de-requêtes)
- [Documentation Swagger](#documentation-swagger)
- [Codes HTTP](#codes-http)

## 🔧 Prérequis

- **Node.js** (version 16 ou supérieure)
- **npm** (inclus avec Node.js)

## 🚀 Installation

\`\`\`bash
# 1. Cloner le projet
git clone <url-du-repo>
cd blog-api-inf222

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur
npm run dev    # Mode développement (avec rechargement automatique)
# ou
npm start      # Mode production
\`\`\`

Le serveur démarre sur **http://localhost:3000**

## 📁 Structure du projet

\`\`\`
blog-api-inf222/
├── src/
│   ├── server.js              # Point d'entrée principal
│   ├── config/
│   │   └── swagger.js         # Configuration Swagger
│   ├── controllers/
│   │   └── articleController.js # Logique métier
│   ├── models/
│   │   ├── database.js        # Configuration SQLite
│   │   └── Article.js         # Modèle Article (CRUD)
│   └── routes/
│       └── articleRoutes.js   # Définition des routes
├── data/
│   └── blog.db                # Base de données SQLite (auto-générée)
├── package.json
└── README.md
\`\`\`

## 🔌 Endpoints de l'API

| Méthode  | Endpoint                        | Description                   |
|----------|---------------------------------|-------------------------------|
| \`POST\`   | \`/api/articles\`                 | Créer un article              |
| \`GET\`    | \`/api/articles\`                 | Lister tous les articles      |
| \`GET\`    | \`/api/articles/:id\`             | Récupérer un article par ID   |
| \`PUT\`    | \`/api/articles/:id\`             | Modifier un article           |
| \`DELETE\` | \`/api/articles/:id\`             | Supprimer un article          |
| \`GET\`    | \`/api/articles/search?query=...\`| Rechercher des articles       |

### Filtres disponibles (GET /api/articles)

| Paramètre | Type   | Description                |
|-----------|--------|----------------------------|
| auteur    | string | Filtrer par nom d'auteur   |
| date      | string | Filtrer par date (YYYY-MM-DD) |
| tag       | string | Filtrer par tag            |
| limit     | number | Nombre max de résultats    |
| offset    | number | Décalage (pagination)      |

## 📝 Exemples de requêtes

### Créer un article
\`\`\`bash
curl -X POST http://localhost:3000/api/articles \\
  -H "Content-Type: application/json" \\
  -d '{
    "titre": "Introduction à Node.js",
    "contenu": "Node.js est un environnement d\'exécution JavaScript côté serveur...",
    "auteur": "Jean Dupont",
    "tags": ["nodejs", "javascript", "backend"]
  }'
\`\`\`

### Lister les articles
\`\`\`bash
curl http://localhost:3000/api/articles
curl http://localhost:3000/api/articles?auteur=Jean
curl http://localhost:3000/api/articles?date=2024-01-15
\`\`\`

### Rechercher
\`\`\`bash
curl http://localhost:3000/api/articles/search?query=Node.js
\`\`\`

### Modifier un article
\`\`\`bash
curl -X PUT http://localhost:3000/api/articles/1 \\
  -H "Content-Type: application/json" \\
  -d '{ "titre": "Titre modifié" }'
\`\`\`

### Supprimer un article
\`\`\`bash
curl -X DELETE http://localhost:3000/api/articles/1
\`\`\`

## 📖 Documentation Swagger

Accédez à la documentation interactive :  
👉 **http://localhost:3000/api-docs**

## 📊 Codes HTTP

| Code | Signification            | Utilisation                        |
|------|--------------------------|------------------------------------|
| 200  | OK                       | Requête réussie                    |
| 201  | Created                  | Ressource créée avec succès        |
| 400  | Bad Request              | Données invalides                  |
| 404  | Not Found                | Ressource non trouvée              |
| 500  | Internal Server Error    | Erreur serveur interne             |

## 🛠 Technologies utilisées

- **Express.js** - Framework web
- **better-sqlite3** - Base de données SQLite
- **express-validator** - Validation des entrées
- **swagger-jsdoc + swagger-ui-express** - Documentation API
- **cors** - Cross-Origin Resource Sharing
- **nodemon** - Rechargement automatique en développement

---
lien du site creer :https://019d1765-83c9-7e5f-b768-1ace09bdaa9d.arena.site/
*Projet réalisé dans le cadre du cours INF222*
