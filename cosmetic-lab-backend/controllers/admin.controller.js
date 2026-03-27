const db = require('../config/db');

const getAllUsers = async (req, res) => {
  const result = await db.query('SELECT id_utilisateur, nom, prenom, email FROM utilisateur');
  res.json(result.rows);
};

const getAllScores = async (req, res) => {
  const result = await db.query(`
    SELECT u.nom, u.prenom, mj.nom as mini_jeu, s.score_total, s.temps_effectue_s 
    FROM score s 
    JOIN partie p ON s.id_partie = p.id_partie 
    JOIN utilisateur u ON p.id_utilisateur = u.id_utilisateur 
    JOIN mini_jeu mj ON p.id_mini_jeu = mj.id_mini_jeu
  `);
  res.json(result.rows);
};

module.exports = { getAllUsers, getAllScores };