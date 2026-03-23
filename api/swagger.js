const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Blog API - INF222',
            version: '1.0.0',
            description: `
## API RESTful de Blog

Cette API permet de gérer un blog avec les fonctionnalités suivantes :
- **CRUD complet** sur les articles
- **Filtrage** par auteur, date et tags
- **Recherche** textuelle dans les titres et contenus
- **Pagination** des résultats

### Codes HTTP utilisés
| Code | Signification |
|------|--------------|
| 200  | Succès |
| 201  | Ressource créée |
| 400  | Requête invalide |
| 404  | Ressource non trouvée |
| 500  | Erreur serveur |
      `,
            contact: {
                name: 'Étudiant INF222',
                email: 'etudiant@universite.edu'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur de développement'
            }
        ],
        tags: [
            {
                name: 'Articles',
                description: 'Opérations CRUD sur les articles du blog'
            }
        ]
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;