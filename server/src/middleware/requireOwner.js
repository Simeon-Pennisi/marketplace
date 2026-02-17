// requireOwner
import pool from "../db/index.js";

export default async function requireOwner(req, res, next) {
  try {
    const listingId = Number(req.params.id);
    const userId = Number(req.user.id);

    if (!Number.isInteger(listingId)) {
      return res.status(400).json({ message: "Invalid listing id." });
    }

    const result = await pool.query(
      `SELECT id, seller_id FROM listings WHERE id = $1 LIMIT 1;`,
      [listingId],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Listing not found. requireOwner" });
    }

    const seller_id = Number(result.rows[0].seller_id);

    if (seller_id !== userId) {
      return res.status(403).json({ message: "Forbidden." });
    }

    console.log("requireOwner: authorized, calling next()");
    return next();
  } catch (err) {
    console.error("requireOwner error:", err);
    return res
      .status(500)
      .json({ message: "Server error verifying ownership." });
  }
}
