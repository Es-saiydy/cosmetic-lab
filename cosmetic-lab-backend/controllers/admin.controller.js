const db = require("../config/db");

const getAllUsers = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        u.id_utilisateur,
        u.nom,
        u.prenom,
        u.email,
        COALESCE(SUM(s.score_total), 0) AS score_total,
        COUNT(DISTINCT p.id_partie) AS nb_parties
      FROM utilisateur u
      LEFT JOIN partie p ON u.id_utilisateur = p.id_utilisateur
      LEFT JOIN score s ON p.id_partie = s.id_partie
      GROUP BY u.id_utilisateur, u.nom, u.prenom, u.email
      ORDER BY score_total DESC, nb_parties DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Erreur getAllUsers :", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllScores = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        u.nom,
        u.prenom,
        mj.nom AS mini_jeu,
        s.score_total,
        s.score_efficacite,
        s.score_securite,
        s.score_environnement,
        s.temps_effectue_s
      FROM score s
      JOIN partie p ON s.id_partie = p.id_partie
      JOIN utilisateur u ON p.id_utilisateur = u.id_utilisateur
      JOIN mini_jeu mj ON p.id_mini_jeu = mj.id_mini_jeu
      ORDER BY s.score_total DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Erreur getAllScores :", error);
    res.status(500).json({ error: error.message });
  }
};

const getStatsOverview = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM utilisateur)::int AS total_users,
        (SELECT COUNT(*) FROM partie)::int AS total_parties,
        (SELECT COUNT(*) FROM score)::int AS total_scores,
        COALESCE((SELECT ROUND(AVG(score_total))::int FROM score), 0) AS avg_score
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur getStatsOverview :", err);
    res.status(500).json({ error: err.message });
  }
};

const getStatsByMiniJeu = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        mj.id_mini_jeu,
        mj.nom AS mini_jeu,
        COUNT(s.id_score)::int AS nb_parties,
        COALESCE(ROUND(AVG(s.score_total))::int, 0) AS score_moyen
      FROM mini_jeu mj
      LEFT JOIN partie p ON p.id_mini_jeu = mj.id_mini_jeu
      LEFT JOIN score s ON s.id_partie = p.id_partie
      GROUP BY mj.id_mini_jeu, mj.nom
      ORDER BY mj.id_mini_jeu
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur getStatsByMiniJeu :", err);
    res.status(500).json({ error: err.message });
  }
};

const getTopPlayers = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        u.id_utilisateur,
        u.prenom,
        u.nom,
        COUNT(s.id_score)::int AS nb_parties,
        COALESCE(MAX(s.score_total), 0) AS best_score,
        COALESCE(ROUND(AVG(s.score_total))::int, 0) AS avg_score
      FROM utilisateur u
      LEFT JOIN partie p ON p.id_utilisateur = u.id_utilisateur
      LEFT JOIN score s ON s.id_partie = p.id_partie
      GROUP BY u.id_utilisateur, u.prenom, u.nom
      HAVING COUNT(s.id_score) > 0
      ORDER BY best_score DESC, avg_score DESC
      LIMIT 5
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur getTopPlayers :", err);
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      `
      DELETE FROM score
      WHERE id_partie IN (
        SELECT id_partie
        FROM partie
        WHERE id_utilisateur = $1
      )
      `,
      [id]
    );

    await db.query(
      `
      DELETE FROM partie
      WHERE id_utilisateur = $1
      `,
      [id]
    );

    const result = await db.query(
      `
      DELETE FROM utilisateur
      WHERE id_utilisateur = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur deleteUser :", error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getAllUsers,
  getAllScores,
  deleteUser,
  getStatsOverview,
  getStatsByMiniJeu,
  getTopPlayers,
};