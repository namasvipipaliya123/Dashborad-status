const express = require('express');
const { getDB } = require('../config/db');

const router = express.Router();

router.post('/submit-all', async (req, res) => {
    try {
        const submittedData = req.body;
        const db = getDB();

        if (!db) {
            return res.status(500).json({ message: "Database not connected" });
        }

        const collection = db.collection("dashboard_data");

        await collection.insertOne({
            submittedAt: new Date(),
            data: submittedData
        });

        console.log(" Data inserted into MongoDB");
        res.json({ message: "All data submitted and saved to MongoDB!" });

    } catch (error) {
        console.error(" Error saving to MongoDB:", error);
        res.status(500).json({ message: "Failed to submit all data" });
    }
});

module.exports = router;
