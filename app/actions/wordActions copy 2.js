// app/actions/wordActions.js
"use server"

import { sql } from "@/lib/dbConfig"

export async function getWords() {
  const result = await sql`SELECT * FROM words ORDER BY pn, id`
  return result.rows
}

export async function createWord(form, user_id) {
  if (!user_id) throw new Error("Користувач не авторизований")

  const { word, translation = "", topic_id = 1, pn = 0, know = false, img = "" } = form

  const result = await sql`
    INSERT INTO words (word, translation, topic_id, pn, know, img, user_id)
    VALUES (${word}, ${translation}, ${topic_id}, ${pn}, ${know}, ${img}, ${user_id})
    RETURNING *
  `
  return result.rows[0]
}

export async function updateWord(id, form, user) {
  if (!user) throw new Error("Користувач не авторизований")

  const result = await sql`SELECT user_id FROM words WHERE id = ${id}`
  const word = result.rows[0]
  if (!word) throw new Error("Слово не знайдено")

  if (user.role !== "admin" && user.id !== word.user_id) {
    throw new Error("Недостатньо прав для редагування")
  }

  const { word: w, translation = "", topic_id = 1, pn = 0, know = false, img = "" } = form

  await sql`
    UPDATE words
    SET word = ${w}, translation = ${translation}, topic_id = ${topic_id}, pn = ${pn}, know = ${know}, img = ${img}
    WHERE id = ${id}
  `
}

export async function deleteWord(id, user) {
  if (!user) throw new Error("Користувач не авторизований")

  const result = await sql`SELECT user_id FROM words WHERE id = ${id}`
  const word = result.rows[0]
  if (!word) throw new Error("Слово не знайдено")

  if (user.role !== "admin" && user.id !== word.user_id) {
    throw new Error("Недостатньо прав для видалення")
  }

  await sql`DELETE FROM words WHERE id = ${id}`
}
