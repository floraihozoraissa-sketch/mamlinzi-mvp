const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/authMiddleware");
const requireCHW = require("../middleware/requireCHW");

const {
  createFollowup
} = require("../controllers/followupController");

router.post(
  "/",
  requireAuth,
  requireCHW,
  createFollowup
);

module.exports = router;