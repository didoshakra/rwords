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
// Видалити кілька секцій (масив id, тільки власник або адмін)
export async function deleteSections(ids, userId, role) {
  console.log("sectionActions/deleteSections/ids", ids)
  if (!userId) throw new Error("Користувач не авторизований")
  if (!Array.isArray(ids) || ids.length === 0) return

  if (role !== "admin") {
    // Видаляємо лише ті секції, які належать користувачу
    await sql`
      DELETE FROM sections
      WHERE id = ANY(${ids}) AND user_id = ${userId}
    `
  } else {
    // Адмін може видаляти всі секції незалежно від власника
    await sql`
      DELETE FROM sections
      WHERE id = ANY(${ids})
    `
  }
}