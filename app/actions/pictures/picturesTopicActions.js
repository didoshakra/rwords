// topicActions.js
"use server"

import { sql } from "@/lib/dbConfig"

export async function getTopics() {
  const result = await sql`
    SELECT pictures_topics.*, users.name AS user_name
    FROM pictures_topics
    LEFT JOIN users ON pictures_topics.user_id = users.id
    ORDER BY pictures_topics.pn, pictures_topics.id
  `
  return result
}

export async function createTopic(form, user_id) {
  if (!user_id) throw new Error("Користувач не авторизований")

  const { name, pn = 0, section_id = 1 } = form
  console.log("createTopic/form", form)

  const result = await sql`
    INSERT INTO pictures_topics (name,  pn, pictures_sections_id, user_id)
    VALUES (${name},  ${pn}, ${section_id}, ${user_id})
    RETURNING *
  `
  return result[0]
}

export async function updateTopic(id, form, user) {
  if (!user) throw new Error("Користувач не авторизований")

  const result = await sql`SELECT user_id FROM pictures_topics WHERE id = ${id}`
  const topic = result[0]
  if (!topic) throw new Error("Топік не знайдено")

  if (user.role !== "admin" && user.id !== topic.user_id) {
    throw new Error("Недостатньо прав для редагування")
  }

  const { name,  pn = 0, section_id = 1 } = form

  await sql`
    UPDATE pictures_topics
    SET name = ${name}, pictures_sections_id = ${section_id}
    WHERE id = ${id}
  `
}

export async function deleteTopic(id, user) {
  if (!user) throw new Error("Користувач не авторизований")

  const result = await sql`SELECT user_id FROM pictures_topics WHERE id = ${id}`
  const topic = result[0]
  if (!topic) throw new Error("Топік не знайдено")

  if (user.role !== "admin" && user.id !== topic.user_id) {
    throw new Error("Недостатньо прав для видалення")
  }

  await sql`DELETE FROM pictures_topics WHERE id = ${id}`
}

export async function deleteTopics(ids, userId, role) {
    console.log("topicActions/deleteTopics/ids", ids)
  if (!userId) throw new Error("Користувач не авторизований")
  if (!Array.isArray(ids) || ids.length === 0) return

  if (role !== "admin") {
    // Видаляємо лише ті топіки, які належать користувачу
    await sql`
      DELETE FROM pictures_topics
      WHERE id = ANY(${ids}) AND user_id = ${userId}
    `
  } else {
    // Адмін може видаляти всі топіки незалежно від власника
    await sql`
      DELETE FROM pictures_topics
      WHERE id = ANY(${ids})
    `
  }
}
export async function checkTopicRelations(ids) {
  const result = await sql`
    SELECT DISTINCT topic_id
    FROM words
    WHERE topic_id = ANY(${ids})
  `
  return result.map((r) => r.topic_id) // список id, які мають зв’язки
}

