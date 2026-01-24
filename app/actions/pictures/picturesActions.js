//  actions/pictures/picturesActions.js
"use server"

import { sql } from "@/lib/dbConfig"
import cloudinary from "@/lib/cloudinary"

export async function getPictures() {
  const result = await sql`
    SELECT pictures.*, users.name AS user_name
    FROM pictures
    LEFT JOIN users ON pictures.user_id = users.id
    ORDER BY pictures.pn, pictures.id
  `
  return result
}


export async function createPictureFromFile({ file, pictures_name, title, topic_id, user_id }) {
  if (!file) throw new Error("Файл не переданий")
  const originalBytes = file.size // розмір оригінального файлу
  if (!user_id) throw new Error("Користувач не авторизований")

  const buffer = Buffer.from(await file.arrayBuffer())
  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "pictures",
          resource_type: "image",
          format: "webp", // конвертація всіх форматів у WebP
          quality: "auto", // оптимізація розміру
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        },
      )
      .end(buffer)
  })

  const result = await sql`
    INSERT INTO pictures
      (pictures_name, title, file_name, url, format, width, height, bytes, original_bytes, public_id, topic_id, user_id, pn)
    VALUES
      (
        ${pictures_name || file.name},
        ${title || pictures_name || file.name},
        ${file.name},   -- правильне ім'я файлу з браузера
        ${uploadResult.secure_url},
        ${uploadResult.format},
        ${uploadResult.width},
        ${uploadResult.height},
        ${uploadResult.bytes},
        ${originalBytes},
        ${uploadResult.public_id},
        ${topic_id || 1},
        ${user_id},
        0
      )
    RETURNING *
  `

  return result[0]
}


export async function updatePicture(id, form, userId, role) {
  if (!userId) throw new Error("Користувач не авторизований")

  // Отримуємо картину з БД
  const result = await sql`SELECT * FROM pictures WHERE id = ${id}`
  const picture = result[0]
  if (!picture) throw new Error("Картину не знайдено")

  // Перевірка прав
  if (role !== "admin" && userId !== picture.user_id) {
    throw new Error("Недостатньо прав для редагування")
  }

  // Беремо лише потрібні поля для редагування
  const pictures_name = form.pictures_name?.trim() ?? picture.pictures_name
  const title = form.title?.trim() ?? picture.title
  const topic_id = form.topic_id ?? picture.topic_id
  const pn = form.pn ?? picture.pn

  // Оновлюємо лише ці поля
  await sql`
    UPDATE pictures
    SET pictures_name = ${pictures_name},
        title = ${title},
        topic_id = ${topic_id},
        pn = ${pn}
    WHERE id = ${id}
  `
}

export async function deletePictures(ids, userId, role) {
  if (!userId) throw new Error("Користувач не авторизований")
  if (!Array.isArray(ids) || ids.length === 0) return

  // 1️⃣ Отримуємо public_id + перевіряємо права
  const pictures = await sql`
    SELECT id, public_id, user_id
    FROM pictures
    WHERE id = ANY(${ids})
  `

  const allowed = role === "admin" ? pictures : pictures.filter((p) => p.user_id === userId)

  if (allowed.length === 0) return

  const allowedIds = allowed.map((p) => p.id)
  const publicIds = allowed.map((p) => p.public_id).filter(Boolean)

  // 2️⃣ Видалення з Cloudinary
  if (publicIds.length > 0) {
    await cloudinary.api.delete_resources(publicIds)
  }

  // 3️⃣ Видалення з БД
  await sql`
    DELETE FROM pictures
    WHERE id = ANY(${allowedIds})
  `
}


// export async function deletePictures(ids, userId, role) {
//   console.log("picturesActions/deletePictures/ids=", ids)
//   if (!userId) throw new Error("Користувач не авторизований")
//   if (!Array.isArray(ids) || ids.length === 0) return

//   if (role !== "admin") {
//     await sql`
//       DELETE FROM pictures
//       WHERE id = ANY(${ids}) AND user_id = ${userId}
//     `
//   } else {
//     await sql`
//       DELETE FROM pictures
//       WHERE id = ANY(${ids})
//     `
//   }
// }

export async function updatePicturePn(id, pn, userId, role) {
  if (!userId) throw new Error("Користувач не авторизований")

  const [pictures] = await sql`SELECT user_id FROM pictures WHERE id = ${id}`
  if (!pictures) throw new Error("Картинку не знайдено")

  if (role !== "admin" && userId !== pictures.user_id) {
    throw new Error("Недостатньо прав")
  }

  await sql`UPDATE pictures SET pn = ${pn} WHERE id = ${id}`
}
