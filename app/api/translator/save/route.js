// app/api/translator/save/route.js //приймає { original, translation, topicId }, зберігає в таблицю words з типом 'dialogue'.

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { sql } from "@/lib/dbConfig"

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { original, translation, topicId = 1 } = await req.json()

    if (!original?.trim() || !translation?.trim()) {
      return Response.json({ error: "Відсутній текст або переклад" }, { status: 400 })
    }

    const userId = session.user.id

    // Беремо максимальний pn теми (той самий патерн що й createWord)
    const maxPnRes = await sql`
      SELECT MAX(pn) AS maxpn FROM words WHERE topic_id = ${topicId}
    `
    const pn = (maxPnRes[0].maxpn || 0) + 1

    const result = await sql`
      INSERT INTO words (word, translation, topic_id, pn, know, img, group_key, type, user_id)
      VALUES (
        ${original.trim()},
        ${translation.trim()},
        ${topicId},
        ${pn},
        ${false},
        ${""},
        ${""},
        ${"dialogue"},
        ${userId}
      )
      RETURNING *
    `

    return Response.json({ success: true, word: result[0] })

  } catch (err) {
    console.error("translator/save error:", err.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}