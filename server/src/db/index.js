import { Pool } from "pg";

const isProd = process.env.NODE_ENV === "production";

// Only loading .env locally
if (!isProd) {
  await import("dotenv/config");
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not set. Check your .env file.");
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString,
  ssl: isProd ? { rejectUnauthorized: false } : false,
});

export default pool;
