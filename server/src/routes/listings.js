// server/src/routes/listings.js
import express from "express";
import pool from "../db/index.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// GET /api/listings?category=&minPrice=&maxPrice=&brand=&sort=
router.get("/", async (req, res) => {
  const { category, minPrice, maxPrice, brand, sort } = req.query;

  // Base query
  let query = `
    SELECT 
      l.id,
      l.title,
      l.price_cents,
      l.condition,
      l.category,
      l.brand,
      l.image_url,
      l.technical_specs,
      l.created_at,
      COALESCE(AVG(r.rating), 0) AS avg_rating,
      COUNT(r.id) AS review_count
    FROM listings l
    LEFT JOIN reviews r ON r.listing_id = l.id
    WHERE l.is_active = TRUE
  `;

  const params = [];
  let paramIndex = 1;

  // Filters
  if (category) {
    query += ` AND l.category = $${paramIndex++}`;
    params.push(category);
  }

  if (minPrice) {
    const minCents = Math.round(parseFloat(minPrice) * 100);
    query += ` AND l.price_cents >= $${paramIndex++}`;
    params.push(minCents);
  }

  if (maxPrice) {
    const maxCents = Math.round(parseFloat(maxPrice) * 100);
    query += ` AND l.price_cents <= $${paramIndex++}`;
    params.push(maxCents);
  }

  if (brand) {
    query += ` AND LOWER(l.brand) LIKE $${paramIndex++}`;
    params.push(`%${brand.toLowerCase()}%`);
  }

  query += ` GROUP BY l.id`;

  // Sorting
  if (sort === "price_asc") {
    query += ` ORDER BY l.price_cents ASC`;
  } else if (sort === "price_desc") {
    query += ` ORDER BY l.price_cents DESC`;
  } else {
    query += ` ORDER BY l.created_at DESC`;
  }

  try {
    const result = await pool.query(query, params);

    // Convert price_cents to dollars for the frontend
    const listings = result.rows.map((row) => ({
      ...row,
      price: row.price_cents / 100,
    }));

    res.json({ listings });
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).json({ message: "Error fetching listings" });
  }
});

// GET /api/listings/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        l.id,
        l.title,
        l.price_cents,
        l.condition,
        l.category,
        l.brand,
        l.image_url,
        l.technical_specs,
        l.created_at,
        COALESCE(AVG(r.rating), 0) AS avg_rating,
        COUNT(r.id) AS review_count
      FROM listings l
      LEFT JOIN reviews r ON r.listing_id = l.id
      WHERE l.id = $1 AND l.is_active = TRUE
      GROUP BY l.id;
    `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const row = result.rows[0];
    const listing = {
      ...row,
      price: row.price_cents / 100,
    };

    res.json({ listing });
  } catch (err) {
    console.error("Error fetching listing detail:", err);
    res.status(500).json({ message: "Error fetching listing" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const sellerId = req.user.id;
    const {
      title,
      price_cents,
      condition,
      category,
      brand,
      technical_specs,
      image_url,
    } = req.body;

    if (!title || !price_cents || !category) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const result = await pool.query(
      `
      INSERT INTO listings
      (seller_id, title, price_cents, condition, category, brand, technical_specs, image_url)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
      `,
      [
        sellerId,
        title,
        price_cents,
        condition,
        category,
        brand,
        technical_specs,
        image_url,
      ],
    );

    return res.status(201).json({ listing: result.rows[0] });
  } catch (err) {
    console.error("Create listing error:", err);
    return res.status(500).json({ message: "Server error creating listing." });
  }
});

export default router;
