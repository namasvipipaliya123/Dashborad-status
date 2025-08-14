const { MongoClient } = require('mongodb');

const MONGO_URI = "mongodb+srv://pipaliyanamasvi:dashboard@dashboard.qk6clff.mongodb.net/?retryWrites=true&w=majority&appName=dashboard";
const DB_NAME = "dashboard_db";

let db;

async function connectDB() {
    try {
        const client = await MongoClient.connect(MONGO_URI, { useUnifiedTopology: true });
        db = client.db(DB_NAME);
        console.log(" Connected to MongoDB");
    } catch (err) {
        console.error(" MongoDB connection failed:", err);
    }
}

function getDB() {
    return db;
}

module.exports = { connectDB, getDB };
