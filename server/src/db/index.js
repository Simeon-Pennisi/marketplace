import { Pool } from "pg";
import "dotenv/config";

const isProd = process.env.NODE_ENV === "production";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not set. Check your .env file.");
  process.exit(1);
}
// const pool = new Pool({ connectionString });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProd ? { rejectUnauthorized: false } : false,
});

export default pool;
