// app/actions/feedbackActions.js
"use server"

import { sql } from "@/lib/dbConfig"

// Всі відгуки з ім'ям користувача
export async function getFeedback() {
  return await sql`
    SELECT f.*, u.name AS user_name
    FROM feedback f
    LEFT JOIN users u ON f.user_id = u.id
    ORDER BY f.created_at DESC
  `
}

// Додавання відгуку
export async function createFeedback(userId, type, title, message) {
  await sql`
    INSERT INTO feedback (user_id, type, title, message)
    VALUES (${userId}, ${type}, ${title}, ${message})
  `
}

// Видалення відгуку
export async function deleteFeedback(id) {
  await sql`
    DELETE FROM feedback
    WHERE id = ${id}
  `
}
