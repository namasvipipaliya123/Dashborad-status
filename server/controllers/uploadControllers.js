const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const csv = require('csv-parser');
const categorizeRows = require('../utils/categorizeRows');

const handleFileUpload = (req, res) => {
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
        res.json(categorizeRows(results));
      });
  }
  else if (ext === '.xlsx' || ext === '.xls') {
    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    fs.unlinkSync(file.path);
    res.json(categorizeRows(jsonData));
  }
  else {
    fs.unlinkSync(file.path);
    res.status(400).json({ error: 'Unsupported file format' });
  }
};

module.exports = { handleFileUpload };
