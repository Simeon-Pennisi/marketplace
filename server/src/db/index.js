import { Pool } from "pg";
import "dotenv/config";

console.log("DATABASE_URL from env:", process.env.DATABASE_URL);

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not set. Check your .env file.");
  process.exit(1);
}

const pool = new Pool({ connectionString });

export default pool;
