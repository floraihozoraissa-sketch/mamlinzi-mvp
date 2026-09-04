const express = require("express");
const {
  getPriorityCases,
} = require("../controllers/chwController");

const router = express.Router();

router.get("/cases", getPriorityCases);

module.exports = router;