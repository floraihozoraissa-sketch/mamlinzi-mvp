const express = require("express");

const router = express.Router();

const requireAuth =
  require("../middleware/authMiddleware");

const requireHealthOfficial =
  require("../middleware/requireHealthOfficial");

const {
  getOverview,
} = require("../controllers/intelligenceController");

router.get(
  "/overview",
  requireAuth,
  requireHealthOfficial,
  getOverview
);

module.exports = router;