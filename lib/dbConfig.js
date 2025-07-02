//lib/dbConfig.js
import postgres from "postgres"

export const sql = postgres({
  host: process.env.PGSQL_HOST,
  port: 5432,
  database: process.env.PGSQL_DATABASE,
  username: process.env.PGSQL_USER,
  password: process.env.PGSQL_PASSWORD,
  ssl: process.env.PGSQL_SSL === "true" ? { rejectUnauthorized: false } : false,
})
