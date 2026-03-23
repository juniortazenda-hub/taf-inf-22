const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const articleController = require('../controllers/articleController');

// ============================================
// Règles de validation
// ============================================
const validateCreateArticle = [
    body('titre')
        .notEmpty().withMessage('Le titre est obligatoire')
        .isLength({ min: 3, max: 255 }).withMessage('Le titre doit contenir entre 3 et 255 caractères')
        .trim(),

    body('contenu')
        .notEmpty().withMessage('Le contenu est obligatoire')
        .isLength({ min: 10 }).withMessage('Le contenu doit contenir au moins 10 caractères')
        .trim(),

    body('auteur')
        .notEmpty().withMessage('L\'auteur est obligatoire')
        .isLength({ min: 2, max: 100 }).withMessage('L\'auteur doit contenir entre 2 et 100 caractères')
        .trim(),

    body('tags')
        .optional()
        .isArray().withMessage('Les tags doivent être un tableau'),

    body('date_publication')
        .optional()
        .isISO8601().withMessage('La date doit être au format ISO 8601 (ex: 2024-01-15)')
];

const validateUpdateArticle = [
    body('titre')
        .optional()
        .isLength({ min: 3, max: 255 }).withMessage('Le titre doit contenir entre 3 et 255 caractères')
        .trim(),

    body('contenu')
        .optional()
        .isLength({ min: 10 }).withMessage('Le contenu doit contenir au moins 10 caractères')
        .trim(),

    body('auteur')
        .optional()
        .isLength({ min: 2, max: 100 }).withMessage('L\'auteur doit contenir entre 2 et 100 caractères')
        .trim(),

    body('tags')
        .optional()
        .isArray().withMessage('Les tags doivent être un tableau'),

    body('date_publication')
        .optional()
        .isISO8601().withMessage('La date doit être au format ISO 8601')
];

// ============================================
// Routes
// ============================================

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Rechercher des articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Texte à rechercher dans le titre ou le contenu
 *     responses:
 *       200:
 *         description: Résultats de la recherche
 *       400:
 *         description: Paramètre query manquant
 */
router.get('/search', articleController.search);

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Récupérer tous les articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: auteur
 *         schema:
 *           type: string
 *         description: Filtrer par auteur
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date (YYYY-MM-DD)
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filtrer par tag
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre maximum d'articles
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Décalage pour la pagination
 *     responses:
 *       200:
 *         description: Liste des articles
 */
router.get('/', articleController.getAll);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupérer un article par ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article
 *     responses:
 *       200:
 *         description: Article trouvé
 *       404:
 *         description: Article non trouvé
 */
router.get('/:id', articleController.getById);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Créer un nouvel article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titre, contenu, auteur]
 *             properties:
 *               titre:
 *                 type: string
 *                 example: "Mon premier article"
 *               contenu:
 *                 type: string
 *                 example: "Contenu détaillé de l'article..."
 *               auteur:
 *                 type: string
 *                 example: "Jean Dupont"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["tech", "web"]
 *               date_publication:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-15T10:00:00Z"
 *     responses:
 *       201:
 *         description: Article créé avec succès
 *       400:
 *         description: Erreurs de validation
 */
router.post('/', validateCreateArticle, articleController.create);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Mettre à jour un article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               contenu:
 *                 type: string
 *               auteur:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Article mis à jour
 *       404:
 *         description: Article non trouvé
 */
router.put('/:id', validateUpdateArticle, articleController.update);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Supprimer un article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article supprimé
 *       404:
 *         description: Article non trouvé
 */
router.delete('/:id', articleController.delete);

module.exports = router;