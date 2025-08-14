const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const csv = require('csv-parser');
const { categorizeRows, parsePrice, getColumnValue } = require('../utils/fileUtils');

let uploadedData = [];

exports.handleUpload = (req, res) => {
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
};

exports.filterBySubOrder = (req, res) => {
  const subOrderNo = req.params.subOrderNo.trim().toLowerCase();

  if (!uploadedData.length) {
    return res.status(400).json({ error: 'No file uploaded yet' });
  }

  const match = uploadedData.find(row => {
    const val = Object.values(row).find(v =>
      v && v.toString().trim().toLowerCase() === subOrderNo
    );
    return Boolean(val);
  });

  if (!match) {
    return res.status(404).json({ error: 'Sub Order No not found' });
  }

  const listedPrice = parsePrice(getColumnValue(match, [
    'Supplier Listed Price (Incl. GST + Commission)',
    'Supplier Listed Price',
    'Listed Price'
  ]));

  const discountedPrice = parsePrice(getColumnValue(match, [
    'Supplier Discounted Price (Incl GST and Commission)',
    'Supplier Discounted Price (Incl GST and Commision)',
    'Supplier Discounted Price',
    'Discounted Price'
  ]));

  res.json({
    listedPrice,
    discountedPrice
  });
};
