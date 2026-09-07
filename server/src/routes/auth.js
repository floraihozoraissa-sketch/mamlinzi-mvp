const express = require("express");
const router = express.Router();

const {
  registerMother,
  registerRole,
} = require("../controllers/authController");

router.post(
  "/register",
  registerMother
);

router.post(
  "/register-role",
  registerRole
);

module.exports = router;