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

const getIngredients = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        i.id_ingredient,
        i.nom,
        i.description,
        i.icon,
        i.id_famille,
        f.libelle AS famille,
        f.fonction
      FROM ingredient i
      JOIN famille_ingredient f ON i.id_famille = f.id_famille
      ORDER BY i.id_ingredient
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur getIngredients :", err);
    res.status(500).json({ error: err.message });
  }
};

const getProblemesPeau = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id_probleme, code, libelle, description FROM probleme_peau ORDER BY id_probleme"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur getProblemesPeau :", err);
    res.status(500).json({ error: err.message });
  }
};

const getFamilles = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id_famille, libelle, fonction FROM famille_ingredient ORDER BY id_famille"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur getFamilles :", err);
    res.status(500).json({ error: err.message });
  }
};

const getDefauts = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id_defaut, libelle, description, mots_cibles, phrase FROM defaut_qualite ORDER BY id_defaut"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur getDefauts :", err);
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
      `INSERT INTO partie (id_utilisateur, id_mini_jeu, date_partie)
       VALUES ($1, $2, NOW()) RETURNING id_partie`,
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

module.exports = {
  getMiniJeux,
  getIngredients,
  getProblemesPeau,
  getFamilles,
  getDefauts,
  createPartie,
  saveScore,
};