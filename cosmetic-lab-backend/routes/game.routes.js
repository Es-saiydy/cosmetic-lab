const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game.controller");
const auth = require("../middleware/auth.middleware");

router.get("/minijeux", gameController.getMiniJeux);
router.get("/ingredients", gameController.getIngredients); 
router.get("/problemes-peau", gameController.getProblemesPeau);
router.get("/familles", gameController.getFamilles); 
router.get("/defauts", gameController.getDefauts);
router.post("/parties", auth, gameController.createPartie);
router.post("/scores", auth, gameController.saveScore);

module.exports = router;