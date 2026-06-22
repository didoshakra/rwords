// app/api/translator/save/route.js //приймає { original, translation, topicId }, зберігає в таблицю words з типом 'dialogue'.

// app/api/translator/save/route.js

import { sql } from "@/lib/dbConfig"

const getTodayTopicName = () => {
  const now = new Date()
  const dd   = String(now.getDate()).padStart(2, '0')
  const mm   = String(now.getMonth() + 1).padStart(2, '0')
  const yyyy = now.getFullYear()
  return `Діалоги ${dd}.${mm}.${yyyy}`
}

async function getOrCreateDialogueTopic(userId, userName) {
  const topicName = getTodayTopicName()

  let sectionId
  const sectionRes = await sql`
    SELECT id FROM sections
    WHERE is_private = true AND user_id = ${userId}
    LIMIT 1
  `
  if (sectionRes.length > 0) {
    sectionId = sectionRes[0].id
  } else {
    const sectionName = `${userName || "Користувач"}_${userId}`
    const maxPnRes = await sql`SELECT MAX(pn) AS maxpn FROM sections`
    const pn = (maxPnRes[0].maxpn || 0) + 1
    const inserted = await sql`
      INSERT INTO sections (name, img, pn, user_id, is_private)
      VALUES (${sectionName}, 'inbox', ${pn}, ${userId}, true)
      RETURNING id
    `
    sectionId = inserted[0].id
  }

  let topicId
  const topicRes = await sql`
    SELECT id FROM topics
    WHERE name = ${topicName} AND section_id = ${sectionId}
    LIMIT 1
  `
  if (topicRes.length > 0) {
    topicId = topicRes[0].id
  } else {
    const maxPnRes = await sql`SELECT MAX(pn) AS maxpn FROM topics WHERE section_id = ${sectionId}`
    const pn = (maxPnRes[0].maxpn || 0) + 1
    const inserted = await sql`
      INSERT INTO topics (name, img, section_id, pn, user_id)
      VALUES (${topicName}, 'other', ${sectionId}, ${pn}, ${userId})
      RETURNING id
    `
    topicId = inserted[0].id
  }

  return { topicId, topicName }
}

export async function POST(req) {
  try {
    const secret = req.headers.get("x-translator-secret")
    if (secret !== process.env.TRANSLATOR_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { original, translation, userId, userName } = await req.json()

    if (!original?.trim() || !translation?.trim()) {
      return Response.json({ error: "Відсутній текст або переклад" }, { status: 400 })
    }
    if (!userId) {
      return Response.json({ error: "userId відсутній" }, { status: 400 })
    }

    const { topicId, topicName } = await getOrCreateDialogueTopic(userId, userName)

    const maxPnRes = await sql`SELECT MAX(pn) AS maxpn FROM words WHERE topic_id = ${topicId}`
    const pn = (maxPnRes[0].maxpn || 0) + 1

    const result = await sql`
      INSERT INTO words (word, translation, topic_id, pn, know, img, group_key, type, user_id)
      VALUES (
        ${original.trim()}, ${translation.trim()}, ${topicId},
        ${pn}, ${false}, ${""}, ${""}, ${"dialogue"}, ${userId}
      )
      RETURNING *
    `

    return Response.json({ success: true, word: result[0], topicName })

  } catch (err) {
    console.error("translator/save error:", err.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
