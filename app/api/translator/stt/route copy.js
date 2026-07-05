// app/api/translator/stt/route.js
// Приймає formData: audio (файл), language? (BCP-47, напр. 'uk-UA', 'en-GB')
// Повертає { text }

// Типові фантомні фрази, які Whisper/Groq видає на тиші, шумі
// або дуже коротких/нерозбірливих кліпах. Список не вичерпний —
// доповнюйте його, коли помітите нові повторювані "галюцинації".
const HALLUCINATION_PATTERNS = [
  /дякую за перегляд/i,
  /дякую за увагу/i,
  /підписуйтесь на канал/i,
  /підписуйтеся на канал/i,
  /субтитри (створив|створено|зробив|зроблено)/i,
  /продовження слідує/i,
  /до зустрічі в наступному відео/i,
  /thanks for watching/i,
  /subscribe to the channel/i,
]

// Мінімальний розмір файлу (байти), нижче якого немає сенсу
// навіть звертатись до Groq — це майже напевно порожній/шумовий кліп.
const MIN_AUDIO_SIZE_BYTES = 3000

// Якщо модель повернула текст, що складається з одного й того ж
// слова/фрази, повтореної 3+ рази поспіль — це теж класична ознака
// галюцинації Whisper на нечіткому вході.
function isRepetitiveGarbage(text) {
  const words = text.trim().split(/\s+/)
  if (words.length < 3) return false
  const uniqueRatio = new Set(words.map((w) => w.toLowerCase())).size / words.length
  return uniqueRatio < 0.34 // напр. одне слово повторюється >2/3 всього тексту
}

function isHallucination(text) {
  const trimmed = text.trim()
  if (!trimmed) return false
  if (HALLUCINATION_PATTERNS.some((p) => p.test(trimmed))) return true
  if (isRepetitiveGarbage(trimmed)) return true
  return false
}

export async function POST(req) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio")
    const language = formData.get("language") ?? "uk-UA"

    if (!audioFile) {
      return Response.json({ error: "Аудіофайл відсутній" }, { status: 400 })
    }

    // Відсікаємо занадто короткі/порожні записи ще до виклику Groq —
    // це майже завжди тиша або шум без мовлення.
    if (audioFile.size < MIN_AUDIO_SIZE_BYTES) {
      return Response.json({ text: "" })
    }

    // Whisper хоче тільки мову без регіону ('uk-UA' → 'uk', 'en-GB' → 'en')
    const whisperLang = language.split("-")[0].toLowerCase()

    const groqForm = new FormData()
    groqForm.append("file", audioFile)
    groqForm.append("model", "whisper-large-v3-turbo")
    groqForm.append("language", whisperLang)
    groqForm.append("response_format", "json")
    // temperature: 0 — детермінований декодинг, без "творчих" здогадок
    // на неоднозначних/тихих ділянках.
    groqForm.append("temperature", "0")
    // Короткий prompt допомагає моделі не з'їжджати на іншу мову/стиль
    // і трохи стабілізує розпізнавання на короткому та повсякденному мовленні.
    groqForm.append(
      "prompt",
      whisperLang === "uk" ? "Диктування коротких фраз українською мовою." : "Dictation of short phrases.",
    )

    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: groqForm,
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Groq помилка: ${res.status} ${err}`)
    }

    const data = await res.json()
    const rawText = data.text ?? ""

    if (isHallucination(rawText)) {
      console.warn("STT: відфільтровано ймовірну галюцинацію:", rawText)
      return Response.json({ text: "" })
    }

    return Response.json({ text: rawText })
  } catch (err) {
    console.error("translator/stt error:", err.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
