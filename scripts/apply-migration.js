// One-time script to apply 00006_portfolio_allocations.sql migration
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// Read .env.local
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
const env = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const idx = trimmed.indexOf("=");
    if (idx > 0) env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
}

const projectRef = env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "").split(".")[0];
const password = env.SUPABASE_SERVICE_ROLE_KEY;

if (!projectRef || !password) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const sql = fs.readFileSync(
  path.join(__dirname, "..", "supabase", "migrations", "00006_portfolio_allocations.sql"),
  "utf8"
);

const pool = new Pool({
  host: `db.${projectRef}.supabase.co`,
  port: 6543,
  database: "postgres",
  user: "postgres",
  password,
  ssl: { rejectUnauthorized: false },
});

pool
  .query(sql)
  .then(() => {
    console.log("✅ Migration 00006 applied successfully!");
    pool.end();
  })
  .catch((e) => {
    console.error("❌ Migration failed:", e.message);
    pool.end();
    process.exit(1);
  });
