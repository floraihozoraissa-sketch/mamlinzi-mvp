const express = require("express");

const router = express.Router();

const requireAuth = require("../middleware/authMiddleware");
const requireCHW = require("../middleware/requireCHW");

const {
  getPriorityCases,
} = require("../controllers/chwController");

router.get(
  "/cases",
  requireAuth,
  requireCHW,
  getPriorityCases
);

module.exports = router;