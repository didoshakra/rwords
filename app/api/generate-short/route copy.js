//app/api/generate-short/route.js
const STYLE_PROMPTS = {
  philosophical: "філософський — думка випливає з конкретної сцени, деталей, дій героя",
  atmospheric: "атмосферний — конкретні сенсорні деталі: звуки, запахи, кольори, відчуття",
  trailer: "трейлер — динамічно, інтенсивно, обрив на найцікавішому місці",
  emotional: "емоційний — внутрішній стан героя через конкретні образи і деталі",
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

ЗАВДАННЯ: створити відеошорти з цього тексту.

КРОК 1 — ПОДІЛ НА СЦЕНИ:
Самостійно визнач скільки логічних сцен є в тексті — орієнтуйся на зміну місця, дії, настрою або абзаци.
Правила:
- Максимальна кількість сцен: ${count}
- Якщо логічних сцен менше ніж ${count} — роби менше, не розтягуй штучно
- Сцени НЕ перетинаються — кожна охоплює свою унікальну частину тексту
- Сцени йдуть строго по порядку подій

КРОК 2 — СЦЕНАРІЙ ДЛЯ КОЖНОЇ СЦЕНИ:
Для кожної сцени створи окремий відеошорт (18-20 секунд).
Стиль: ${styleDescription}

Вимоги до кожного сценарію:
- Використовуй ТІЛЬКИ деталі зі СВОЄЇ сцени — не змішуй з іншими
- КОЖНЕ речення — ОКРЕМИЙ рядок (мінімум 6-8 рядків)
- Перше речення — сильний гачок з конкретним образом саме цієї сцени
- Останнє речення — назва повісті АБО інтригуючий обрив що веде до наступної сцени
- 50-60 слів загалом

КРОК 3 — ПРОМПТ ДЛЯ ВІДЕОГЕНЕРАТОРА:
Для кожної сцени створи video_prompt англійською:
- Описуй тільки те що є в цій конкретній сцені
- Стиль: cinematic, atmospheric
- 3-4 речення з описом послідовних кадрів

Поверни ТІЛЬКИ валідний JSON без жодного тексту до або після. Без markdown:
{
  "scenarios": [
    {
      "id": 1,
      "scene_description": "коротка назва сцени до 4 слів",
      "text": "рядок1\\nрядок2\\nрядок3\\nрядок4\\nрядок5\\nрядок6\\nрядок7",
      "duration": "19 сек",
      "style": "${style}",
      "video_prompt": "Cinematic shot of..."
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
        max_tokens: 3000,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `Ти — автор відеосценаріїв. Головне правило: кожен сценарій охоплює ТІЛЬКИ свою унікальну частину тексту, сцени НЕ перетинаються. Текст сценарію ЗАВЖДИ містить мінімум 6-8 рядків розділених \\n. Повертаєш ТІЛЬКИ валідний JSON.`,
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
