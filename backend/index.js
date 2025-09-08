const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();
const uploadRoutes = require("./routes/uploadRoutes");
const filterRoutes = require("./routes/filterRoutes");
const calculateRoutes = require("./routes/calculateRoutes");
const downloadRoutes = require("./routes/downloadRoutes");

const app = express();
const PORT = 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/upload", uploadRoutes);
app.use("/filter", filterRoutes);
app.use("/calculate", calculateRoutes);
app.use("/download", downloadRoutes);
app.get("/", async (req, res) => {
  try {

    const db = require("./config/db").getDB(); // make sure DB connected
    const uploadCollection = db.collection("uploads"); 
    const filterCollection = db.collection("filters");
    const calculateCollection = db.collection("calculations");

    const uploadCount = await uploadCollection.countDocuments();
    const filterCount = await filterCollection.countDocuments();
    const calculateCount = await calculateCollection.countDocuments();

    res.json({
      message: " API is running...",
      summary: {
        totalUploads: uploadCount,
        totalFilters: filterCount,
        totalCalculations: calculateCount,
      },
      routes: ["/upload", "/filter", "/calculate", "/download"],
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch API summary" });
  }
});

app.listen(PORT, () =>
  console.log(` Server running on http://localhost:${PORT}`)
);
