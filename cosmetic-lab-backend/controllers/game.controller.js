const db = require('../config/db');

const getMiniJeux = async (req, res) => {
  const result = await db.query('SELECT * FROM mini_jeu');
  res.json(result.rows);
};

const createPartie = async (req, res) => {
  const { id_mini_jeu, id_probleme, id_defaut } = req.body;
  const result = await db.query(
    'INSERT INTO partie (id_utilisateur, id_mini_jeu, id_probleme, id_defaut) VALUES ($1, $2, $3, $4) RETURNING id_partie',
    [req.user.id, id_mini_jeu, id_probleme, id_defaut]
  );
  res.json({ id_partie: result.rows[0].id_partie });
};

const saveScore = async (req, res) => {
  const { id_partie, score_total, score_efficacite, score_securite, score_environnement } = req.body;
  await db.query(
    'INSERT INTO score (id_partie, score_total, score_efficacite, score_securite, score_environnement) VALUES ($1, $2, $3, $4, $5)',
    [id_partie, score_total, score_efficacite, score_securite, score_environnement]
  );
  res.json({ message: 'Score sauvegardé' });
};

module.exports = { getMiniJeux, createPartie, saveScore };