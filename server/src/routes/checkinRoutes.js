const express = require("express");
const {
  createCheckin,
} = require("../controllers/checkinController");

const router = express.Router();

router.post("/", createCheckin);

module.exports = router;