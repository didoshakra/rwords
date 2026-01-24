// app/actions/cloudinary/clearCloudinaryAndDB.js
"use server"

import cloudinary from "@/lib/cloudinary"
import { sql } from "@/lib/dbConfig"

export async function clearCloudinaryAndDB() {
  let totalCloudinary = 0
  let nextCursor

  try {
    do {
      const res = await cloudinary.api.resources({
        type: "upload",
        prefix: "pictures/",
        max_results: 100,
        next_cursor: nextCursor,
      })

      if (!res.resources.length) break

      const ids = res.resources.map((r) => r.public_id)
      const del = await cloudinary.api.delete_resources(ids)

      // Рахуємо реально видалені public_id
      totalCloudinary += Object.values(del.deleted).filter((v) => v === "deleted").length

      nextCursor = res.next_cursor
    } while (nextCursor)

    // Видаляємо всі записи у таблиці pictures та рахуємо їх
    const deletedDB = await sql`DELETE FROM pictures RETURNING id`
    const totalDB = deletedDB.length

    return {
      totalCloudinary,
      totalDB,
      message: `🗑️ Видалено ${totalCloudinary} файлів у Cloudinary та ${totalDB} записів у БД.`,
    }
  } catch (err) {
    const message = err?.error?.message || err?.message || "Cloudinary unknown error"
    throw new Error(message)
  }
}

