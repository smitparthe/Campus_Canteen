const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ==========================================
// BASIC TEST ROUTES
// ==========================================

app.get("/", (req, res) => {
  res.send("Campus Canteen Backend is running!");
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working!"
  });
});

// ==========================================
// DATABASE TEST
// ==========================================

app.get("/api/db-test", (req, res) => {
  db.query("SELECT 1 AS test", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database connection failed"
      });
    }

    res.json({
      message: "Database connection is working!",
      result: results
    });
  });
});

// ==========================================
// REGISTER
// ==========================================

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            message: "Email already registered"
          });
        }

        return res.status(500).json({
          message: "Registration failed"
        });
      }

      res.status(201).json({
        message: "Registration successful",
        userId: result.insertId
      });
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

// ==========================================
// LOGIN
// ==========================================

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const sql = `
    SELECT id, name, email, password, role
    FROM users
    WHERE email = ?
  `;

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Login failed"
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    try {
      const user = results[0];
      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error"
      });
    }
  });
});
