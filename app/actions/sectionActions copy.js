// sectionActions.js
"use server"

import { sql } from "@/lib/dbConfig"

// Отримати всі секції (усі бачать)
export async function getSections() {
  const result = await sql`SELECT * FROM sections ORDER BY pn, id`
  return result.rows
}

// Створити секцію (тільки зареєстровані користувачі)
export async function createSection(form, user_id) {
  if (!user_id) throw new Error("Користувач не авторизований")

  const { name, img = "other", pn = 0 } = form

  const result = await sql`
    INSERT INTO sections (name, img, pn, user_id)
    VALUES (${name}, ${img}, ${pn}, ${user_id})
    RETURNING *
  `
  return result.rows[0]
}

// Оновити секцію (тільки власник або адмін)
export async function updateSection(id, form, user) {
  if (!user) throw new Error("Користувач не авторизований")

  // Отримуємо існуючий запис
  const result = await sql`SELECT user_id FROM sections WHERE id = ${id}`
  const section = result.rows[0]
  if (!section) throw new Error("Секція не знайдена")

  if (user.role !== "admin" && user.id !== section.user_id) {
    throw new Error("Недостатньо прав для редагування")
  }

  const { name, img = "other", pn = 0 } = form

  await sql`
    UPDATE sections
    SET name = ${name}, img = ${img}, pn = ${pn}
    WHERE id = ${id}
  `
}

// Видалити секцію (тільки власник або адмін)
export async function deleteSection(id, user) {
  if (!user) throw new Error("Користувач не авторизований")

  const result = await sql`SELECT user_id FROM sections WHERE id = ${id}`
  const section = result.rows[0]
  if (!section) throw new Error("Секція не знайдена")

  if (user.role !== "admin" && user.id !== section.user_id) {
    throw new Error("Недостатньо прав для видалення")
  }

  await sql`DELETE FROM sections WHERE id = ${id}`
}
