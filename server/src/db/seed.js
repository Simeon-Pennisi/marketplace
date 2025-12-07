// schema and seed data
const pool = require("./index");

async function createTables() {
  const query = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    price_cents INT NOT NULL,
    condition VARCHAR(20) NOT NULL CHECK (condition IN ('new', 'like_new', 'good', 'fair')),
    category VARCHAR(50) NOT NULL,
    brand VARCHAR(100),
    technical_specs TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
  );

  CREATE TABLE IF NOT EXISTS favorites (
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id INT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, listing_id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    listing_id INT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (listing_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    buyer_id INT NOT NULL REFERENCES users(id),
    subtotal_cents INT NOT NULL,
    tax_cents INT NOT NULL,
    shipping_cents INT NOT NULL,
    total_cents INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'paid_simulated'
      CHECK (status IN ('pending', 'paid_simulated', 'shipped', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    listing_id INT NOT NULL REFERENCES listings(id),
    quantity INT NOT NULL DEFAULT 1,
    unit_price_cents INT NOT NULL,
    line_total_cents INT NOT NULL
  );
  `;

  await pool.query(query);
}

async function seedUsers() {
  await pool.query(
    `
    INSERT INTO users (name, email, password_hash)
    VALUES
      ('Alice Seller', 'alice@example.com', 'demo-hash'),
      ('Bob Buyer', 'bob@example.com', 'demo-hash')
    ON CONFLICT (email) DO NOTHING;
  `
  );
}

async function getUserByEmail(email) {
  const result = await pool.query(
    `SELECT id FROM users WHERE email = $1 LIMIT 1;`,
    [email]
  );
  return result.rows[0];
}

async function seedListings(sellerId) {
  await pool.query(
    `
    INSERT INTO listings
      (seller_id, title, price_cents, condition, category, brand, technical_specs, image_url)
    VALUES
      ($1, 'Dell 27" 144Hz Monitor', 19999, 'like_new', 'monitor', 'Dell',
        '27 inch, 144Hz, 1ms response, 2560x1440',
        'https://via.placeholder.com/400x300?text=Dell+Monitor'),
      ($1, 'Lenovo ThinkPad X1 Carbon', 89999, 'good', 'laptop', 'Lenovo',
        'Intel i7, 16GB RAM, 512GB SSD, 14 inch FHD',
        'https://via.placeholder.com/400x300?text=ThinkPad+X1'),
      ($1, 'Audio-Technica Studio Headphones', 7999, 'like_new', 'audio', 'Audio-Technica',
        'Closed-back, over-ear, great for mixing and casual listening',
        'https://via.placeholder.com/400x300?text=Headphones')
    ON CONFLICT DO NOTHING;
  `,
    [sellerId]
  );
}

async function seedFavoritesAndReviews(buyerId) {
  // Get some listings
  const listingsResult = await pool.query(
    `SELECT id FROM listings ORDER BY id LIMIT 3;`
  );
  const listings = listingsResult.rows;

  if (listings.length === 0) return;

  const firstListingId = listings[0].id;

  // Bob favorites first listing
  await pool.query(
    `
    INSERT INTO favorites (user_id, listing_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;
  `,
    [buyerId, firstListingId]
  );

  // Bob leaves a review on first listing
  await pool.query(
    `
    INSERT INTO reviews (listing_id, user_id, rating, comment)
    VALUES ($1, $2, 5, 'Great condition, works perfectly!')
    ON CONFLICT (listing_id, user_id) DO NOTHING;
  `,
    [firstListingId, buyerId]
  );
}

async function seedOrders(buyerId) {
  // Grab two listings
  const listingsResult = await pool.query(
    `SELECT id, price_cents FROM listings ORDER BY id LIMIT 2;`
  );
  const listings = listingsResult.rows;
  if (listings.length === 0) return;

  const item1 = listings[0];
  const item2 = listings[1] || listings[0]; // if only one, reuse

  const subtotal = item1.price_cents + item2.price_cents;

  const tax = Math.round(subtotal * 0.1); // 10% tax
  const shipping = 1500; // flat $15 shipping
  const total = subtotal + tax + shipping;

  const orderResult = await pool.query(
    `
    INSERT INTO orders (buyer_id, subtotal_cents, tax_cents, shipping_cents, total_cents, status)
    VALUES ($1, $2, $3, $4, $5, 'paid_simulated')
    RETURNING id;
  `,
    [buyerId, subtotal, tax, shipping, total]
  );

  const orderId = orderResult.rows[0].id;

  await pool.query(
    `
    INSERT INTO order_items
      (order_id, listing_id, quantity, unit_price_cents, line_total_cents)
    VALUES
      ($1, $2, 1, $3, $3),
      ($1, $4, 1, $5, $5);
  `,
    [orderId, item1.id, item1.price_cents, item2.id, item2.price_cents]
  );
}

async function main() {
  try {
    console.log("⏳ Creating tables...");
    await createTables();
    console.log("✅ Tables ready.");

    console.log("⏳ Seeding users...");
    await seedUsers();
    console.log("✅ Users seeded.");

    const seller = await getUserByEmail("alice@example.com");
    const buyer = await getUserByEmail("bob@example.com");

    if (!seller || !buyer) {
      throw new Error("Expected demo users not found after seeding.");
    }

    console.log("⏳ Seeding listings...");
    await seedListings(seller.id);
    console.log("✅ Listings seeded.");

    console.log("⏳ Seeding favorites & reviews...");
    await seedFavoritesAndReviews(buyer.id);
    console.log("✅ Favorites & reviews seeded.");

    console.log("⏳ Seeding a sample order...");
    await seedOrders(buyer.id);
    console.log("✅ Orders seeded.");

    console.log("🎉 Seed script completed successfully.");
  } catch (err) {
    console.error("❌ Seed failed:", err);
  } finally {
    await pool.end();
  }
}

main();
