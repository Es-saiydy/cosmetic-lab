const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');
const auth = require('../middleware/auth.middleware');

router.get('/mini-jeux', gameController.getMiniJeux);
router.post('/partie', auth, gameController.createPartie);
router.post('/score', auth, gameController.saveScore);

module.exports = router;
