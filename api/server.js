const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const articleRoutes = require('./routes/articleRoutes');
const { initDatabase } = require('./models/database');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Middlewares
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Documentation Swagger
// ============================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Blog API - Documentation'
}));

// ============================================
// Routes
// ============================================
app.use('/api/articles', articleRoutes);

// Route racine
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur l\'API Blog - INF222',
        version: '1.0.0',
        documentation: `http://localhost:${PORT}/api-docs`,
        endpoints: {
            articles: `http://localhost:${PORT}/api/articles`,
            search: `http://localhost:${PORT}/api/articles/search?query=...`
        }
    });
});

// ============================================
// Gestion des erreurs globales
// ============================================
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Route 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.url} non trouvée`
    });
});

// ============================================
// Initialisation et démarrage
// ============================================
initDatabase();

app.listen(PORT, () => {
    console.log(`
  ╔══════════════════════════════════════════╗
  ║   Blog API - INF222                      ║
  ║   Serveur démarré sur le port ${PORT}       ║
  ║   Documentation: http://localhost:${PORT}/api-docs  ║
  ╚══════════════════════════════════════════╝
  `);
});

module.exports = app;