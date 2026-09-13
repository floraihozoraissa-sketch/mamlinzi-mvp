const express = require("express");

const router = express.Router();

const requireAuth = require("../middleware/authMiddleware");
const requireMother = require("../middleware/requireMother");
const {
  createCheckin,
} = require("../controllers/checkinController");

router.post("/", requireAuth, requireMother, createCheckin);

module.exports = router;
