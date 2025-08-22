const express = require("express");
const { filterBySubOrderNo } = require("../controllers/filterController");

const router = express.Router();

router.get("/:subOrderNo", filterBySubOrderNo);

module.exports = router;
