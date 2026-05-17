//app/api/tts/route.js-автоозвучка тексту
import { GoogleAuth } from "google-auth-library"
import { readFileSync } from "fs"
import { join } from "path"

// Жорстко прив'язані голоси
const VOICES = {
  gemini: {
    male: "Charon",
    female: "Aoede",
  },
  google: {
    male: "uk-UA-Wavenet-B",
    female: "uk-UA-Wavenet-A",
  },
}

const SPEAKING_RATE = {
  slow: 0.75,
  normal: 0.9,
  fast: 1.1,
}

// Gemini TTS
async function synthesizeGemini(text, voice, speed) {
  const voiceName = VOICES.gemini[voice] || "Charon"
  const speakingRate = SPEAKING_RATE[speed] || 0.9

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text }],
          },
        ],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName,
              },
            },
            speakingRate,
          },
        },
      }),
    },
  )

  if (!response.ok) {
    const error = await response.text()
    console.error("Gemini TTS error:", error)
    throw new Error("Помилка Gemini TTS")
  }

  const data = await response.json()
  const audioBase64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data

  if (!audioBase64) throw new Error("Gemini TTS не повернув аудіо")

  return audioBase64
}

// Google Cloud TTS
async function synthesizeGoogle(text, voice, speed) {
  const voiceName = VOICES.google[voice] || "uk-UA-Wavenet-B"
  const speakingRate = SPEAKING_RATE[speed] || 0.9

  const keyPath = join(process.cwd(), "google-tts-key.json")
  const keyFile = JSON.parse(readFileSync(keyPath, "utf8"))

  const auth = new GoogleAuth({
    credentials: keyFile,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  })
  const client = await auth.getClient()
  const tokenResponse = await client.getAccessToken()
  const accessToken = tokenResponse.token

  const response = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      input: { text },
      voice: {
        languageCode: "uk-UA",
        name: voiceName,
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("Google TTS error:", error)
    throw new Error("Помилка Google Cloud TTS")
  }

  const data = await response.json()
  return data.audioContent
}

export async function POST(req) {
  try {
    const { text, voice, speed, engine } = await req.json()

    if (!text) {
      return Response.json({ error: "Текст відсутній" }, { status: 400 })
    }

    if (voice === "none") {
      return Response.json({ error: "Озвучка вимкнена" }, { status: 400 })
    }

    let audioBase64

    if (engine === "google") {
      audioBase64 = await synthesizeGoogle(text, voice, speed)
    } else {
      // За замовчуванням — Gemini
      audioBase64 = await synthesizeGemini(text, voice, speed)
    }

    return Response.json({ audio: audioBase64, engine: engine || "gemini" })
  } catch (err) {
    console.error("TTS route error:", err.message)
    return Response.json({ error: err.message || "Внутрішня помилка сервера" }, { status: 500 })
  }
}
