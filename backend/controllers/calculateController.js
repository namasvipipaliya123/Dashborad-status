const calculateProfit = (req, res) => {
  const { listedPrice, discountedPrice } = req.body;
  if (listedPrice === undefined || discountedPrice === undefined)
    return res.status(400).json({ error: "Both prices are required" });

  const profit = 500 - discountedPrice;
  const profitPercent = (profit / 500) * 100;

  res.json({ profit, profitPercent: profitPercent.toFixed(2) });
};

module.exports = { calculateProfit };
