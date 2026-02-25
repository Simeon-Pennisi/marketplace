// health.js
import express from "express";
const router = express.Router();
import pool from "../db/index.js";

router.get("/", async (req, res) => {
  try {
    const nowResult = await pool.query("SELECT NOW() as now");
    res.json({
      status: "ok",
      // check JWT
      jwtConfigured: Boolean(process.env.JWT_SECRET),
      jwtSecretType: typeof process.env.JWT_SECRET,
      jwtSecretLength: process.env.JWT_SECRET
        ? process.env.JWT_SECRET.length
        : 0,
      nodeEnv: process.env.NODE_ENV,
      message: "TechMarket API is healthy",
      time: nowResult.rows[0].now,
    });
  } catch (err) {
    console.error("Health check failed:", err);
    res.status(500).json({ status: "error", message: "DB connection failed" });
  }
});

export default router;
