//app/api/generate-short/route.js
const STYLE_PROMPTS = {
  philosophical: "філософський — акцент на внутрішніх роздумах героя, питаннях буття",
  atmospheric: "атмосферний — акцент на природі, відчуттях, сенсорних деталях",
  trailer: "трейлер — динамічно, напружено, з інтригою",
  emotional: "емоційний — акцент на почуттях і переживаннях героя",
}

export async function POST(req) {
  try {
    const { partTitle, text, style, count, voice, engine, speed, music } = await req.json()

    if (!text) {
      return Response.json({ error: "Текст відсутній" }, { status: 400 })
    }

    const styleDescription = STYLE_PROMPTS[style] || STYLE_PROMPTS.philosophical

    const prompt = `Ти — редактор літературного тексту і художній директор.

Повість: "Симфонія Живого Розуму" — філософсько-фантастична повість про нетехнократичний світ.
${partTitle ? `Назва: ${partTitle}` : ""}

Текст:
${text}

ЗАВДАННЯ: Розбий текст на ${count} логічних сцен для відеошорту.

ПРАВИЛА ПОДІЛУ:
- Максимум сцен: ${count}
- Якщо логічних сцен менше ніж ${count} — роби менше, не розтягуй
- Кожна сцена охоплює свою унікальну частину тексту
- Сцени йдуть строго по порядку, НЕ перетинаються

ДЛЯ КОЖНОЇ СЦЕНИ СТВОРИ:

1. "scene_title" — коротка назва сцени (3-4 слова)

2. "text" — ТОЧНИЙ оригінальний текст цієї сцени з повісті
   - Копіюй дослівно, не скорочуй і не змінюй
   - Це буде озвучено голосом диктора

3. "visual" — Візуальний образ для генерації картинки:
   - Конкретний опис того що має бути на картинці
   - Хто де стоїть, що робить, яке освітлення, настрій
   - Стиль: ${styleDescription}
   - 2-3 речення, дуже конкретно і візуально
   - Українською мовою

4. "video_prompt" — промпт для відеогенератора англійською:
   - Cinematic style
   - Конкретні візуальні деталі з тексту
   - 2-3 речення

5. "duration" — приблизна тривалість озвучки (підрахуй кількість слів ÷ 2.5 = секунди)

Поверни ТІЛЬКИ валідний JSON без жодного тексту до або після. Без markdown:
{
  "scenarios": [
    {
      "id": 1,
      "scene_title": "назва сцени",
      "text": "точний оригінальний текст сцени з повісті",
      "visual": "Візуальний образ: конкретний опис картинки українською",
      "video_prompt": "Cinematic description in English",
      "duration": "18 сек"
    }
  ]
}`

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 4000,
        temperature: 0.5,
        messages: [
          {
            role: "system",
            content: "Ти — точний редактор. Копіюєш текст дослівно. Повертаєш ТІЛЬКИ валідний JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Groq API error:", error)
      return Response.json({ error: "Помилка Groq API" }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ""

    const clean = content
      .replace(/```json[\s\S]*?```/g, (match) => {
        return match.replace(/```json\n?/, "").replace(/\n?```/, "")
      })
      .replace(/```/g, "")
      .trim()

    let parsed
    try {
      parsed = JSON.parse(clean)
    } catch {
      const jsonMatch = clean.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("Не вдалось розпарсити JSON")
      }
    }

    return Response.json(parsed)
  } catch (err) {
    console.error("Server error:", err)
    return Response.json({ error: "Внутрішня помилка сервера" }, { status: 500 })
  }
}
