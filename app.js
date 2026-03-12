const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/class")

// mongodb://localhost:27017/class

.then(() => {
    console.log("MongoDB Connected");
})
.catch((error) => {
    console.log("Connection Error:", error);
});

app.get("/", (req, res) => {
    res.send("Server Running");
});

// Debug endpoint to list all collections
app.get("/collections", async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        res.json(collections.map(c => c.name));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to get data from class collection
app.get("/data", async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const data = await db.collection("developers").find({}).toArray();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 3000");
});