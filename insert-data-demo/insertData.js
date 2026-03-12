const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Developer = require("./models/Student");

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // change for production
const JWT_EXPIRES_IN = "1h";

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Token missing" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or expired token" });
        req.user = user;
        next();
    });
}
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/class")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.post("/add-developer", async (req, res) => {
    try {
        const developer = new Developer(req.body);
        await developer.save();
        res.json({ message: "Developer added successfully", data: developer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Simple login endpoint: store login record and return success
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // For demo only: allow student or sravani to login (password length >= 4)
        if ((username !== "student" && username !== "sravani") || password.length < 4) {
            return res.status(401).json({ error: "Invalid username/password (use student or sravani; password >= 4 chars)" });
        }

        // Save login track in the developers collection as a student record
        const loginDeveloper = new Developer({
            name: username,
            role: "student",
            salary: 0,
            sno: Date.now()
        });
        await loginDeveloper.save();

        const payload = { username, role: "student" };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.json({ message: "Login successful", token });
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

// JWT-authenticated data endpoint
app.get("/data-auth", authenticateToken, async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const data = await db.collection("developers").find({}).toArray();
        res.json({ user: req.user, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});