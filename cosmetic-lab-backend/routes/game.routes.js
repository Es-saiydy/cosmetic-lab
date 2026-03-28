const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');
const auth = require('../middleware/auth.middleware');
const db = require('../config/db');

router.get("/minijeux", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM mini_jeu");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post('/partie', auth, gameController.createPartie);
router.post('/score', auth, gameController.saveScore);

module.exports = router;
