// app/api/translator/stt/route.js
// Приймає formData: audio (файл), language? (BCP-47, напр. 'uk-UA', 'en-GB')
// Повертає { text }

export async function POST(req) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio")
    const language = formData.get("language") ?? "uk-UA"

    if (!audioFile) {
      return Response.json({ error: "Аудіофайл відсутній" }, { status: 400 })
    }

    // Whisper хоче тільки мову без регіону ('uk-UA' → 'uk', 'en-GB' → 'en')
    const whisperLang = language.split("-")[0].toLowerCase()

    const groqForm = new FormData()
    groqForm.append("file", audioFile)
    groqForm.append("model", "whisper-large-v3-turbo")
    groqForm.append("language", whisperLang)
    groqForm.append("response_format", "json")

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
    return Response.json({ text: data.text })
  } catch (err) {
    console.error("translator/stt error:", err.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
