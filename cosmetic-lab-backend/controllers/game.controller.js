const db = require("../config/db");

const getMiniJeux = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM mini_jeu ORDER BY id_mini_jeu"
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("Erreur getMiniJeux :", err);
    return res.status(500).json({ error: err.message });
  }
};

const createPartie = async (req, res) => {
  try {
    const { id_mini_jeu } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    if (!id_mini_jeu) {
      return res
        .status(400)
        .json({ error: "id_mini_jeu est obligatoire" });
    }

    const result = await db.query(
      `
      INSERT INTO partie (date_partie, id_utilisateur, id_mini_jeu)
      VALUES (NOW(), $1, $2)
      RETURNING id_partie
      `,
      [Number(req.user.id), Number(id_mini_jeu)]
    );

    return res.status(201).json({
      message: "Partie créée avec succès",
      id_partie: result.rows[0].id_partie,
    });
  } catch (error) {
    console.error("Erreur createPartie :", error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

const saveScore = async (req, res) => {
  try {
    const { valeur, temps, id_partie } = req.body;

    if (valeur === undefined || temps === undefined || !id_partie) {
      return res.status(400).json({
        error: "valeur, temps et id_partie sont obligatoires",
      });
    }

    const scoreTotal = Number(valeur);
    const tempsEffectue = Number(temps);

    const scoreEfficacite = scoreTotal;
    const scoreSecurite = scoreTotal >= 5 ? 5 : scoreTotal;
    const scoreEnvironnement = scoreTotal >= 3 ? 3 : scoreTotal;

    const result = await db.query(
      `
      INSERT INTO score (
        score_total,
        score_efficacite,
        score_securite,
        score_environnement,
        temps_effectue_s,
        id_partie
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        scoreTotal,
        scoreEfficacite,
        scoreSecurite,
        scoreEnvironnement,
        tempsEffectue,
        Number(id_partie),
      ]
    );

    return res.status(201).json({
      message: "Score enregistré avec succès",
      score: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur saveScore :", error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getMiniJeux,
  createPartie,
  saveScore,
};