//app/api/tts/route.js-автоозвучка тексту
import { GoogleAuth } from "google-auth-library"
import { readFileSync } from "fs"
import { join } from "path"

const VOICES = {
  gemini: {
    male: "Charon",
    female: "Aoede",
  },
  google: {
    male: "uk-UA-Wavenet-A",
    female: "uk-UA-Wavenet-A",
  },
}

const SPEAKING_RATE = {
  slow: 0.75,
  normal: 0.9,
  fast: 1.1,
}

function l16ToWav(base64Audio, sampleRate = 24000, channels = 1) {
  const pcmData = Buffer.from(base64Audio, "base64")
  const byteRate = sampleRate * channels * 2
  const blockAlign = channels * 2
  const dataSize = pcmData.length
  const headerSize = 44
  const wav = Buffer.alloc(headerSize + dataSize)

  // RIFF header
  wav.write("RIFF", 0)
  wav.writeUInt32LE(36 + dataSize, 4)
  wav.write("WAVE", 8)
  wav.write("fmt ", 12)
  wav.writeUInt32LE(16, 16) // chunk size
  wav.writeUInt16LE(1, 20) // PCM format
  wav.writeUInt16LE(channels, 22)
  wav.writeUInt32LE(sampleRate, 24)
  wav.writeUInt32LE(byteRate, 28)
  wav.writeUInt16LE(blockAlign, 32)
  wav.writeUInt16LE(16, 34) // bits per sample
  wav.write("data", 36)
  wav.writeUInt32LE(dataSize, 40)
  pcmData.copy(wav, 44)

  return wav.toString("base64")
}

async function synthesizeGemini(text, voice) {
  const voiceName = VOICES.gemini[voice] || "Charon"
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("GEMINI_API_KEY не знайдено")

  const models = ["gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts"]

  let lastError = null

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName },
                },
              },
            },
          }),
        },
      )

      if (!response.ok) {
        const err = await response.text()
        console.error(`Model ${model} error:`, err)
        lastError = err
        continue
      }

      const data = await response.json()
      const audioPart = data.candidates?.[0]?.content?.parts?.[0]?.inlineData
      if (!audioPart?.data) {
        lastError = "Немає аудіо в відповіді"
        continue
      }

      console.log(`✅ Gemini TTS: модель ${model}, голос ${voiceName}, mimeType: ${audioPart.mimeType}`)

      // Конвертуємо L16 в WAV для браузера
      let audioData = audioPart.data
      let mimeType = audioPart.mimeType || "audio/wav"

      if (mimeType.startsWith("audio/l16")) {
        // Витягуємо sample rate з mimeType (audio/l16; rate=24000)
        const rateMatch = mimeType.match(/rate=(\d+)/)
        const sampleRate = rateMatch ? parseInt(rateMatch[1]) : 24000
        audioData = l16ToWav(audioData, sampleRate)
        mimeType = "audio/wav"
      }

      return { audio: audioData, mimeType }
    } catch (err) {
      lastError = err.message
      continue
    }
  }

  throw new Error(`Gemini TTS недоступний: ${lastError}`)
}

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
      voice: { languageCode: "uk-UA", name: voiceName },
      audioConfig: { audioEncoding: "MP3", speakingRate },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("Google TTS error:", error)
    throw new Error("Помилка Google Cloud TTS")
  }

  const data = await response.json()
  return { audio: data.audioContent, mimeType: "audio/mp3" }
}

export async function POST(req) {
  try {
    const { text, voice, speed, engine } = await req.json()

    if (!text) return Response.json({ error: "Текст відсутній" }, { status: 400 })
    if (voice === "none") return Response.json({ error: "Озвучка вимкнена" }, { status: 400 })

    const result =
      engine === "google" ? await synthesizeGoogle(text, voice, speed) : await synthesizeGemini(text, voice)

    return Response.json({ audio: result.audio, mimeType: result.mimeType })
  } catch (err) {
    console.error("TTS route error:", err.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}