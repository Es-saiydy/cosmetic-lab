const db = require("../config/db");

// Meilleur score par mini-jeu pour l'utilisateur connecté
const getUserResults = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `
      SELECT DISTINCT ON (mj.id_mini_jeu)
        mj.id_mini_jeu,
        mj.nom AS mini_jeu,
        s.score_total,
        s.score_efficacite,
        s.score_securite,
        s.score_environnement,
        s.temps_effectue_s,
        p.date_partie
      FROM score s
      JOIN partie p ON s.id_partie = p.id_partie
      JOIN mini_jeu mj ON p.id_mini_jeu = mj.id_mini_jeu
      WHERE p.id_utilisateur = $1
      ORDER BY mj.id_mini_jeu, s.score_total DESC, s.temps_effectue_s ASC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Erreur getUserResults :", error);
    res.status(500).json({ error: error.message });
  }
};


const getGlobalLeaderboard = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT * FROM (
        SELECT DISTINCT ON (u.id_utilisateur)
          u.id_utilisateur,
          u.nom,
          u.prenom,
          s.score_total AS best_score,
          s.temps_effectue_s AS best_time,
          (
            SELECT COUNT(*)
            FROM partie p2
            WHERE p2.id_utilisateur = u.id_utilisateur
          ) AS nb_parties
        FROM utilisateur u
        JOIN partie p ON u.id_utilisateur = p.id_utilisateur
        JOIN score s ON p.id_partie = s.id_partie
        ORDER BY u.id_utilisateur, s.score_total DESC, s.temps_effectue_s ASC
      ) AS best_runs
      ORDER BY best_score DESC, best_time ASC
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Erreur getGlobalLeaderboard :", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserResults,
  getGlobalLeaderboard,
};