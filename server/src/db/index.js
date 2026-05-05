import { Pool } from "pg";

const isProd = process.env.NODE_ENV === "production";

// Only loading .env locally
if (!isProd) {
  // eslint-disable-next-line no-unused-vars
  const dotenv = await import("dotenv/config");
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not set. Check your .env file.");
  throw new Error("DATABASE_URL is not set");
}

// In production, we need to use SSL with rejectUnauthorized: false
// const pool = new Pool({
//   connectionString,
//   // ssl: isProd ? { rejectUnauthorized: false } : false,
//   ssl: { rejectUnauthorized: false },
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProd ? { rejectUnauthorized: false } : false,
});

export default pool;
