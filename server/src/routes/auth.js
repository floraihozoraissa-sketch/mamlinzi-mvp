const express = require("express");

const router = express.Router();

const {
  registerMother,
} = require("../controllers/authController");

router.post(
  "/register",
  registerMother
);

module.exports = router;