const saveScore = async (req, res) => {
  try {
    const {
      valeur,
      temps,
      id_partie,
      score_efficacite,
      score_securite,
      score_environnement,
    } = req.body;

    if (valeur === undefined || temps === undefined || !id_partie) {
      return res.status(400).json({
        error: "valeur, temps et id_partie sont obligatoires",
      });
    }

    const scoreTotal = Number(valeur);
    const tempsEffectue = Number(temps);

    const scoreEfficacite =
      score_efficacite !== undefined ? Number(score_efficacite) : scoreTotal;
    const scoreSecurite =
      score_securite !== undefined ? Number(score_securite) : scoreTotal;
    const scoreEnvironnement =
      score_environnement !== undefined
        ? Number(score_environnement)
        : scoreTotal;

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