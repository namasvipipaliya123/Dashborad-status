const express = require('express');
const multer = require('multer');
const { handleUpload, filterBySubOrder } = require('../controllers/uploadController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), handleUpload);
router.get('/filter/:subOrderNo', filterBySubOrder);

module.exports = router;
