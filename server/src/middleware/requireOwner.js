import pool from "../db/index.js";

export default async function requireOwner(req, res, next) {
  try {
    const listingId = Number(req.params.id);
    const userId = Number(req.user.id);
    // I'm adding this so I can select the seller_id from the listing
    // const sellerId = Number(req.params.seller_id);
    // Well, that came back as NaN so...
    const sellerId = req.params.seller_id;

    console.log("requireOwner check:", {
      listingId: req.params.id,
      userId: req.user?.id,
    });

    if (!Number.isInteger(listingId)) {
      return res.status(400).json({ message: "Invalid listing id." });
    }

    const result = await pool.query(
      `SELECT id, seller_id FROM listings WHERE id = $1 LIMIT 1;`,
      [listingId],
    );

    // const result = await pool.query(
    //   `SELECT id, seller_id FROM listings WHERE id = $1 LIMIT 1;`,
    //   [listingId, sellerId],
    // );

    console.log("listing seller_id:", result.rows[0]?.seller_id);

    console.log("But, listing sellerId:", sellerId);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Listing not found. requireOwner" });
    }

    const { seller_id } = result.rows[0];

    // const listing = result.rows[0];

    if (Number(seller_id) !== userId) {
      return res.status(403).json({ message: "Forbidden. requireOwner" });
    }

    return next();
  } catch (err) {
    console.error("requireOwner error:", err);
    return res
      .status(500)
      .json({ message: "Server error verifying ownership." });
  }
}
