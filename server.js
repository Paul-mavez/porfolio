import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "paul12345",
    database: "portfolio"
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

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
