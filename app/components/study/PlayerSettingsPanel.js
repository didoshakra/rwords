"use client"
// app/components/study/PlayerSettingsPanel.js
// Панель налаштувань плеєра (відкривається кнопкою ⚙ у StudyPlayer.js).
// Налаштування зберігаються в localStorage браузера.

import { useEffect, useState } from "react"
import { DEFAULT_PLAYER_SETTINGS } from "@/app/hooks/useWordPlayer"

export const STORAGE_KEY = "rwords.player.settings"
export const ALL_TYPES = ["word", "phrase", "sentence"]
const TYPE_LABELS = { word: "Слова", phrase: "Фрази", sentence: "Речення" }

export function loadSavedSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {}
  } catch {
    return {}
  }
}

export function saveSettings(cfg) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg))
  } catch {}
}

const LANGUAGES = [
  ["en-US", "Англійська (США)"],
  ["en-GB", "Англійська (Британська)"],
  ["uk-UA", "Українська"],
  ["de-DE", "Німецька"],
  ["fr-FR", "Французька"],
  ["es-ES", "Іспанська"],
  ["it-IT", "Італійська"],
  ["pl-PL", "Польська"],
  ["pt-PT", "Португальська"],
  ["pt-BR", "Португальська (Бразилія)"],
  ["cs-CZ", "Чеська"],
  ["nl-NL", "Голландська (Нідерланди)"],
  ["sv-SE", "Шведська"],
  ["da-DK", "Данська"],
  ["fi-FI", "Фінська"],
  ["nb-NO", "Норвезька"],
]

const SAMPLE = {
  uk: "Тест голосу",
  en: "This is a voice test",
  de: "Das ist ein Test",
  fr: "Ceci est un test",
  es: "Esta es una prueba",
  it: "Questo è un test",
  pl: "To jest test",
}

const norm = (l) => (l || "").toLowerCase().replace("_", "-")
const btn = "min-h-[40px] min-w-[40px] rounded-full border border-gray-400 text-lg dark:border-gray-500"
const field =
  "w-full rounded border border-gray-400 bg-white p-2 text-gray-900 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-100"

function useVoices() {
  const [voices, setVoices] = useState([])
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    const synth = window.speechSynthesis
    const load = () => setVoices(synth.getVoices())
    load()
    synth.addEventListener("voiceschanged", load)
    return () => synth.removeEventListener("voiceschanged", load)
  }, [])
  return voices
}

function Stepper({ label, value, step, min = 0, max = Infinity, format = (v) => v, onChange }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={btn}
          aria-label={label + ": менше"}
          onClick={() => onChange(Math.max(min, Math.round((value - step) * 100) / 100))}
        >
          −
        </button>
        <span className="w-16 text-center tabular-nums">{format(value)}</span>
        <button
          type="button"
          className={btn}
          aria-label={label + ": більше"}
          onClick={() => onChange(Math.min(max, Math.round((value + step) * 100) / 100))}
        >
          +
        </button>
      </div>
    </div>
  )
}

function VoiceField({ label, lang, voiceName, voices, rate, onVoice, autoLabel = "Авто (кращий доступний)" }) {
  const list = voices.filter((v) => norm(v.lang).startsWith(norm(lang).slice(0, 2)))

  const test = () => {
    const synth = window.speechSynthesis
    synth.cancel()
    const u = new SpeechSynthesisUtterance(SAMPLE[norm(lang).slice(0, 2)] || "Test")
    u.lang = lang
    u.rate = rate
    const v = list.find((x) => x.name === voiceName) || list.find((x) => /natural|online/i.test(x.name)) || list[0]
    if (v) u.voice = v
    synth.speak(u)
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm">{label}</span>
      {list.length === 0 ? (
        <p className="text-xs opacity-70">Голосів для цієї мови немає. Буде використано системний.</p>
      ) : (
        <select className={field} value={voiceName} onChange={(e) => onVoice(e.target.value)}>
          <option value="">{autoLabel}</option>
          {list.map((v) => (
            <option key={v.voiceURI} value={v.name}>
              {v.name}
            </option>
          ))}
        </select>
      )}
      <button
        type="button"
        onClick={test}
        className="self-start rounded border border-gray-400 px-3 py-1 text-sm dark:border-gray-500"
      >
        🔊 Прослухати
      </button>
    </div>
  )
}

export default function PlayerSettingsPanel({ value, onSave, onClose }) {
  const [d, setD] = useState(() => ({ ...DEFAULT_PLAYER_SETTINGS, types: ALL_TYPES, ...value }))
  const voices = useVoices()
  const set = (patch) => setD((prev) => ({ ...prev, ...patch }))
  const toggleType = (t) =>
    setD((prev) => ({
      ...prev,
      types: prev.types.includes(t) ? prev.types.filter((x) => x !== t) : [...prev.types, t],
    }))

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 md:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Налаштування плеєра"
        className="flex max-h-[92vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-t-2xl bg-white p-4 text-gray-900 md:rounded-2xl dark:bg-gray-900 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold">⚙ Налаштування плеєра</h2>

        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Паузи і швидкість</h3>
          <Stepper
            label="Пауза після першої частини (мс)"
            value={d.delayOriginal}
            step={250}
            onChange={(v) => set({ delayOriginal: v })}
          />
          <Stepper
            label="Пауза після перекладу (мс)"
            value={d.delayTranslation1}
            step={250}
            onChange={(v) => set({ delayTranslation1: v })}
          />
          <Stepper
            label="Пауза після повтору перекладу (мс)"
            value={d.delayTranslation2}
            step={250}
            onChange={(v) => set({ delayTranslation2: v })}
          />
          <Stepper
            label="Швидкість озвучки"
            value={d.rate}
            step={0.1}
            min={0.5}
            max={2}
            format={(v) => v.toFixed(1)}
            onChange={(v) => set({ rate: v })}
          />
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Порядок</h3>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={d.repeatTranslation}
              onChange={(e) => set({ repeatTranslation: e.target.checked })}
            />
            Повторювати переклад
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={d.reverseOrder}
              onChange={(e) => set({ reverseOrder: e.target.checked, repeatVoice: "" })}
            />
            Спочатку переклад, потім оригінал
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={d.loop} onChange={(e) => set({ loop: e.target.checked })} />
            Повторювати список циклічно
          </label>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">Мови й голоси</h3>
          <label className="flex flex-col gap-1 text-sm">
            Мова оригіналу
            <select
              className={field}
              value={d.fromLang}
              onChange={(e) => set({ fromLang: e.target.value, fromVoice: "", repeatVoice: "" })}
            >
              {LANGUAGES.map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <VoiceField
            label="Голос оригіналу"
            lang={d.fromLang}
            voiceName={d.fromVoice}
            voices={voices}
            rate={d.rate}
            onVoice={(v) => set({ fromVoice: v })}
          />
          <label className="flex flex-col gap-1 text-sm">
            Мова перекладу
            <select
              className={field}
              value={d.toLang}
              onChange={(e) => set({ toLang: e.target.value, toVoice: "", repeatVoice: "" })}
            >
              {LANGUAGES.map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <VoiceField
            label="Голос перекладу"
            lang={d.toLang}
            voiceName={d.toVoice}
            voices={voices}
            rate={d.rate}
            onVoice={(v) => set({ toVoice: v })}
          />
          <VoiceField
            label="Голос повтору (другої частини)"
            lang={d.reverseOrder ? d.fromLang : d.toLang}
            voiceName={d.repeatVoice}
            voices={voices}
            rate={d.rate}
            onVoice={(v) => set({ repeatVoice: v })}
            autoLabel="Той самий, що й першого разу"
          />
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Що вчити</h3>
          <div className="flex flex-wrap gap-4">
            {ALL_TYPES.map((t) => (
              <label key={t} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={d.types.includes(t)} onChange={() => toggleType(t)} />
                {TYPE_LABELS[t]}
              </label>
            ))}
          </div>
          {d.types.length === 0 && <p className="text-xs text-red-600">Оберіть хоча б один тип.</p>}
        </section>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={d.types.length === 0}
            onClick={() => onSave(d)}
            className="min-h-[44px] rounded-full bg-btBg px-4 font-medium text-white hover:opacity-70 disabled:opacity-40"
          >
            Зберегти
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded-full border border-gray-400 px-4 dark:border-gray-500"
          >
            Скасувати
          </button>
          <button
            type="button"
            onClick={() => setD({ ...DEFAULT_PLAYER_SETTINGS, types: ALL_TYPES })}
            className="min-h-[44px] rounded-full px-4 text-sm underline"
          >
            Скинути до типових
          </button>
        </div>
      </div>
    </div>
  )
}
