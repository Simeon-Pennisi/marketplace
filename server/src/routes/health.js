// health.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const nowResult = await pool.query("SELECT NOW() as now");
    res.json({
      status: "ok",
      message: "TechMarket API is healthy",
      time: nowResult.rows[0].now,
    });
  } catch (err) {
    console.error("Health check failed:", err);
    res.status(500).json({ status: "error", message: "DB connection failed" });
  }
});

module.exports = router;
