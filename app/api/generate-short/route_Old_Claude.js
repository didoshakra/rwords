//app/api/generate-short/route.js //Claude-платний
const STYLE_PROMPTS = {
  philosophical: "філософський — через глибокі питання, роздуми про сенс, протиставлення природи і технологій",
  atmospheric: "атмосферний — через образи, відчуття, картини природи, звуки, запахи",
  trailer: "трейлер/інтрига — як трейлер до фільму, обривається на найцікавішому місці, змушує хотіти дізнатись далі",
  emotional: "емоційний — через почуття героя, його внутрішні переживання, близькість до читача",
}

export async function POST(req) {
  try {
    const { partNumber, partTitle, text, style, count } = await req.json()

    if (!text || !style || !count) {
      return Response.json({ error: "Відсутні обовʼязкові поля" }, { status: 400 })
    }

    const styleDescription = STYLE_PROMPTS[style] || STYLE_PROMPTS.philosophical

    const prompt = `Ти — автор коротких відеосценаріїв для соціальних мереж (YouTube Shorts, TikTok, Instagram Reels).

Повість: "Симфонія Живого Розуму" — філософсько-фантастична повість про нетехнократичний світ.
${partNumber ? `Частина: ${partNumber}` : ""}
${partTitle ? `Назва: ${partTitle}` : ""}

Текст частини:
${text}

Твоє завдання: створити ${count} унікальних сценарії для відеошорту (18-20 секунд).

Стиль подачі: ${styleDescription}

Вимоги до кожного сценарію:
- Тривалість озвучки: 18-20 секунд (приблизно 45-55 слів)
- Мова: українська, літературна але жива
- Починати з сильного гачка який одразу чіпляє увагу
- Закінчувати або інтригуючим питанням, або назвою повісті
- НЕ переказувати сюжет — створити настрій, думку, відчуття
- Кожен сценарій має бути унікальним за підходом

Поверни ТІЛЬКИ валідний JSON без жодного тексту до або після. Без markdown. Формат:
{
  "scenarios": [
    {
      "id": 1,
      "text": "текст сценарію",
      "duration": "19 сек",
      "style": "${style}"
    }
  ]
}`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Claude API error:", error)
      return Response.json({ error: "Помилка Claude API" }, { status: 500 })
    }

    const data = await response.json()
    const content = data.content[0]?.text || ""

    const clean = content.replace(/```json|```/g, "").trim()
    const parsed = JSON.parse(clean)

    return Response.json(parsed)
  } catch (err) {
    console.error("Server error:", err)
    return Response.json({ error: "Внутрішня помилка сервера" }, { status: 500 })
  }
}