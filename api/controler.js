const db = require('./database');

exports.createArticle = (req, res) => {
    const { titre, contenu, auteur, date, categorie, tags } = req.body;
    if (!titre || !auteur) return res.status(400).json({ error: "Titre et auteur requis" }); [cite: 101, 102]

    const sql = `INSERT INTO articles (titre, contenu, auteur, date, categorie, tags) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [titre, contenu, auteur, date, categorie, tags], function(err) {
        if (err) return res.status(500).json({ error: err.message }); [cite: 102]
        res.status(201).json({ id: this.lastID, message: "Article créé avec succès" }); [cite: 48, 102]
    });
};

exports.getAllArticles = (req, res) => {
    const { categorie, auteur, date } = req.query; [cite: 52]
    let sql = "SELECT * FROM articles WHERE 1=1";
    let params = [];

    if (categorie) { sql += " AND categorie = ?"; params.push(categorie); }
    if (auteur) { sql += " AND auteur = ?"; params.push(auteur); }
    if (date) { sql += " AND date = ?"; params.push(date); }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows); [cite: 54]
    });
};

exports.getArticleById = (req, res) => {
    db.get("SELECT * FROM articles WHERE id = ?", [req.params.id], (err, row) => {
        if (!row) return res.status(404).json({ error: "Article non trouvé" }); [cite: 102]
        res.json(row); [cite: 58]
    });
};

exports.updateArticle = (req, res) => {
    const { titre, contenu, categorie, tags } = req.body;
    const sql = `UPDATE articles SET titre=?, contenu=?, categorie=?, tags=? WHERE id=?`;
    db.run(sql, [titre, contenu, categorie, tags, req.params.id], function(err) {
        if (this.changes === 0) return res.status(404).json({ error: "Inexistant" });
        res.json({ message: "Article mis à jour !" }); [cite: 61]
    });
};

exports.deleteArticle = (req, res) => {
    db.run("DELETE FROM articles WHERE id = ?", [req.params.id], function(err) {
        res.json({ message: "Article supprimé" }); [cite: 86]
    });
};

exports.searchArticles = (req, res) => {
    const query = req.query.query; [cite: 89]
    const sql = "SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ?";
    db.all(sql, [`%${query}%`, `%${query}%`], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows); [cite: 91]
    });
};