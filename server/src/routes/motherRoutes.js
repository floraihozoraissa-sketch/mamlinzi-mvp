const express = require("express");

const router = express.Router();

const requireAuth =
  require("../middleware/authMiddleware");
const requireMother =
  require("../middleware/requireMother");

const {
  getMotherDashboard,
} = require("../controllers/motherController");

router.get(
  "/dashboard",
  requireAuth,
  requireMother,
  getMotherDashboard
);

module.exports = router;
