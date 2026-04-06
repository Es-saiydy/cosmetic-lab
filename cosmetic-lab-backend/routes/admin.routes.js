const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth.middleware');

router.get('/users', auth, adminController.getAllUsers);
router.get('/scores', auth, adminController.getAllScores);
router.delete('/users/:id', auth, adminController.deleteUser);

module.exports = router;
