const express = require("express");
const { calculateProfit } = require("../controllers/calculateController");

const router = express.Router();

router.post("/", calculateProfit);

module.exports = router;