// app/api/image/route.js
export async function POST(req) {
  try {
    const { prompt, characterContext, locationContext } = await req.json()

    if (!prompt) {
      return Response.json({ error: "Промпт відсутній" }, { status: 400 })
    }

    // Будуємо повний промпт з контекстом
    const parts = [prompt]
    if (characterContext) parts.push(characterContext)
    if (locationContext) parts.push(locationContext)
    parts.push("cinematic, atmospheric, high quality, photorealistic, 4k, no cars, no vehicles, no text")

    const fullPrompt = parts.join(", ")
    const encodedPrompt = encodeURIComponent(fullPrompt)

    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=576&model=flux&nologo=true`

    console.log("Generating image with Pollinations AI...")
    console.log("Prompt:", fullPrompt.substring(0, 100) + "...")

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "image/*" },
      signal: AbortSignal.timeout(60000),
    })

    if (!response.ok) {
      console.error("Pollinations error:", response.status)
      return Response.json({ error: `Помилка генерації: ${response.status}` }, { status: 500 })
    }

    const arrayBuffer = await response.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const mimeType = response.headers.get("content-type") || "image/jpeg"

    console.log("✅ Зображення згенеровано через Pollinations AI")
    return Response.json({ image: base64, mimeType })
  } catch (err) {
    console.error("Image generation error:", err.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
