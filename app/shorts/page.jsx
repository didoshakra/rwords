//app / shorts / page.jsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { useSettings } from "@/app/context/SettingsContext"

const STYLES = [
  { value: "philosophical", label: "Філософський" },
  { value: "atmospheric", label: "Атмосферний" },
  { value: "trailer", label: "Трейлер / Інтрига" },
  { value: "emotional", label: "Емоційний" },
]

const VOICES_LABEL = { none: "Без озвучки", male: "Чоловічий", female: "Жіночий" }
const ENGINES_LABEL = { gemini: "Gemini TTS", google: "Google Cloud" }
const SPEEDS_LABEL = { slow: "Повільно", normal: "Нормально", fast: "Швидко" }
const MUSIC_LABEL = { none: "", atmospheric: "Атмосферна", philosophical: "Філософська", mystical: "Містична" }

export default function ShortsPage() {
  const { settings, loaded, updateSetting, buildCharacterContext, buildLocationContext } = useSettings()

  const [style, setStyle] = useState(settings.style || "philosophical")
  const [count, setCount] = useState(settings.maxScenes || "4")
  const [scenarios, setScenarios] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(null)
  const [copiedVisual, setCopiedVisual] = useState(null)
  const [copiedPrompt, setCopiedPrompt] = useState(null)
  const [ttsLoading, setTtsLoading] = useState(null)
  const [audioUrls, setAudioUrls] = useState({})
  const [imageLoading, setImageLoading] = useState(null)
  const [imageUrls, setImageUrls] = useState({})
  const [videoLoading, setVideoLoading] = useState(null)
  const [videoUrls, setVideoUrls] = useState({})

  const [settingsLoaded, setSettingsLoaded] = useState(false)
  if (loaded && !settingsLoaded) {
    setStyle(settings.style)
    setCount(settings.maxScenes)
    setSettingsLoaded(true)
  }

  const handleGenerate = async () => {
    if (!settings.workText?.trim()) {
      setError("Вставте текст")
      return
    }
    setError("")
    setLoading(true)
    setScenarios([])
    setAudioUrls({})

    try {
      const res = await fetch("/api/generate-short", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partTitle: settings.title,
          text: settings.workText,
          style,
          count: parseInt(count),
          voice: settings.voice,
          engine: settings.engine,
          speed: settings.speed,
          music: settings.music,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Помилка генерації")
        return
      }

      setScenarios(data.scenarios || [])
      setActiveTab(0)
    } catch {
      setError("Помилка зʼєднання з сервером")
    } finally {
      setLoading(false)
    }
  }

  const handleSpeak = async (scenario) => {
    if (settings.voice === "none") return
    setTtsLoading(scenario.id)

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: scenario.text,
          voice: settings.voice,
          engine: settings.engine,
          speed: settings.speed,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || "Помилка озвучення")
        return
      }

      const audioBlob = new Blob([Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))], {
        type: data.mimeType || "audio/wav",
      })
      const audioUrl = URL.createObjectURL(audioBlob)
      setAudioUrls((prev) => ({ ...prev, [scenario.id]: audioUrl }))
    } catch {
      alert("Помилка зʼєднання з TTS сервером")
    } finally {
      setTtsLoading(null)
    }
  }

  const handleCopy = async (text, id, type) => {
    await navigator.clipboard.writeText(text)
    if (type === "text") {
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    }
    if (type === "visual") {
      setCopiedVisual(id)
      setTimeout(() => setCopiedVisual(null), 2000)
    }
    if (type === "prompt") {
      setCopiedPrompt(id)
      setTimeout(() => setCopiedPrompt(null), 2000)
    }
  }

  const handleSaveToDrive = async (scenario) => {
    try {
      const res = await fetch("/api/drive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: settings.title || "Без назви",
          sceneTitle: scenario.scene_title || `Сцена ${scenario.id}`,
          text: scenario.text,
          visual: scenario.visual,
          videoPrompt: scenario.video_prompt,
          audioBase64: audioUrls[scenario.id] ? audioUrls[scenario.id].split(",")[1] : null,
          imageBase64: imageUrls[scenario.id] ? imageUrls[scenario.id].split(",")[1] : null,
          imageMimeType: imageUrls[scenario.id] ? imageUrls[scenario.id].split(";")[0].split(":")[1] : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error)
        return
      }
      alert(`✅ Збережено в Google Drive!`)
    } catch {
      alert("Помилка збереження в Drive")
    }
  }

  const handleRegenerate = async (index) => {
    if (!settings.workText?.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/generate-short", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partTitle: settings.title,
          text: settings.workText,
          style,
          count: 1,
          voice: settings.voice,
          engine: settings.engine,
          speed: settings.speed,
          music: settings.music,
        }),
      })
      const data = await res.json()
      if (res.ok && data.scenarios?.length) {
        const updated = [...scenarios]
        updated[index] = { ...data.scenarios[0], id: index + 1 }
        setScenarios(updated)
        setAudioUrls((prev) => {
          const n = { ...prev }
          delete n[index + 1]
          return n
        })
      }
    } catch {
      setError("Помилка регенерації")
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateImage = async (scenario) => {
    setImageLoading(scenario.id)
    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: scenario.video_prompt || scenario.visual,
          characterContext: buildCharacterContext(),
          locationContext: buildLocationContext(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error)
        return
      }
      const url = `data:${data.mimeType};base64,${data.image}`
      setImageUrls((prev) => ({ ...prev, [scenario.id]: url }))
    } catch {
      alert("Помилка генерації картинки")
    } finally {
      setImageLoading(null)
    }
  }

  const handleGenerateVideo = async (scenario) => {
    setVideoLoading(scenario.id)
    try {
      // Крок 1 — запускаємо генерацію
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: scenario.video_prompt,
          duration: 10,
          aspectRatio: "9:16",
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error)
        setVideoLoading(null)
        return
      }

      const requestId = data.request_id

      // Крок 2 — polling кожні 5 секунд
      const poll = async () => {
        const statusRes = await fetch(`/api/video?id=${requestId}`)
        const statusData = await statusRes.json()

        if (statusData.status === "done") {
          const url = `data:${statusData.mimeType};base64,${statusData.video}`
          setVideoUrls((prev) => ({ ...prev, [scenario.id]: url }))
          setVideoLoading(null)
        } else if (statusData.status === "failed") {
          alert("Генерація відео не вдалась")
          setVideoLoading(null)
        } else {
          // Ще генерується — чекаємо 5 секунд
          setTimeout(poll, 5000)
        }
      }

      setTimeout(poll, 5000)
    } catch {
      alert("Помилка генерації відео")
      setVideoLoading(null)
    }
  }

  const styleLabel = STYLES.find((s) => s.value === style)?.label || ""

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">Генератор шортів</h1>
          <p className="text-sm text-gray-500 mt-1">Симфонія Живого Розуму</p>
        </div>
        <Link href="/shorts/settings" className="text-sm text-purple-600 hover:text-purple-800">
          ⚙️ Налаштування
        </Link>
      </div>

      {/* Активні налаштування */}
      {loaded && (
        <div className="flex flex-wrap gap-2 mb-4">
          {settings.voice !== "none" && (
            <span className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900 px-3 py-1 rounded-full">
              🔊 {VOICES_LABEL[settings.voice]} · {ENGINES_LABEL[settings.engine]}
            </span>
          )}
          {settings.music !== "none" && (
            <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900 px-3 py-1 rounded-full">
              🎵 {MUSIC_LABEL[settings.music]}
            </span>
          )}
        </div>
      )}

      {/* Форма */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-4">
        <div className="mb-4">
          <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Назва тексту</label>
          <input
            type="text"
            value={settings.title || ""}
            onChange={(e) => updateSetting("title", e.target.value)}
            placeholder="Наприклад: Частина 1: Магічний політ над озером"
            className="w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Текст</label>
          <textarea
            value={settings.workText || ""}
            onChange={(e) => updateSetting("workText", e.target.value)}
            placeholder="Вставте текст частини повісті тут..."
            rows={8}
            className="w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-purple-400 resize-y leading-relaxed"
          />
        </div>

        <hr className="border-gray-100 dark:border-gray-700 mb-4" />

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="col-span-2">
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Стиль</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-purple-400"
            >
              {STYLES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Макс. сцен</label>
            <input
              type="number"
              min="1"
              max="20"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              list="count-options"
              className="w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-purple-400"
            />
            <datalist id="count-options">
              <option value="2" />
              <option value="3" />
              <option value="4" />
              <option value="5" />
              <option value="6" />
            </datalist>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-300 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? "Генерую..." : "Згенерувати сцени"}
        </button>
      </div>

      {/* Результати */}
      {scenarios.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <div className="flex border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-x-auto">
            {scenarios.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveTab(i)}
                className={`flex-shrink-0 px-4 py-3 text-sm transition-colors whitespace-nowrap ${
                  activeTab === i
                    ? "bg-white dark:bg-gray-900 text-purple-700 font-medium border-b-2 border-purple-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {s.scene_title || `Сцена ${i + 1}`}
              </button>
            ))}
          </div>

          {scenarios.map((scenario, i) => (
            <div key={scenario.id} className={activeTab === i ? "block" : "hidden"}>
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs font-medium text-purple-700 bg-purple-50 dark:bg-purple-900 px-3 py-1 rounded-full">
                    {styleLabel}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    ~{scenario.duration}
                  </span>
                </div>

                {/* Текст */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">📖 Текст</span>
                    <button
                      onClick={() => handleCopy(scenario.text, scenario.id, "text")}
                      className="text-xs text-purple-600 hover:text-purple-800"
                    >
                      {copied === scenario.id ? "Скопійовано ✓" : "Копіювати"}
                    </button>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed bg-gray-50 dark:bg-gray-800 rounded-lg p-4 whitespace-pre-line">
                    {scenario.text}
                  </div>
                </div>

                {/* Візуальний образ */}
                {scenario.visual && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">🎨 Візуальний образ</span>
                      <button
                        onClick={() => handleCopy(scenario.visual, scenario.id, "visual")}
                        className="text-xs text-purple-600 hover:text-purple-800"
                      >
                        {copiedVisual === scenario.id ? "Скопійовано ✓" : "Копіювати"}
                      </button>
                    </div>
                    <textarea
                      value={scenario.visual}
                      onChange={(e) => {
                        const updated = [...scenarios]
                        updated[i] = { ...scenario, visual: e.target.value }
                        setScenarios(updated)
                      }}
                      rows={3}
                      className="w-full text-sm text-gray-700 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg p-3 leading-relaxed resize-none focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}
                {imageUrls[scenario.id] && (
                  <div className="mb-4">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">🖼 Картинка</span>
                    <img src={imageUrls[scenario.id]} alt="Згенерована картинка" className="w-full rounded-lg mt-1" />
                  </div>
                )}

                {/* Промпт для відео */}
                {scenario.video_prompt && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">🎬 Промпт для відео</span>
                      <button
                        onClick={() => handleCopy(scenario.video_prompt, scenario.id, "prompt")}
                        className="text-xs text-purple-600 hover:text-purple-800"
                      >
                        {copiedPrompt === scenario.id ? "Скопійовано ✓" : "Копіювати"}
                      </button>
                    </div>
                    <textarea
                      value={scenario.video_prompt}
                      onChange={(e) => {
                        const updated = [...scenarios]
                        updated[i] = { ...scenario, video_prompt: e.target.value }
                        setScenarios(updated)
                      }}
                      rows={3}
                      className="w-full text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-3 leading-relaxed italic resize-none focus:outline-none focus:border-purple-400"
                    />
                  </div>
                )}
                <hr className="border-gray-100 dark:border-gray-700 mb-4" />

                {settings.voice !== "none" && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    ⚙️ 🔊 {VOICES_LABEL[settings.voice]} · {ENGINES_LABEL[settings.engine]} ·{" "}
                    {SPEEDS_LABEL[settings.speed]}
                  </p>
                )}
                {videoUrls[scenario.id] && (
                  <div className="mb-4">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">🎬 Відео</span>
                    <video controls src={videoUrls[scenario.id]} className="w-full rounded-lg mt-1" />
                  </div>
                )}

                {/* Аудіоплеєр */}
                {audioUrls[scenario.id] && (
                  <div className="mb-4">
                    <audio controls src={audioUrls[scenario.id]} className="w-full h-10" />
                  </div>
                )}

                {/* Фонова музика */}
                {settings.music !== "none" && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">🎵 Фонова музика</p>
                    <audio controls src={`/api/music?type=${settings.music}`} className="w-full h-10" />
                  </div>
                )}

                {/* Кнопки */}
                <div className="flex gap-2">
                  {settings.voice !== "none" && (
                    <button
                      onClick={() => handleSpeak(scenario)}
                      disabled={ttsLoading === scenario.id}
                      className="flex-1 py-2 text-sm text-blue-600 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors disabled:opacity-50"
                    >
                      {ttsLoading === scenario.id
                        ? "Озвучую..."
                        : audioUrls[scenario.id]
                          ? "🔊 Переозвучити"
                          : "🔊 Озвучити"}
                    </button>
                  )}
                  <button
                    onClick={() => handleGenerateImage(scenario)}
                    disabled={imageLoading === scenario.id}
                    className="flex-1 py-2 text-sm text-amber-600 border border-amber-200 dark:border-amber-700 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900 transition-colors disabled:opacity-50"
                  >
                    {imageLoading === scenario.id
                      ? "Генерую..."
                      : imageUrls[scenario.id]
                        ? "🖼 Переробити"
                        : "🖼 Картинка"}
                  </button>
                  <button
                    onClick={() => handleGenerateVideo(scenario)}
                    disabled={videoLoading === scenario.id}
                    className="flex-1 py-2 text-sm text-green-600 border border-green-200 dark:border-green-700 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
                  >
                    {videoLoading === scenario.id
                      ? "🎬 Генерую..."
                      : videoUrls[scenario.id]
                        ? "🎬 Переробити"
                        : "🎬 Відео"}
                  </button>
                  <button
                    onClick={() => handleSaveToDrive(scenario)}
                    className="flex-1 py-2 text-sm text-white bg-purple-700 hover:bg-purple-800 rounded-lg font-medium transition-colors"
                  >
                    💾 Зберегти в Drive
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
