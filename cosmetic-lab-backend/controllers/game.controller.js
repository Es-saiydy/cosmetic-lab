const db = require("../config/db");

exports.createPartie = async (req, res) => {
  try {
    const { id_utilisateur, id_mini_jeu } = req.body;

    console.log("REQ BODY createPartie =", req.body);

    if (!id_utilisateur || !id_mini_jeu) {
      return res.status(400).json({
        error: "id_utilisateur et id_mini_jeu sont obligatoires",
      });
    }

    const result = await db.query(
      `
      INSERT INTO partie (date_partie, id_utilisateur, id_mini_jeu)
      VALUES (NOW(), $1, $2)
      RETURNING id_partie
      `,
      [Number(id_utilisateur), Number(id_mini_jeu)]
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

exports.saveScore = async (req, res) => {
  try {
    const { valeur, temps, id_partie } = req.body;

    console.log("REQ BODY saveScore =", req.body);

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