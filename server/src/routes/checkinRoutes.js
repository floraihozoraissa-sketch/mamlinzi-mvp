const express = require("express");

const router = express.Router();

const requireAuth = require("../middleware/authMiddleware");
const {
  createCheckin,
} = require("../controllers/checkinController");

router.post("/", requireAuth, createCheckin);

module.exports = router;