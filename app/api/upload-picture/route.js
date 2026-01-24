// app/api/upload-picture/route.js
import { NextResponse } from "next/server"
import { createPicture } from "@/app/actions/pictures/picturesActions"
import sharp from "sharp"
import cloudinary from "@/lib/cloudinary"

export const POST = async (req) => {
  try {
    const formData = await req.formData()

    const file = formData.get("file")
    const title = formData.get("title") || ""
    const pictures_name = formData.get("pictures_name") || ""
    const topic_id = Number(formData.get("topic_id")) || 0
    const userId = 1 // 🔹 заміни на актуального користувача з сесії

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Файл не передано" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // 🔹 обробка зображення через sharp
    const image = sharp(buffer)
    const meta = await image.metadata()
    const MAX_WIDTH = 1920

    const optimizedBuffer = await image
      .resize({
        width: meta.width > MAX_WIDTH ? MAX_WIDTH : meta.width,
        withoutEnlargement: true,
      })
      .toFormat("webp", { quality: 80 })
      .toBuffer()

    // 🔹 upload на Cloudinary
    console.log("🔹 POST /api/upload-picture отримано formData")
    console.log("file:", file)
    console.log("title:", title)
    console.log("pictures_name:", pictures_name)
    console.log("topic_id:", topic_id)

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "pictures", resource_type: "image" }, (err, result) => {
          if (err) reject(err)
          else resolve(result)
        })
        .end(optimizedBuffer)
    })

    // 🔹 запис у БД
    const picture = await createPicture(
      {
        title,
        pictures_name,
        file_name: file.name,
        url: uploadResult.secure_url,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes,
        topic_id,
        pn: 0,
      },
      userId,
    )
    console.log("🔹 createPicture результат", picture)

    return NextResponse.json(picture)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
