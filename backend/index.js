const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const { connectDB, getDB } = require("./config/db");

const uploadRoutes = require("./routes/uploadRoutes");
const filterRoutes = require("./routes/filterRoutes");
const calculateRoutes = require("./routes/calculateRoutes");
const downloadRoutes = require("./routes/downloadRoutes");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // 1️⃣ Connect to DB
  await connectDB();

  // 2️⃣ Create app
  const app = express();

  // 3️⃣ Middleware
  app.use(cors());
  app.use(express.json());

  // 4️⃣ Routes
  app.use("/upload", uploadRoutes);
  app.use("/filter", filterRoutes);
  app.use("/calculate", calculateRoutes);
  app.use("/download", downloadRoutes);

  // 5️⃣ Root route
  app.get("/", async (req, res) => {
    try {
      const db = getDB();

      // Replace collection names with actual ones
      const uploadCount = await db.collection("uploads").countDocuments();
      const filterCount = await db.collection("filters").countDocuments();
      const calculateCount = await db.collection("calculations").countDocuments();

      res.json({
        message: "🚀 API is running...",
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

  // 6️⃣ Start server
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
};

startServer();
