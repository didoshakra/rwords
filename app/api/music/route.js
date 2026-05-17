// app / api / music / route.js
import { readdir, readFile } from "fs/promises"
import { join } from "path"

const MUSIC_FOLDERS = {
  atmospheric: "atmospheric",
  philosophical: "philosophical",
  mystical: "mystical",
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") || "atmospheric"

    const folder = MUSIC_FOLDERS[type]
    if (!folder) {
      return Response.json({ error: "Невідомий тип музики" }, { status: 400 })
    }

    const folderPath = join(process.cwd(), "public", "music", folder)

    // Знаходимо перший аудіо файл в папці
    const files = await readdir(folderPath)
    const audioFile = files.find((f) => f.endsWith(".mp3") || f.endsWith(".wav") || f.endsWith(".ogg"))

    if (!audioFile) {
      return Response.json({ error: `Файл не знайдено в папці ${folder}` }, { status: 404 })
    }

    const filePath = join(folderPath, audioFile)
    const fileBuffer = await readFile(filePath)

    const mimeType = audioFile.endsWith(".mp3") ? "audio/mpeg" : audioFile.endsWith(".wav") ? "audio/wav" : "audio/ogg"

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (err) {
    console.error("Music route error:", err)
    return Response.json({ error: "Помилка завантаження музики" }, { status: 500 })
  }
}