const express = require('express');
const router = express.Router();

router.post('/calculate', (req, res) => {
  const { listedPrice, discountedPrice } = req.body;

  // Validate inputs
  if (listedPrice === undefined || discountedPrice === undefined) {
    return res.status(400).json({ error: 'Both prices are required' });
  }

  // Calculate profit and percentage
  const profit = listedPrice - discountedPrice;
  const profitPercent = (profit / discountedPrice) * 100;

  res.json({
    profit,
    profitPercent: profitPercent.toFixed(2)
  });
});

module.exports = router;
