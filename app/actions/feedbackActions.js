// feedbackActions.js
"use server"

import { sql } from "@/lib/dbConfig"

export async function getFeedback() {
  return await sql`SELECT * FROM feedback ORDER BY created_at DESC`
}

export async function createFeedback(userId, type, title, message) {
  const result = await sql`
    INSERT INTO feedback (user_id, type, title, message)
    VALUES (${userId}, ${type}, ${title}, ${message})
    RETURNING *;
  `
  return result[0]
}

export async function deleteFeedback(id) {
  const result = await sql`
    DELETE FROM feedback
    WHERE id = ${id}
    RETURNING *;
  `
  return result[0]
}