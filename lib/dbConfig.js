// lib/dbConfig.js
import postgres from "postgres"

// Налаштування підключення до бази даних PostgreSQL
// SSL потрібен для Supabase та Neon
const needSSL = process.env.PGSQL_SSL === "true"

export const sql = postgres({
  host: process.env.PGSQL_HOST,
  port: Number(process.env.PGSQL_PORT), 
  database: process.env.PGSQL_DATABASE,
  username: process.env.PGSQL_USER,
  password: process.env.PGSQL_PASSWORD,
  ssl: needSSL ? { rejectUnauthorized: false } : false,
})

