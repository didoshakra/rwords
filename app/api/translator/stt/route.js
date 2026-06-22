// app/api/translator/stt/route.js.//проксі-роут для ключа Grok
// app/api/translator/stt/route.js

export async function POST(req) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio")

    if (!audioFile) {
      return Response.json({ error: "Аудіофайл відсутній" }, { status: 400 })
    }

    const groqForm = new FormData()
    groqForm.append("file", audioFile)
    groqForm.append("model", "whisper-large-v3-turbo")
    groqForm.append("language", "uk")
    groqForm.append("response_format", "json")

    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: groqForm,
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("Groq STT error:", err)
      throw new Error(`Groq помилка: ${res.status}`)
    }

    const data = await res.json()
    return Response.json({ text: data.text })

  } catch (err) {
    console.error("translator/stt error:", err.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}