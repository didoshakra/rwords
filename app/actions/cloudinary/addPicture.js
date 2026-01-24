// app/actions/cloudinary/addPicture.js
"use server"

import cloudinary from "@/lib/cloudinary"
import { sql } from "@/lib/dbConfig"

export async function addPicture(filePath) {
  try {
    // Завантаження в Cloudinary
    const res = await cloudinary.uploader.upload(filePath, {
      folder: "pictures",
    })

    // res містить: secure_url, format, width, height, bytes, public_id і т.д.
    const dbRes = await sql`
      INSERT INTO pictures (url, format, width, height, bytes, public_id)
      VALUES (${res.secure_url}, ${res.format}, ${res.width}, ${res.height}, ${res.bytes}, ${res.public_id})
      RETURNING *
    `

    return {
      message: `✅ Файл додано: ${res.secure_url}`,
      picture: dbRes[0],
    }
  } catch (err) {
    console.error("Cloudinary/DB error:", err)
    throw new Error(err?.message || "Помилка додавання файлу")
  }
}
