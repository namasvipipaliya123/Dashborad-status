const XLSX = require("xlsx");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const { getDB } = require("../config/db");
const { categorizeRows } = require("../utils/categorize");

async function saveToDB(rows, res) {
  const db = getDB();
  if (!rows || !rows.length)
    return res.status(400).json({ message: "No data to save" });

  const categorized = categorizeRows(rows);
  try {
    await db.collection("dashboard_data").insertOne({
      submittedAt: new Date(),
      data: rows,
      totals: categorized.totals,
      categories: categorized,
    });
    return res.json(categorized);
  } catch (error) {
    return res.status(500).json({ message: "Failed to save data to MongoDB" });
  }
}

const uploadFile = (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const ext = path.extname(file.originalname).toLowerCase();
  let rows = [];

  try {
    if (ext === ".csv") {
      fs.createReadStream(file.path)
        .pipe(csv())
        .on("data", (data) => rows.push(data))
        .on("end", async () => {
          fs.unlinkSync(file.path);
          await saveToDB(rows, res);
        });
    } else if (ext === ".xlsx" || ext === ".xls") {
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      fs.unlinkSync(file.path);
      saveToDB(rows, res);
    } else {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: "Unsupported file format" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to process file" });
  }
};

module.exports = { uploadFile };
