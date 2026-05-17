// app/api/image/route.js
import { GoogleGenAI } from "@google/genai"

const MODELS = ["gemini-3.1-flash-image-preview", "gemini-2.5-flash-preview-image-generation", "gemini-2.5-flash-image"]

export async function POST(req) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return Response.json({ error: "Промпт відсутній" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return Response.json({ error: "GEMINI_API_KEY не знайдено" }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })

    let lastError = null

    for (const model of MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseModalities: ["IMAGE", "TEXT"],
          },
        })

        let imageData = null
        let mimeType = "image/png"

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageData = part.inlineData.data
            mimeType = part.inlineData.mimeType || "image/png"
            break
          }
        }

        if (!imageData) {
          lastError = "Зображення не згенеровано"
          continue
        }

        console.log(`✅ Зображення згенеровано: модель ${model}, mimeType: ${mimeType}`)
        return Response.json({ image: imageData, mimeType })
      } catch (err) {
        console.error(`Model ${model} error:`, err.message)
        lastError = err.message
        continue
      }
    }

    return Response.json({ error: lastError || "Всі моделі недоступні" }, { status: 500 })
  } catch (err) {
    console.error("Image generation error:", err.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
