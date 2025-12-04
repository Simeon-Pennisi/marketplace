// pg pool
const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not set in .env");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle Postgres client", err);
  process.exit(-1);
});

module.exports = pool;
