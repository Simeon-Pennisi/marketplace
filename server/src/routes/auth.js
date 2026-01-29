import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/index.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "45s";

const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email format." });
    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    if (!process.env.JWT_SECRET)
      return res.status(500).json({ message: "JWT_SECRET is not configured." });

    const existing = await pool.query(
      `SELECT id FROM users WHERE email = $1 LIMIT 1;`,
      [email],
    );
    if (existing.rows.length)
      return res.status(409).json({ message: "Email is already registered." });

    const passwordHash = await bcrypt.hash(password, 12);

    const created = await pool.query(
      `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at;
      `,
      [name || null, email, passwordHash],
    );

    const user = created.rows[0];
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    return res.status(201).json({ user, token });
  } catch (err) {
    console.error("Register error:", err);
    return res
      .status(500)
      .json({ message: "Server error during registration." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    if (!process.env.JWT_SECRET)
      return res.status(500).json({ message: "JWT_SECRET is not configured." });

    const result = await pool.query(
      `SELECT id, name, email, password_hash FROM users WHERE email = $1 LIMIT 1;`,
      [email],
    );

    if (!result.rows.length)
      return res.status(401).json({ message: "Invalid credentials." });

    const row = result.rows[0];
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { sub: row.id, email: row.email },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );
    const user = { id: row.id, name: row.name, email: row.email };

    return res.json({ user, token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login." });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT id, name, email, created_at
      FROM users
      WHERE id = $1
      LIMIT 1;
      `,
      [userId],
    );

    if (result.rows.length === 0) {
      // Token is valid but user no longer exists (deleted) or DB mismatch
      return res.status(401).json({ message: "User not found for token." });
    }

    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Me error:", err);
    return res
      .status(500)
      .json({ message: "Server error fetching current user." });
  }
});

export default router;
