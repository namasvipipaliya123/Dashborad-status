const { MongoClient } = require("mongodb");

const MONGO_URI = "mongodb://127.0.0.1:27017";
const DB_NAME = "dashboard_db";
let db;

async function connectDB() {
  try {
    const client = await MongoClient.connect(MONGO_URI, {
      useUnifiedTopology: true,
    });
    db = client.db(DB_NAME);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

function getDB() {
  if (!db) throw new Error("Database not connected yet");
  return db;
}

module.exports = { connectDB, getDB };
