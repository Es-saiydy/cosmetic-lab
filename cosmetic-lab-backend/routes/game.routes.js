const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game.controller");
const db = require("../config/db");

router.get("/minijeux", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM mini_jeu ORDER BY id_mini_jeu");
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur minijeux :", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/parties", gameController.createPartie);
router.post("/scores", gameController.saveScore);

module.exports = router;