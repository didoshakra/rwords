// actions/lessons/ruleActions.js
"use server"

import { sql } from "@/lib/dbConfig"
import { requireUser } from "@/lib/requireUser"

const canEdit = (user, ownerId) => user.role === "admin" || Number(user.id) === Number(ownerId)

// content = { columns: [..], rows: [[..], ..] }
function validateContent(content) {
  if (!content || !Array.isArray(content.columns) || content.columns.length === 0) {
    throw new Error("Потрібен хоча б один заголовок колонки")
  }
  if (!Array.isArray(content.rows) || content.rows.length === 0) {
    throw new Error("Потрібен хоча б один рядок даних")
  }
  const n = content.columns.length
  content.rows.forEach((row, i) => {
    if (!Array.isArray(row) || row.length !== n) {
      throw new Error(`Рядок ${i + 1} має ${Array.isArray(row) ? row.length : 0} комірок, а заголовок ${n}`)
    }
  })
  return {
    columns: content.columns.map((c) => String(c).trim()),
    rows: content.rows.map((r) => r.map((c) => String(c).trim())),
  }
}

export async function getRules() {
  return await sql`
    SELECT rules.*, users.name AS user_name
    FROM rules
    LEFT JOIN users ON rules.user_id = users.id
    ORDER BY rules.pn, rules.id
  `
}

export async function createRule(form) {
  const user = await requireUser()
  const title = (form?.title || "").trim()
  if (!title) throw new Error("Потрібна назва правила")
  const content = validateContent(form.content_json)
  const priority = form.priority ? 1 : 0

  const maxPnRes = await sql`SELECT MAX(pn) AS maxpn FROM rules`
  const pn = (maxPnRes[0].maxpn || 0) + 1

  const result = await sql`
    INSERT INTO rules (pn, title, content_json, priority, user_id)
    VALUES (${pn}, ${title}, ${JSON.stringify(content)}::jsonb, ${priority}, ${Number(user.id)})
    RETURNING *
  `
  return result[0]
}

export async function updateRule(id, form) {
  const user = await requireUser()
  const res = await sql`SELECT user_id FROM rules WHERE id = ${id}`
  const rule = res[0]
  if (!rule) throw new Error("Правило не знайдено")
  if (!canEdit(user, rule.user_id)) throw new Error("Недостатньо прав для редагування")

  const title = (form?.title || "").trim()
  if (!title) throw new Error("Потрібна назва правила")
  const content = validateContent(form.content_json)
  const priority = form.priority ? 1 : 0

  await sql`
    UPDATE rules
    SET title = ${title}, content_json = ${JSON.stringify(content)}::jsonb, priority = ${priority}
    WHERE id = ${id}
  `
}

// Видалення: адмін усі, інші лише свої. Підтвердження показує сторінка (див. checkRuleRelations).
export async function deleteRules(ids) {
  const user = await requireUser()
  if (!Array.isArray(ids) || ids.length === 0) return
  if (user.role === "admin") {
    await sql`DELETE FROM rules WHERE id = ANY(${ids})`
  } else {
    await sql`DELETE FROM rules WHERE id = ANY(${ids}) AND user_id = ${Number(user.id)}`
  }
}

// Для попередження перед видаленням: у скількох уроках є кожне правило.
// Повертає [{ rule_id, lessons_count }] лише для правил, що входять в уроки.
export async function checkRuleRelations(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return []
  const result = await sql`
    SELECT rule_id, COUNT(*)::int AS lessons_count
    FROM lesson_rules
    WHERE rule_id = ANY(${ids})
    GROUP BY rule_id
  `
  return result.map((r) => ({ rule_id: r.rule_id, lessons_count: r.lessons_count }))
}

// Перерахунок pn після переміщення (усі, хто увійшов, як і для тем)
export async function updateRulesPn(rules) {
  await requireUser()
  if (!rules || rules.length === 0) return
  const ids = rules.map((r) => r.id)
  const pns = rules.map((r) => r.pn)
  await sql`
    UPDATE rules AS t
    SET pn = v.pn
    FROM unnest(${ids}::int[], ${pns}::int[]) AS v(id, pn)
    WHERE t.id = v.id
  `
}
