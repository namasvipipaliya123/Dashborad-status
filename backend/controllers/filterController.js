const { getDB } = require("../config/db");
const { parsePrice, getColumnValue } = require("../utils/parser");

const filterBySubOrderNo = async (req, res) => {
  const subOrderNo = req.params.subOrderNo.trim().toLowerCase();
  if (!subOrderNo) return res.status(400).json({ error: "Sub Order No required" });
  try {
    const db = getDB();
    const result = await db
      .collection("dashboard_data")
      .find()
      .sort({ submittedAt: -1 })
      .limit(1)
      .toArray();

    if (!result.length) return res.status(404).json({ error: "No data found" });

    const rows = result[0].data;

    const match = rows.find((row) => {
      const keys = Object.keys(row).map((k) => k.toLowerCase());
      const subOrderKey = keys.find(
        (k) => k.includes("sub") && k.includes("order")
      );
      if (
        subOrderKey &&
        row[subOrderKey] &&
        row[subOrderKey].toString().trim().toLowerCase() === subOrderNo
      ) {
        return true;
      }

      return Object.values(row).some(
        (v) => v && v.toString().trim().toLowerCase() === subOrderNo
      );
    });

    if (!match) return res.status(404).json({ error: "Sub Order No not found" });

    const listedPrice = parsePrice(
      getColumnValue(match, [
        "Supplier Listed Price (Incl. GST + Commission)",
        "Supplier Listed Price",
        "Listed Price",
      ])
    );

    const discountedPrice = parsePrice(
      getColumnValue(match, [
        "Supplier Discounted Price (Incl GST and Commission)",
        "Supplier Discounted Price (Incl GST and Commision)",
        "Supplier Discounted Price",
        "Discounted Price",
      ])
    );

    res.json({
      subOrderNo,
      listedPrice,
      discountedPrice,
      profit: 500 - discountedPrice,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { filterBySubOrderNo };
