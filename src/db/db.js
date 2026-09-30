const dotenv = require("dotenv");
const { Pool } = require("pg");
const path = require("path");

// Load .env locally (Render automatically provides env vars in production)
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production" ||
    process.env.DATABASE_URL?.includes("supabase")
      ? { rejectUnauthorized: false }
      : false,
  // Force IPv4 DNS lookup to prevent ENETUNREACH errors on Render
  options: "-c search_path=public",
  host: process.env.DATABASE_URL
    ? new URL(process.env.DATABASE_URL).hostname
    : undefined,
});

// Configure pool error handling
pool.on("connect", () => {
  console.log("PostgreSQL connected successfully");
});

pool.on("error", (err) => {
  console.error("PostgreSQL pool error:", err);
});

module.exports = pool;
