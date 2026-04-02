const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game.controller");
const auth = require("../middleware/auth.middleware");

router.get("/minijeux", gameController.getMiniJeux);
router.post("/parties", auth, gameController.createPartie);
router.post("/scores", auth, gameController.saveScore);

module.exports = router;