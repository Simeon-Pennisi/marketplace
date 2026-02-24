// server/src/db/reset.js
import pool from "./index.js";

if (
  process.env.NODE_ENV === "production" ||
  process.env.ALLOW_DB_RESET !== "true"
) {
  throw new Error(
    "Refusing to run db:reset. Set ALLOW_DB_RESET=true and ensure NODE_ENV !== 'production'.",
  );
}

async function reset() {
  try {
    console.log("⚠️  Resetting database...");

    await pool.query(`
      TRUNCATE TABLE
        reviews,
        favorites,
        orders,
        listings,
        users
      RESTART IDENTITY CASCADE;
    `);

    console.log("✅ Database reset complete.");
  } catch (err) {
    console.error("❌ Reset failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

reset();
