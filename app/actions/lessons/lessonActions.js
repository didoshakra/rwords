// actions/lessons/lessonActions.js
"use server"

import { sql } from "@/lib/dbConfig"
import { requireUser, getOptionalUser } from "@/lib/requireUser"

const STATUSES = ["planned", "learning", "done"]
const canEdit = (user, ownerId) => user.role === "admin" || Number(user.id) === Number(ownerId)
const cleanIds = (arr) => [...new Set((arr || []).map(Number))].filter((n) => Number.isInteger(n) && n > 0)

// Список уроків. Для гостя статус завжди 'planned'.
export async function getLessons() {
  const user = await getOptionalUser()
  const uid = user ? Number(user.id) : 0
  return await sql`
    SELECT l.*, u.name AS user_name,
      COALESCE(p.status, 'planned') AS status,
      (SELECT COUNT(*)::int FROM lesson_topics lt WHERE lt.lesson_id = l.id) AS topics_count,
      (SELECT COUNT(*)::int FROM lesson_rules lr WHERE lr.lesson_id = l.id) AS rules_count
    FROM lessons l
    LEFT JOIN users u ON l.user_id = u.id
    LEFT JOIN lesson_progress p ON p.lesson_id = l.id AND p.user_id = ${uid}
    ORDER BY l.pn, l.id
  `
}

// Склад одного уроку: теми й правила у порядку pn
export async function getLessonContent(lessonId) {
  const topics = await sql`
    SELECT t.*, lt.pn AS lesson_pn
    FROM lesson_topics lt
    JOIN topics t ON t.id = lt.topic_id
    WHERE lt.lesson_id = ${lessonId}
    ORDER BY lt.pn, t.id
  `
  const rules = await sql`
    SELECT r.*, lr.pn AS lesson_pn
    FROM lesson_rules lr
    JOIN rules r ON r.id = lr.rule_id
    WHERE lr.lesson_id = ${lessonId}
    ORDER BY lr.pn, r.id
  `
  return { topics, rules }
}

export async function createLesson(form) {
  const user = await requireUser()
  const title = (form?.title || "").trim()
  if (!title) throw new Error("Потрібна назва уроку")
  const description = form.description || ""

  const maxPnRes = await sql`SELECT MAX(pn) AS maxpn FROM lessons`
  const pn = (maxPnRes[0].maxpn || 0) + 1

  const result = await sql`
    INSERT INTO lessons (pn, title, description, user_id)
    VALUES (${pn}, ${title}, ${description}, ${Number(user.id)})
    RETURNING *
  `
  return result[0]
}

export async function updateLesson(id, form) {
  const user = await requireUser()
  const res = await sql`SELECT user_id FROM lessons WHERE id = ${id}`
  const lesson = res[0]
  if (!lesson) throw new Error("Урок не знайдено")
  if (!canEdit(user, lesson.user_id)) throw new Error("Недостатньо прав для редагування")

  const title = (form?.title || "").trim()
  if (!title) throw new Error("Потрібна назва уроку")
  await sql`
    UPDATE lessons SET title = ${title}, description = ${form.description || ""} WHERE id = ${id}
  `
}

// Видалення: адмін усі, інші лише свої. Підтвердження показує сторінка
// (кількість тем і правил береться з getLessons: topics_count, rules_count).
export async function deleteLessons(ids) {
  const user = await requireUser()
  if (!Array.isArray(ids) || ids.length === 0) return
  if (user.role === "admin") {
    await sql`DELETE FROM lessons WHERE id = ANY(${ids})`
  } else {
    await sql`DELETE FROM lessons WHERE id = ANY(${ids}) AND user_id = ${Number(user.id)}`
  }
}

// Порядок самих уроків: власник (свої) або адмін (усі)
export async function updateLessonsPn(lessons) {
  const user = await requireUser()
  if (!lessons || lessons.length === 0) return
  const ids = lessons.map((l) => l.id)
  const pns = lessons.map((l) => l.pn)
  if (user.role === "admin") {
    await sql`
      UPDATE lessons AS t SET pn = v.pn
      FROM unnest(${ids}::int[], ${pns}::int[]) AS v(id, pn)
      WHERE t.id = v.id
    `
  } else {
    await sql`
      UPDATE lessons AS t SET pn = v.pn
      FROM unnest(${ids}::int[], ${pns}::int[]) AS v(id, pn)
      WHERE t.id = v.id AND t.user_id = ${Number(user.id)}
    `
  }
}

// Склад уроку: повна заміна списків тем і правил в одній транзакції.
// Порядок масиву = pn (1, 2, 3...). Неіснуючі id пропускаються (JOIN). Лише власник або адмін.
export async function setLessonContent(lessonId, topicIds, ruleIds) {
  const user = await requireUser()
  const res = await sql`SELECT user_id FROM lessons WHERE id = ${lessonId}`
  const lesson = res[0]
  if (!lesson) throw new Error("Урок не знайдено")
  if (!canEdit(user, lesson.user_id)) throw new Error("Недостатньо прав для зміни складу")

  const tIds = cleanIds(topicIds)
  const rIds = cleanIds(ruleIds)

  await sql.begin(async (tx) => {
    await tx`DELETE FROM lesson_topics WHERE lesson_id = ${lessonId}`
    if (tIds.length > 0) {
      await tx`
        INSERT INTO lesson_topics (lesson_id, topic_id, pn)
        SELECT ${lessonId}, t.id, x.ord
        FROM unnest(${tIds}::int[]) WITH ORDINALITY AS x(topic_id, ord)
        JOIN topics t ON t.id = x.topic_id
      `
    }
    await tx`DELETE FROM lesson_rules WHERE lesson_id = ${lessonId}`
    if (rIds.length > 0) {
      await tx`
        INSERT INTO lesson_rules (lesson_id, rule_id, pn)
        SELECT ${lessonId}, r.id, x.ord
        FROM unnest(${rIds}::int[]) WITH ORDINALITY AS x(rule_id, ord)
        JOIN rules r ON r.id = x.rule_id
      `
    }
  })
}

// Персональний статус: planned | learning | done
export async function setLessonStatus(lessonId, status) {
  const user = await requireUser()
  if (!STATUSES.includes(status)) throw new Error("Невідомий статус")
  const res = await sql`SELECT 1 FROM lessons WHERE id = ${lessonId}`
  if (res.length === 0) throw new Error("Урок не знайдено")

  await sql`
    INSERT INTO lesson_progress (user_id, lesson_id, status, updated_at)
    VALUES (${Number(user.id)}, ${lessonId}, ${status}, NOW())
    ON CONFLICT (user_id, lesson_id)
    DO UPDATE SET status = EXCLUDED.status, updated_at = NOW()
  `
}
