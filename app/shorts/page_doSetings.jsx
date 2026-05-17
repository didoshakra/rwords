//app / shorts / page.jsx
"use client"

import { useState } from "react"

const STYLES = [
  { value: "philosophical", label: "Філософський — думки, питання, роздуми" },
  { value: "atmospheric", label: "Атмосферний — образи, відчуття, картини" },
  { value: "trailer", label: "Трейлер / Інтрига — що буде далі, загадка" },
  { value: "emotional", label: "Емоційний — почуття, переживання" },
]

const VOICES = [
  { value: "none", label: "Без озвучки" },
  { value: "male", label: "Чоловічий (Charon / Wavenet-B)" },
  { value: "female", label: "Жіночий (Aoede / Wavenet-A)" },
]

const ENGINES = [
  { value: "gemini", label: "Gemini TTS — краща якість" },
  { value: "google", label: "Google Cloud TTS — стабільний" },
]

const SPEEDS = [
  { value: "slow", label: "Повільно" },
  { value: "normal", label: "Нормально" },
  { value: "fast", label: "Швидко" },
]

const MUSIC = [
  { value: "none", label: "Без музики" },
  { value: "atmospheric", label: "Тиха атмосферна" },
  { value: "philosophical", label: "Філософська" },
  { value: "mystical", label: "Містична" },
]

export default function ShortsPage() {
  const [partNumber, setPartNumber] = useState("")
  const [partTitle, setPartTitle] = useState("")
  const [text, setText] = useState("")
  const [style, setStyle] = useState("philosophical")
  const [count, setCount] = useState("4")
  const [voice, setVoice] = useState("male")
  const [engine, setEngine] = useState("gemini")
  const [speed, setSpeed] = useState("normal")
  const [music, setMusic] = useState("none")
  const [scenarios, setScenarios] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(null)
  const [copiedPrompt, setCopiedPrompt] = useState(null)
  const [ttsLoading, setTtsLoading] = useState(null)
  const [audioUrls, setAudioUrls] = useState({})

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("Вставте текст частини повісті")
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
          partNumber,
          partTitle,
          text,
          style,
          count: parseInt(count),
          voice,
          engine,
          speed,
          music,
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
    if (voice === "none") return
    setTtsLoading(scenario.id)

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: scenario.text,
          voice,
          engine,
          speed,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Помилка озвучення")
        return
      }

      const audioBlob = new Blob([Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))], { type: "audio/mp3" })
      const audioUrl = URL.createObjectURL(audioBlob)
      setAudioUrls((prev) => ({ ...prev, [scenario.id]: audioUrl }))
    } catch {
      alert("Помилка зʼєднання з TTS сервером")
    } finally {
      setTtsLoading(null)
    }
  }

  const handleCopy = async (text, id) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleCopyPrompt = async (prompt, id) => {
    await navigator.clipboard.writeText(prompt)
    setCopiedPrompt(id)
    setTimeout(() => setCopiedPrompt(null), 2000)
  }

  const handleLaunch = (scenario) => {
    alert(`Сценарій ${scenario.id} відправлено в роботу!\n\nНаступний крок: генерація відео`)
  }

  const handleRegenerate = async (index) => {
    if (!text.trim()) return
    setLoading(true)

    try {
      const res = await fetch("/api/generate-short", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partNumber,
          partTitle,
          text,
          style,
          count: 1,
          voice,
          engine,
          speed,
          music,
        }),
      })

      const data = await res.json()
      if (res.ok && data.scenarios?.length) {
        const updated = [...scenarios]
        updated[index] = { ...data.scenarios[0], id: index + 1 }
        setScenarios(updated)
        setAudioUrls((prev) => {
          const next = { ...prev }
          delete next[index + 1]
          return next
        })
      }
    } catch {
      setError("Помилка регенерації")
    } finally {
      setLoading(false)
    }
  }

  const styleLabel =
    STYLES.find((s) => s.value === style)
      ?.label.split("—")[0]
      .trim() || ""

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium mb-2 text-gray-900 dark:text-gray-100">Генератор шортів</h1>
      <p className="text-sm text-gray-500 mb-6">Симфонія Живого Розуму</p>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-4">
        {/* Номер і назва */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Номер частини</label>
            <input
              type="text"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              placeholder="Наприклад: Частина 1"
              className="w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-purple-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Назва</label>
            <input
              type="text"
              value={partTitle}
              onChange={(e) => setPartTitle(e.target.value)}
              placeholder="Назва частини"
              className="w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        {/* Текст */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Текст частини повісті</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Вставте текст частини повісті тут..."
            rows={8}
            className="w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-purple-400 resize-y leading-relaxed"
          />
        </div>

        <hr className="border-gray-100 dark:border-gray-700 mb-4" />

        {/* Стиль і кількість */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="col-span-2">
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Стиль сценарію</label>
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

        {/* TTS налаштування */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Озвучка</label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-purple-400"
            >
              {VOICES.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className={`block text-xs uppercase tracking-wide mb-1 ${voice === "none" ? "text-gray-300 dark:text-gray-600" : "text-gray-500"}`}
            >
              Движок
            </label>
            <select
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              disabled={voice === "none"}
              className="w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-purple-400 disabled:opacity-40"
            >
              {ENGINES.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className={`block text-xs uppercase tracking-wide mb-1 ${voice === "none" ? "text-gray-300 dark:text-gray-600" : "text-gray-500"}`}
            >
              Темп
            </label>
            <select
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              disabled={voice === "none"}
              className="w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-purple-400 disabled:opacity-40"
            >
              {SPEEDS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Музика */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Фонова музика</label>
          <select
            value={music}
            onChange={(e) => setMusic(e.target.value)}
            className="w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-purple-400"
          >
            {MUSIC.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-300 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? "Генерую..." : "Згенерувати сценарії"}
        </button>
      </div>

      {/* Результати — вкладки */}
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
                {s.scene_description || `Сцена ${i + 1}`} ✓
              </button>
            ))}
          </div>

          {scenarios.map((scenario, i) => (
            <div key={scenario.id} className={activeTab === i ? "block" : "hidden"}>
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs font-medium text-purple-700 bg-purple-50 dark:bg-purple-900 px-3 py-1 rounded-full">
                    {styleLabel}
                  </span>
                  {voice !== "none" && (
                    <span className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900 px-3 py-1 rounded-full">
                      {voice === "male" ? "Чоловічий" : "Жіночий"} ·{" "}
                      {ENGINES.find((e) => e.value === engine)
                        ?.label.split("—")[0]
                        .trim()}{" "}
                      · {SPEEDS.find((s) => s.value === speed)?.label}
                    </span>
                  )}
                  {music !== "none" && (
                    <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900 px-3 py-1 rounded-full">
                      🎵 {MUSIC.find((m) => m.value === music)?.label}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    ~{scenario.duration}
                  </span>
                </div>

                {scenario.scene_description && (
                  <p className="text-xs text-gray-400 italic mb-3">{scenario.scene_description}</p>
                )}

                <div className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-3 whitespace-pre-line">
                  {scenario.text}
                </div>

                {audioUrls[scenario.id] && (
                  <div className="mb-3">
                    <audio controls src={audioUrls[scenario.id]} className="w-full h-10" />
                  </div>
                )}

                {scenario.video_prompt && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Промпт для відео</span>
                      <button
                        onClick={() => handleCopyPrompt(scenario.video_prompt, scenario.id)}
                        className="text-xs text-purple-600 hover:text-purple-800"
                      >
                        {copiedPrompt === scenario.id ? "Скопійовано ✓" : "Копіювати"}
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-3 leading-relaxed italic">
                      {scenario.video_prompt}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRegenerate(i)}
                    disabled={loading}
                    className="flex-1 py-2 text-sm text-gray-500 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Регенерувати
                  </button>
                  <button
                    onClick={() => handleCopy(scenario.text, scenario.id)}
                    className="flex-1 py-2 text-sm text-gray-500 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {copied === scenario.id ? "Скопійовано ✓" : "Копіювати"}
                  </button>
                  {voice !== "none" && (
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
                    onClick={() => handleLaunch(scenario)}
                    className="flex-1 py-2 text-sm text-white bg-purple-700 hover:bg-purple-800 rounded-lg font-medium transition-colors"
                  >
                    Запустити ↗
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
