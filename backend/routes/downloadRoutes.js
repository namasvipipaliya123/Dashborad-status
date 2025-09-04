const express = require("express");
const { downloadReport } = require("../controllers/downloadController");

const router = express.Router();

router.get("/", downloadReport);

module.exports = router;