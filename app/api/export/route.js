// /app/api/export/route.js
import { sql } from "@/lib/dbConfig"

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const ids = (searchParams.get("ids") || "")
      .split(",")
      .map((s) => parseInt(s, 10))
      .filter((n) => Number.isFinite(n))

    if (!ids.length) {
      return new Response(JSON.stringify({ error: "Provide ?ids=1,2,3" }), { status: 400 })
    }

    // 1) Теми
    const topics = await sql`
      SELECT id, section_id, name, img, pn
      FROM topics
      WHERE id = ANY(${ids}::int[])
    `

    // 2) Відповідні секції
    const sectionIds = Array.from(new Set(topics.map((t) => t.section_id)))
    const sections = sectionIds.length
      ? await sql`
          SELECT id, name, img, pn
          FROM sections
          WHERE id = ANY(${sectionIds}::int[])
        `
      : []

    // 3) Слова обраних тем
    const words = await sql`
      SELECT id, topic_id, word, translation, img, pn
      FROM words
      WHERE topic_id = ANY(${ids}::int[])
    `

    const payload = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      sections,
      topics,
      words,
    }

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: err.message || "Unknown error" }), { status: 500 })
  }
}
