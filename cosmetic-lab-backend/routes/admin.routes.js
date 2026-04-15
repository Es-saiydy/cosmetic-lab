const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth.middleware');
const adminOnly = require('../middleware/admin.middleware');

router.get('/users', auth, adminOnly, adminController.getAllUsers);
router.get('/scores', auth, adminOnly, adminController.getAllScores);
router.delete('/users/:id', auth, adminOnly, adminController.deleteUser);

module.exports = router;
