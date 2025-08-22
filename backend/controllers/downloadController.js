const PDFDocument = require("pdfkit");
const { getDB } = require("../config/db");

const downloadReport = async (req, res) => {
  try {
    const db = getDB();
    const result = await db
      .collection("dashboard_data")
      .find()
      .sort({ submittedAt: -1 })
      .limit(1)
      .toArray();

    if (!result.length) {
      return res.status(404).json({ error: "No data found" });
    }
    const categorized = result[0].categories || {};
    const totals = result[0].totals || {};

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=dashboard-report.pdf"
    );

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    doc.pipe(res);

    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("Dashboard Report", { align: "center" });
    doc.moveDown(2);

    const tableTop = 120;
    const cellHeight = 30;
    const col1X = 60;
    const col2X = 350;
    const col1Width = 290;
    const col2Width = 150;

    doc.rect(col1X, tableTop, col1Width, cellHeight).stroke();
    doc.rect(col2X, tableTop, col2Width, cellHeight).stroke();

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Metric", col1X + 10, tableTop + 10)
      .text("Value", col2X + 10, tableTop + 10);

    const metrics = {
      "All Orders": (categorized.all || []).length || 0,
      "RTO": (categorized.rto || []).length || 0,
      "Door Step Exchanged": (categorized.door_step_exchanged || []).length || 0,
      "Delivered": `${totals?.sellInMonthProducts || 0} (₹${totals?.deliveredSupplierDiscountedPriceTotal || 0})`,
      "Cancelled": (categorized.cancelled || []).length || 0,
      "Pending": (categorized.ready_to_ship || []).length || 0,
      "Shipped": (categorized.shipped || []).length || 0,
      "Other": (categorized.other || []).length || 0,
      "Supplier Listed Total Price": totals?.totalSupplierListedPrice || 0,
      "Supplier Discounted Total Price": totals?.totalSupplierDiscountedPrice || 0,
      "Total Profit": totals?.totalProfit || 0,
      "Profit %": `${totals?.profitPercent || "0.00"}%`,
    };

    doc.font("Helvetica");
    Object.entries(metrics).forEach(([key, value], index) => {
      const y = tableTop + cellHeight * (index + 1);

      doc.rect(col1X, y, col1Width, cellHeight).stroke();
      doc.rect(col2X, y, col2Width, cellHeight).stroke();

      doc.text(key, col1X + 10, y + 10);
      doc.text(String(value), col2X + 10, y + 10);
    });

    doc.end();
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  }
};

module.exports = { downloadReport };
