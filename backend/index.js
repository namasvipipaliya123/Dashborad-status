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
app.get("/", (req, res) => {
  res.send("🚀 API is running... Use /upload, /filter, /calculate, /download");
});

app.listen(PORT, () =>
  console.log(` Server running on http://localhost:${PORT}`)
);
