const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { categorizeRows } = require('../utils/fileUtils');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });
let uploadedData = [];

router.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === '.csv') {
        const results = [];
        fs.createReadStream(file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                fs.unlinkSync(file.path);
                uploadedData = results;
                res.json(categorizeRows(results));
            });
    } else if (ext === '.xlsx' || ext === '.xls') {
        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        fs.unlinkSync(file.path);
        uploadedData = jsonData;
        res.json(categorizeRows(jsonData));
    } else {
        fs.unlinkSync(file.path);
        res.status(400).json({ error: 'Unsupported file format' });
    }
});

module.exports = router;
module.exports.uploadedData = uploadedData;
