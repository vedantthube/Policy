const dotenv = require("dotenv");
const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

console.log("ENV PATH:", path.join(__dirname, "../../.env"));
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("PostgreSQL error:", err);
});

module.exports = pool;
