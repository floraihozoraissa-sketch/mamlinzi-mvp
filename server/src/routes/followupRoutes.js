const express = require("express");
const {
  createFollowup,
} = require("../controllers/followupController");

const router = express.Router();

router.post("/", createFollowup);

module.exports = router;