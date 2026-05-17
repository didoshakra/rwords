// app/context/SettingsContext.jsx
"use client"

import { createContext, useContext, useState, useEffect } from "react"

const DEFAULT_SETTINGS = {
  // Проект
  projectName: "",
  projectGenre: "",
  projectLanguage: "Українська",

  // Персонажі (до 5)
  characters: [
    { name: "", description: "" },
    { name: "", description: "" },
    { name: "", description: "" },
    { name: "", description: "" },
    { name: "", description: "" },
  ],

  // Одна локація
  location: { name: "", description: "" },

  // TTS
  voice: "male",
  engine: "gemini",
  speed: "normal",

  // Генерація
  style: "philosophical",
  maxScenes: "4",
  music: "none",

  // Робочий текст
  title: "",
  workText: "",
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("shorts-settings")
      if (saved) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }))
      }
    } catch {}
    setLoaded(true)
  }, [])

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const updateCharacter = (index, field, value) => {
    setSettings((prev) => {
      const updated = [...prev.characters]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, characters: updated }
    })
  }

  const updateLocation = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }))
  }

  const saveSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    try {
      const { title, workText, ...toSave } = updated
      localStorage.setItem("shorts-settings", JSON.stringify(toSave))
    } catch {}
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    try {
      localStorage.removeItem("shorts-settings")
    } catch {}
  }

  const buildCharacterContext = () => {
    const chars = settings.characters.filter((c) => c.name || c.description)
    if (!chars.length) return ""
    return chars.map((c) => `${c.name}: ${c.description}`).join(". ")
  }

  const buildLocationContext = () => {
    const loc = settings.location
    if (!loc?.name && !loc?.description) return ""
    return `${loc.name}: ${loc.description}`
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loaded,
        updateSetting,
        updateCharacter,
        updateLocation,
        saveSettings,
        resetSettings,
        buildCharacterContext,
        buildLocationContext,
        DEFAULT_SETTINGS,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) throw new Error("useSettings must be used within SettingsProvider")
  return context
}
