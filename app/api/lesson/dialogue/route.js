//app/api/lesson/dialogue/route.js (новий, на Vercel)
// app/api/lesson/dialogue/route.js
// Приймає: { rule: {title, content_json} | null, words: [{word, translation, type}], history: [{role, content}], userMessage }
// Повертає: { reply }
//
// Перевикористовує GROQ_API_KEY (той самий, що й для STT) — Groq має
// OpenAI-сумісний чат-ендпоінт з Llama-моделями.

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "llama-3.3-70b-versatile"

// {columns, rows} -> текстова таблиця "Колонка1 | Колонка2\nзначення | значення"
function ruleContentToText(contentJson) {
  try {
    const content = JSON.parse(contentJson)
    const lines = [content.columns.join(" | ")]
    content.rows.forEach((row) => lines.push(row.join(" | ")))
    return lines.join("\n")
  } catch {
    return ""
  }
}

function buildSystemPrompt(rule, words) {
  const wordsList = (words || []).map((w) => `${w.word} — ${w.translation}`).join("; ")

  const ruleBlock = rule
    ? `Граматична тема уроку: "${rule.title}"\n${ruleContentToText(rule.content_json)}`
    : "Граматичної теми для цього уроку немає."

  return `Ти — дружній терплячий вчитель англійської мови для дорослого учня рівня A1.

${ruleBlock}

Учень щойно вивчив ці слова та вирази: ${wordsList || "(список порожній)"}

КРИТИЧНО ВАЖЛИВО — мова кожного рядка твоєї відповіді:
- Рядок 1 — ЗАВЖДИ УКРАЇНСЬКОЮ:
 - Якщо відповідь учня правильна — напиши рівно одне слово: "Добре".
 - Якщо є помилка — коротко (одне речення) поясни, яка саме помилка і чому це неправильно.
- Рядок 2 — ЗАВЖДИ АНГЛІЙСЬКОЮ: наступне просте питання (до 10 слів), використовуючи ЛИШЕ слова та граматику з уроку.
- Питання НІКОЛИ не пиши українською, навіть якщо учень відповів українською або з помилками.
- Не виходь за межі слів і граматики цього уроку.
- Без зайвих пояснень, без списків, без лапок навколо питання.

Приклад правильної відповіді (саме такий формат, два рядки):
Добре! Спробуй наступного разу відповісти повним реченням.
What is your favorite color?

Ще приклад:
Молодець, все правильно!
Where do you live?`
}

export async function POST(req) {
  try {
    const {rule, words, history, userMessage} = await req.json()

    const systemPrompt = buildSystemPrompt(rule, words)

    const messages = [
      {role: "system", content: systemPrompt},
      ...(history || []),
      {
        role: "user",
        content: userMessage?.trim()
          ? userMessage
          : "(Почати діалог. Постав перше просте питання по темі уроку.)",
      },
    ]

    const res = await fetch(GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.6,
        max_tokens: 200,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Groq помилка: ${res.status} ${err}`)
    }

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content?.trim() || ""

    return Response.json({reply})
  } catch (err) {
    console.error("lesson/dialogue error:", err.message)
    return Response.json({error: err.message}, {status: 500})
  }
}