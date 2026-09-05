const express = require("express");

const router = express.Router();

const requireAuth =
  require("../middleware/authMiddleware");

const {
  getMotherDashboard,
} = require("../controllers/motherController");

router.get(
  "/dashboard",
  requireAuth,
  getMotherDashboard
);

module.exports = router;