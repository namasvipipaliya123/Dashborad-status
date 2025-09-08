const { MongoClient, ServerApiVersion } = require("mongodb"); // ServerApiVersion import

const DB_NAME = "dashboard_db";
let db;

async function connectDB() {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1, // '1' se replace kiya
        strict: true,
        deprecationErrors: true,
      },
    });

    db = client.db(process.env.DB_NAME || DB_NAME); // default fallback
    console.log("✅ Connected to MongoDB");
    return db;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    // process.exit(1);  // optional, comment out to prevent crash
  }
}

function getDB() {
  if (!db) throw new Error("Database not connected yet");
  return db;
}

module.exports = { connectDB, getDB };
