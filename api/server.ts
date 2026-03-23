import process = require("process");
import {require} from "./require";

const express = require('express');
const bodyParser = require('body-parser');

const articleCtrl = require('./articleController');

const app = express();
app.use(bodyParser.json());

// Routes [cite: 46, 53, 57, 60, 85, 89]
app.post('/api/articles', articleCtrl.createArticle);
app.get('/api/articles', articleCtrl.getAllArticles);
app.get('/api/articles/search', articleCtrl.searchArticles);
app.get('/api/articles/:id', articleCtrl.getArticleById);
app.put('/api/articles/:id', articleCtrl.updateArticle);
app.delete('/api/articles/:id', articleCtrl.deleteArticle);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));