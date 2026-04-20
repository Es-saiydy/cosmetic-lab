const express = require("express");
const router = express.Router();
const leaderboardController = require("../controllers/leaderboard.controller");
const auth = require("../middleware/auth.middleware");

router.get("/user", auth, leaderboardController.getUserResults);
router.get("/global", auth, leaderboardController.getGlobalLeaderboard);

module.exports = router;