// app/api/app-import/route.js
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { sql } from "@/lib/dbConfig"

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const { words } = await req.json() 

  if (!Array.isArray(words) || words.length === 0) {
    return Response.json({ error: "No words" }, { status: 400 })
  }

  try {
    // 1. Знайти або створити приватну секцію "З додатку"
    let [section] = await sql`
      SELECT id FROM sections
      WHERE user_id = ${userId} AND name = 'З додатку'
      LIMIT 1
    `
    if (!section) {
      ;[section] = await sql`
        INSERT INTO sections (name, user_id, is_private, img)
        VALUES ('З додатку', ${userId}, true, 'mobile')
        RETURNING id
      `
    }

    // 2. Створити нову тему з датою
    const topicName = `Імпорт ${new Date().toLocaleDateString("uk-UA")}`
    const [topic] = await sql`
      INSERT INTO topics (name, user_id, section_id, is_private)
      VALUES (${topicName}, ${userId}, ${section.id}, true)
      RETURNING id
    `

    // 3. Записати слова
    let pn = 1
    for (const w of words) {
      await sql`
        INSERT INTO words (word, translation, topic_id, pn, know, img, group_key, type, user_id)
        VALUES (
          ${w.word}, ${w.translation ?? ""}, ${topic.id}, ${pn++},
          ${w.know ?? false}, ${w.img ?? ""}, ${w.group_key ?? ""}, ${w.type ?? "word"},
          ${userId}
        )
      `
    }

    return Response.json({ ok: true, count: words.length, topicId: topic.id })
  } catch (err) {
    console.error("app-import error:", err)
    return Response.json({ error: "Server error" }, { status: 500 })
  }
}
