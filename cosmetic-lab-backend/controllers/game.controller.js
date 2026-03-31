const db = require("../config/db");

const getMiniJeux = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM mini_jeu ORDER BY id_mini_jeu");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const createPartie = async (req, res) => {
  try {
    const { id_mini_jeu } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const result = await db.query(
      `INSERT INTO partie (id_utilisateur, id_mini_jeu)
       VALUES ($1, $2) RETURNING id_partie`,
      [req.user.id, id_mini_jeu]
    );

    res.status(201).json({ id_partie: result.rows[0].id_partie });
  } catch (error) {
    console.error("Erreur createPartie :", error);
    res.status(500).json({ error: error.message });
  }
};

const saveScore = async (req, res) => {
  try {
    const { id_partie, score_total } = req.body;

    if (!id_partie || score_total === undefined) {
      return res.status(400).json({ error: "id_partie et score_total sont obligatoires" });
    }

    await db.query(
      `INSERT INTO score (id_partie, score_total, score_efficacite, score_securite, score_environnement)
       VALUES ($1, $2, $3, $4, $5)`,
      [id_partie, score_total, score_total, score_total, score_total]
    );

    res.status(201).json({ message: "Score enregistré avec succès" });
  } catch (error) {
    console.error("Erreur saveScore :", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMiniJeux, createPartie, saveScore };