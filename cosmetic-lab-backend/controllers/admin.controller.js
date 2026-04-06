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

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    await client.query(
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

    await client.query(
      `
      DELETE FROM partie
      WHERE id_utilisateur = $1
      `,
      [id]
    );

    const result = await client.query(
      `
      DELETE FROM utilisateur
      WHERE id_utilisateur = $1
      RETURNING *
      `,
      [id]
    );

    await client.query("COMMIT");

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erreur deleteUser :", error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

module.exports = { getAllUsers, getAllScores, deleteUser };