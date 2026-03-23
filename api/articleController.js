const Article = require('../models/Article');
const { validationResult } = require('express-validator');

/**
 * Contrôleur pour la gestion des articles du blog
 */
const articleController = {

    /**
     * POST /api/articles
     * Créer un nouvel article
     */
    create: (req, res) => {
        try {
            // Vérifier les erreurs de validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Erreurs de validation',
                    errors: errors.array().map(err => ({
                        champ: err.path,
                        message: err.msg
                    }))
                });
            }

            const { titre, contenu, auteur, date_publication, tags } = req.body;

            const article = Article.create({
                titre: titre.trim(),
                contenu: contenu.trim(),
                auteur: auteur.trim(),
                date_publication,
                tags: tags || []
            });

            res.status(201).json({
                success: true,
                message: 'Article créé avec succès',
                data: article
            });

        } catch (error) {
            console.error('Erreur lors de la création:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la création de l\'article',
                error: error.message
            });
        }
    },

    /**
     * GET /api/articles
     * Récupérer tous les articles (avec filtres optionnels)
     */
    getAll: (req, res) => {
        try {
            const { auteur, date, tag, limit, offset } = req.query;

            const articles = Article.findAll({
                auteur,
                date,
                tag,
                limit: limit ? parseInt(limit) : undefined,
                offset: offset ? parseInt(offset) : undefined
            });

            const total = Article.count();

            res.status(200).json({
                success: true,
                message: 'Articles récupérés avec succès',
                data: articles,
                meta: {
                    total,
                    count: articles.length,
                    filtres: {
                        auteur: auteur || null,
                        date: date || null,
                        tag: tag || null
                    }
                }
            });

        } catch (error) {
            console.error('Erreur lors de la récupération:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des articles',
                error: error.message
            });
        }
    },

    /**
     * GET /api/articles/search?query=...
     * Rechercher des articles par texte
     */
    search: (req, res) => {
        try {
            const { query } = req.query;

            if (!query || query.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Le paramètre "query" est requis pour la recherche'
                });
            }

            const articles = Article.search(query.trim());

            res.status(200).json({
                success: true,
                message: `${articles.length} article(s) trouvé(s) pour "${query}"`,
                data: articles,
                meta: {
                    query: query.trim(),
                    resultats: articles.length
                }
            });

        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la recherche',
                error: error.message
            });
        }
    },

    /**
     * GET /api/articles/:id
     * Récupérer un article par son ID
     */
    getById: (req, res) => {
        try {
            const { id } = req.params;

            // Validation de l'ID
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID invalide. L\'ID doit être un nombre entier.'
                });
            }

            const article = Article.findById(parseInt(id));

            if (!article) {
                return res.status(404).json({
                    success: false,
                    message: `Article avec l'ID ${id} non trouvé`
                });
            }

            res.status(200).json({
                success: true,
                message: 'Article récupéré avec succès',
                data: article
            });

        } catch (error) {
            console.error('Erreur lors de la récupération:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération de l\'article',
                error: error.message
            });
        }
    },

    /**
     * PUT /api/articles/:id
     * Mettre à jour un article
     */
    update: (req, res) => {
        try {
            const { id } = req.params;

            // Validation de l'ID
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID invalide. L\'ID doit être un nombre entier.'
                });
            }

            // Vérifier les erreurs de validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Erreurs de validation',
                    errors: errors.array().map(err => ({
                        champ: err.path,
                        message: err.msg
                    }))
                });
            }

            const updateData = {};
            const { titre, contenu, auteur, date_publication, tags } = req.body;

            if (titre !== undefined) updateData.titre = titre.trim();
            if (contenu !== undefined) updateData.contenu = contenu.trim();
            if (auteur !== undefined) updateData.auteur = auteur.trim();
            if (date_publication !== undefined) updateData.date_publication = date_publication;
            if (tags !== undefined) updateData.tags = tags;

            const article = Article.update(parseInt(id), updateData);

            if (!article) {
                return res.status(404).json({
                    success: false,
                    message: `Article avec l'ID ${id} non trouvé`
                });
            }

            res.status(200).json({
                success: true,
                message: 'Article mis à jour avec succès',
                data: article
            });

        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour de l\'article',
                error: error.message
            });
        }
    },

    /**
     * DELETE /api/articles/:id
     * Supprimer un article
     */
    delete: (req, res) => {
        try {
            const { id } = req.params;

            // Validation de l'ID
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID invalide. L\'ID doit être un nombre entier.'
                });
            }

            const deleted = Article.delete(parseInt(id));

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: `Article avec l'ID ${id} non trouvé`
                });
            }

            res.status(200).json({
                success: true,
                message: `Article avec l'ID ${id} supprimé avec succès`
            });

        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suppression de l\'article',
                error: error.message
            });
        }
    }
};

module.exports = articleController;