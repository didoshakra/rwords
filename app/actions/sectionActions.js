// sectionActions.js
"use server"

import { sql } from "@/lib/dbConfig"

// Отримати всі секції (усі бачать)
export async function getSections() {
  const result = await sql`
    SELECT sections.*, users.name AS user_name
    FROM sections
    LEFT JOIN users ON sections.user_id = users.id
    ORDER BY sections.pn, sections.id
  `
  return result // повертаємо масив рядків напряму
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
  return result[0] // повертаємо вставлену секцію
}

// Оновити секцію (тільки власник або адмін)
export async function updateSection(id, form, user) {
  if (!user) throw new Error("Користувач не авторизований")

  const result = await sql`SELECT user_id FROM sections WHERE id = ${id}`
  const section = result[0]
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
  const section = result[0]
  if (!section) throw new Error("Секція не знайдена")

  if (user.role !== "admin" && user.id !== section.user_id) {
    throw new Error("Недостатньо прав для видалення")
  }

  await sql`DELETE FROM sections WHERE id = ${id}`
}