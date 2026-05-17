// app/api/drive/route.js
const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL || "https://n8n-production-8b28.up.railway.app/webhook-test/save-to-drive"

export async function POST(req) {
  try {
    const body = await req.json()

    const { title, sceneTitle, text, visual, videoPrompt, audioBase64, imageBase64, imageMimeType } = body

    if (!audioBase64 && !imageBase64) {
      return Response.json({ error: "Немає файлів для збереження" }, { status: 400 })
    }

    console.log(`Sending to n8n webhook: ${title} — ${sceneTitle}`)

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title || "Без назви",
        sceneTitle: sceneTitle || "Сцена",
        text,
        visual,
        videoPrompt,
        audioBase64,
        imageBase64,
        imageMimeType,
      }),
      signal: AbortSignal.timeout(120000), // 2 хв таймаут
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("n8n webhook error:", error)
      return Response.json({ error: `Помилка n8n: ${error}` }, { status: 500 })
    }

    const data = await response.json()
    console.log("✅ Files saved to Google Drive via n8n")

    return Response.json({
      success: true,
      message: "Файли збережено в Google Drive",
      data,
    })
  } catch (err) {
    console.error("Drive route error:", err.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}