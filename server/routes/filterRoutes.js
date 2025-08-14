const express = require('express');
const { parsePrice, getColumnValue } = require('../utils/fileUtils');
const { uploadedData } = require('./uploadRoutes');

const router = express.Router();

router.get('/filter/:subOrderNo', (req, res) => {
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

  res.json({ listedPrice, discountedPrice });
});

module.exports = router;
