// sectionActions.js
"use server"

import { sql } from "@/lib/dbConfig"

// Отримати всі секції (усі бачать)
export async function getSections(user_id = null, role = null) {
  const result = await sql`
    SELECT sections.*, users.name AS user_name
    FROM sections
    LEFT JOIN users ON sections.user_id = users.id
    WHERE sections.is_private = false
       OR sections.user_id = ${user_id}
       OR ${role} = 'admin'
    ORDER BY sections.pn, sections.id
  `
  return result
}

// Створити секцію (тільки зареєстровані користувачі)
export async function createSection(form, user_id) {
  if (!user_id) throw new Error("Користувач не авторизований")

  const { name, link = "", is_private = false } = form

  const maxPnRes = await sql`SELECT MAX(pn) AS maxpn FROM sections`
  const pn = (maxPnRes[0].maxpn || 0) + 1

  const result = await sql`
    INSERT INTO sections (name, link, pn, user_id, is_private)
    VALUES (${name}, ${link}, ${pn}, ${user_id}, ${is_private})
    RETURNING *
  `
  return result[0]
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

  const { name, link = "", is_private = false } = form

  await sql`
  UPDATE sections
  SET name = ${name}, link = ${link}, is_private = ${is_private}
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

// Перерахунок pn секцій після переміщення
export async function updateSectionsPn(sections, userId) {
  if (!userId) throw new Error("Користувач не авторизований")
  if (!sections || sections.length === 0) return

  const ids = sections.map((s) => s.id)
  const pns = sections.map((s) => s.pn)

  await sql`
    UPDATE sections AS s
    SET pn = v.pn
    FROM unnest(${ids}::int[], ${pns}::int[]) AS v(id, pn)
    WHERE s.id = v.id
  `
}
