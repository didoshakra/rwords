//lib/userSettings.js
import { sql } from "@/lib/dbConfig"

export async function getUserSettings(userId) {
  const [row] = await sql`SELECT * FROM users_settings WHERE user_id = ${userId}`
  if (row) return row

  const [created] = await sql`
    INSERT INTO users_settings (user_id)
    VALUES (${userId})
    RETURNING *
  `
  return created
}

export async function updateUserSettings(userId, fields) {
  const allowed = ["from_lang", "to_lang"]
  const updates = Object.entries(fields).filter(([key]) => allowed.includes(key))
  if (updates.length === 0) return getUserSettings(userId)

  for (const [key, value] of updates) {
    await sql`UPDATE users_settings SET ${sql(key)} = ${value}, updated_at = NOW() WHERE user_id = ${userId}`
  }

  return getUserSettings(userId)
}