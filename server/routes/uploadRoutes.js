const express = require('express');
const multer = require('multer');
const path = require('path');
const { handleFileUpload } = require('../controllers/uploadControllers');

const router = express.Router();

// Multer setup
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), handleFileUpload);

module.exports = router;
