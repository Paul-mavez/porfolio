import express from "express";
import mysql from "mysql2";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "Pages")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/images", express.static(path.join(__dirname, "images")));

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "paul12345",
    database: process.env.DB_NAME || "portfolio"
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

// Insert message (from contact form)
app.post("/submit", (req, res) => {
    const { name, email, message } = req.body;
    const sql = `INSERT INTO messages (fullname, email, message) VALUES (?, ?, ?)`;
    db.query(sql, [name, email, message], (err) => {
        if (err) return res.status(500).json({ status: "error", message: "Failed to save message" });
        res.json({ status: "success", message: "Message saved!" });
    });
});

// Get all messages
app.get("/messages", (req, res) => {
    db.query("SELECT * FROM messages ORDER BY id DESC", (err, results) => {
        if (err) return res.status(500).json({ status: "error", message: "Failed to load messages" });
        res.json(results);
    });
});

// Fallback for frontend routing
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "Pages", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
