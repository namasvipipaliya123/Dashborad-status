const { MongoClient } = require("mongodb");

const DB_NAME = "dashboard_db";
let db;
 
async function connectDB() {
  try {
 const client = await MongoClient.connect(process.env.MONGO_URI, {
    ssl: true,
      tlsAllowInvalidCertificates: false, 
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    db = client.db(process.env.DB_NAME);
    console.log("Connected to MongoDB");
    return db;
  } catch (err) {
    console.error(" MongoDB connection failed:", err.message);
    process.exit(1);
``  }
``}
function getDB() {
  if (!db) throw new Error("Database not connected yet");
  return db;
}

module.exports = { connectDB, getDB };