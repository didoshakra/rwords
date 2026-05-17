// app / shorts / settings / page.jsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSettings } from "@/app/context/SettingsContext"

const ENGINES = [
  { value: "gemini", label: "Gemini TTS — краща якість" },
  { value: "google", label: "Google Cloud TTS — стабільний" },
]

const SPEEDS = [
  { value: "slow", label: "Повільно" },
  { value: "normal", label: "Нормально" },
  { value: "fast", label: "Швидко" },
]

const STYLES = [
  { value: "philosophical", label: "Філософський" },
  { value: "atmospheric", label: "Атмосферний" },
  { value: "trailer", label: "Трейлер / Інтрига" },
  { value: "emotional", label: "Емоційний" },
]

const MUSIC = [
  { value: "none", label: "Без музики" },
  { value: "atmospheric", label: "Тиха атмосферна" },
  { value: "philosophical", label: "Філософська" },
  { value: "mystical", label: "Містична" },
]

export default function SettingsPage() {
  const { settings, saveSettings, resetSettings } = useSettings()
  const [local, setLocal] = useState(settings)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setLocal(settings)
  }, [settings])

  const update = (key, value) => {
    setLocal((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const updateChar = (index, field, value) => {
    const updated = [...local.characters]
    updated[index] = { ...updated[index], [field]: value }
    setLocal((prev) => ({ ...prev, characters: updated }))
    setSaved(false)
  }

  const updateLoc = (field, value) => {
    setLocal((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }))
    setSaved(false)
  }

  const handleSave = () => {
    saveSettings(local)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    resetSettings()
    setSaved(false)
  }

  const inputClass =
    "w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-purple-400"
  const labelClass = "block text-xs text-gray-500 uppercase tracking-wide mb-1"

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">Налаштування</h1>
          <p className="text-sm text-gray-500 mt-1">Генератор шортів</p>
        </div>
        <Link href="/shorts" className="text-sm text-purple-600 hover:text-purple-800">
          ← Назад
        </Link>
      </div>

      {/* Проект */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-4">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">🎬 Проект</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className={labelClass}>Назва проекту</label>
            <input
              type="text"
              value={local.projectName || ""}
              onChange={(e) => update("projectName", e.target.value)}
              placeholder="Симфонія Живого Розуму"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Жанр</label>
            <input
              type="text"
              value={local.projectGenre || ""}
              onChange={(e) => update("projectGenre", e.target.value)}
              placeholder="Філософська фантастика"
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Мова</label>
          <input
            type="text"
            value={local.projectLanguage || ""}
            onChange={(e) => update("projectLanguage", e.target.value)}
            placeholder="Українська"
            className={inputClass}
          />
        </div>
      </div>

      {/* Персонажі */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-4">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">👤 Персонажі</h2>
        <p className="text-xs text-gray-400 mb-4">Опис додається до промпту для генерації картинок</p>
        {(local.characters || []).map((char, i) => (
          <div
            key={i}
            className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:mb-0 last:pb-0"
          >
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Ім'я {i + 1}</label>
                <input
                  type="text"
                  value={char.name || ""}
                  onChange={(e) => updateChar(i, "name", e.target.value)}
                  placeholder="Олександр"
                  className={inputClass}
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Зовнішність</label>
                <textarea
                  type="text"
                  value={char.description || ""}
                  onChange={(e) => updateChar(i, "description", e.target.value)}
                  placeholder="72 роки, сивий, високий, мудрий погляд"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Локація */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-4">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">📍 Локація</h2>
        <p className="text-xs text-gray-400 mb-4">Основне місце дії проекту</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Назва</label>
            <input
              type="text"
              value={local.location?.name || ""}
              onChange={(e) => updateLoc("name", e.target.value)}
              placeholder="Міський парк"
              className={inputClass}
            />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Опис</label>
            <textarea
              type="text"
              value={local.location?.description || ""}
              onChange={(e) => updateLoc("description", e.target.value)}
              placeholder="Вечірній парк з озером, старі дерева, лавки з різьбленням"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* TTS */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-4">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">🔊 Озвучка</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className={labelClass}>Голос</label>
            <select
              value={local.voice || "male"}
              onChange={(e) => update("voice", e.target.value)}
              className={inputClass}
            >
              <option value="none">Без озвучки</option>
              <option value="male">Чоловічий</option>
              <option value="female">Жіночий</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Движок</label>
            <select
              value={local.engine || "gemini"}
              onChange={(e) => update("engine", e.target.value)}
              disabled={local.voice === "none"}
              className={`${inputClass} disabled:opacity-40`}
            >
              {ENGINES.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label
            className={
              local.voice === "none"
                ? "block text-xs text-gray-300 dark:text-gray-600 uppercase tracking-wide mb-1"
                : labelClass
            }
          >
            Темп мовлення
          </label>
          <select
            value={local.speed || "normal"}
            onChange={(e) => update("speed", e.target.value)}
            disabled={local.voice === "none"}
            className={`${inputClass} disabled:opacity-40`}
          >
            {SPEEDS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Прив'язані голоси:</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Gemini: Чоловічий → <span className="font-medium">Charon</span> · Жіночий →{" "}
            <span className="font-medium">Aoede</span>
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Google Cloud: тільки один голос → <span className="font-medium">uk-UA-Wavenet-A</span>
          </p>
        </div>
      </div>

      {/* Генерація */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-4">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">⚙️ Генерація сценаріїв</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className={labelClass}>Стиль за замовчуванням</label>
            <select
              value={local.style || "philosophical"}
              onChange={(e) => update("style", e.target.value)}
              className={inputClass}
            >
              {STYLES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Макс. сцен</label>
            <input
              type="number"
              min="1"
              max="20"
              value={local.maxScenes || "4"}
              onChange={(e) => update("maxScenes", e.target.value)}
              list="scenes-options"
              className={inputClass}
            />
            <datalist id="scenes-options">
              <option value="2" />
              <option value="3" />
              <option value="4" />
              <option value="5" />
              <option value="6" />
            </datalist>
          </div>
        </div>
        <div>
          <label className={labelClass}>Фонова музика</label>
          <select
            value={local.music || "none"}
            onChange={(e) => update("music", e.target.value)}
            className={inputClass}
          >
            {MUSIC.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex gap-3">
        <button
          onClick={handleReset}
          className="flex-1 py-3 text-sm text-gray-500 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Скинути до стандартних
        </button>
        <button
          onClick={handleSave}
          className="flex-1 py-3 text-sm text-white bg-purple-700 hover:bg-purple-800 rounded-lg font-medium transition-colors"
        >
          {saved ? "Збережено ✓" : "Зберегти"}
        </button>
      </div>
    </div>
  )
}
