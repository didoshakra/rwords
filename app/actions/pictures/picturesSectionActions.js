// actions/pictures/sectionActions.js
"use server"

import { sql } from "@/lib/dbConfig"

// Отримати всі секції (усі бачать)
export async function getSections() {
  const result = await sql`
    SELECT pictures_sections.*, users.name AS user_name
    FROM pictures_sections
    LEFT JOIN users ON pictures_sections.user_id = users.id
    ORDER BY pictures_sections.pn, pictures_sections.id
  `
  return result // повертаємо масив рядків напряму
}

// Створити секцію (тільки зареєстровані користувачі)
export async function createSection(form, user_id) {
  if (!user_id) throw new Error("Користувач не авторизований")

  const { name,  pn = 0 } = form

  const result = await sql`
    INSERT INTO pictures_sections (name,pn, user_id)
    VALUES (${name}, ${pn}, ${user_id})
    RETURNING *
  `
  return result[0] // повертаємо вставлену секцію
}

// Оновити секцію (тільки власник або адмін)
export async function updateSection(id, form, user) {
  if (!user) throw new Error("Користувач не авторизований")

  const result = await sql`SELECT user_id FROM pictures_sections WHERE id = ${id}`
  const section = result[0]
  if (!section) throw new Error("Секція не знайдена")

  if (user.role !== "admin" && user.id !== section.user_id) {
    throw new Error("Недостатньо прав для редагування")
  }

  const { name,  pn = 0 } = form

  await sql`
    UPDATE pictures_sections
    SET name = ${name}, pn = ${pn}
    WHERE id = ${id}
  `
}

// Видалити секцію (тільки власник або адмін)
export async function deleteSection(id, user) {
  if (!user) throw new Error("Користувач не авторизований")

  const result = await sql`SELECT user_id FROM pictures_sections WHERE id = ${id}`
  const section = result[0]
  if (!section) throw new Error("Секція не знайдена")

  if (user.role !== "admin" && user.id !== section.user_id) {
    throw new Error("Недостатньо прав для видалення")
  }

  await sql`DELETE FROM pictures_sections WHERE id = ${id}`
}
// Видалити кілька секцій (масив id, тільки власник або адмін)
export async function deleteSections(ids, userId, role) {
  console.log("sectionActions/deletePicturesSections/ids", ids)
  if (!userId) throw new Error("Користувач не авторизований")
  if (!Array.isArray(ids) || ids.length === 0) return

  if (role !== "admin") {
    // Видаляємо лише ті секції, які належать користувачу
    await sql`
      DELETE FROM pictures_sections
      WHERE id = ANY(${ids}) AND user_id = ${userId}
    `
  } else {
    // Адмін може видаляти всі секції незалежно від власника
    await sql`
      DELETE FROM pictures_sections
      WHERE id = ANY(${ids})
    `
  }
}