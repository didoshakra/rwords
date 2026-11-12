"use client"
// app/hooks/useWordPlayer.js
// Цикл відтворення для сайту (аналог useWordPlayer.js із застосунку), на speechSynthesis.
// Цикл слова: оригінал → озвучка → пауза → переклад → озвучка → пауза → повтор перекладу → пауза → далі.
// Паузи рахуються від справжнього кінця мовлення (onend), а не від оцінки тривалості.

import { useState, useRef, useCallback, useEffect } from "react"

export const DEFAULT_PLAYER_SETTINGS = {
  fromLang: "uk-UA",
  toLang: "en-GB",
  rate: 0.9, // швидкість мовлення
  delayOriginal: 2000, // пауза після оригіналу (час подумати)
  delayTranslation1: 1000, // пауза після перекладу
  delayTranslation2: 1000, // пауза після повтору перекладу
  repeatTranslation: true,
  reverseOrder: false, // true: спочатку переклад, потім оригінал
}

const norm = (l) => (l || "").toLowerCase().replace("_", "-")

function pickVoice(lang) {
  const voices = window.speechSynthesis.getVoices()
  const l = norm(lang)
  return voices.find((v) => norm(v.lang) === l) || voices.find((v) => norm(v.lang).startsWith(l.slice(0, 2))) || null
}

// Довгі тексти ріжемо за реченнями (Chrome обриває довге мовлення)
function chunkText(text, max = 180) {
  const clean = (text || "").replace(/\s+/g, " ").trim()
  if (!clean) return []
  const sentences = (clean.match(/[^.!?…]+[.!?…]*/g) || [clean]).map((s) => s.trim()).filter(Boolean)
  const out = []
  let buf = ""
  for (const s of sentences) {
    if ((buf + " " + s).trim().length <= max) {
      buf = (buf + " " + s).trim()
      continue
    }
    if (buf) out.push(buf)
    if (s.length <= max) {
      buf = s
      continue
    }
    let part = ""
    for (const w of s.split(" ")) {
      if ((part + " " + w).trim().length > max) {
        out.push(part)
        part = w
      } else {
        part = (part + " " + w).trim()
      }
    }
    buf = part
  }
  if (buf) out.push(buf)
  return out
}

// Речення для озвучки й підсвітки. StudyPlayer використовує цю ж функцію,
// тому розбиття на екрані завжди збігається з тим, що звучить.
export function splitSentences(text) {
  const raw = text || ""
  return (raw.match(/[^.!?…]+[.!?…]*\s*/g) || (raw.trim() ? [raw] : [])).filter((s) => s.trim())
}

/**
 * @param {object[]} words     масив слів { id, word, translation, topic_id }
 * @param {object}   settings  перевизначення DEFAULT_PLAYER_SETTINGS
 */
export function useWordPlayer(words, settings = {}) {
  const s = { ...DEFAULT_PLAYER_SETTINGS, ...settings }

  const [index, setIndex] = useState(0)
  const [showSecond, setShowSecond] = useState(false)
  const [isRunning, setIsRunningState] = useState(false)
  const [finished, setFinished] = useState(false)
  const [supported, setSupported] = useState(true)
  const [missingLangs, setMissingLangs] = useState([])
  const [active, setActive] = useState(null) // { slot: "first" | "second", i: номер речення }

  const wordsRef = useRef(words)
  const settingsRef = useRef(s)
  wordsRef.current = words
  settingsRef.current = s

  const runIdRef = useRef(0)
  const indexRef = useRef(0)
  const runningRef = useRef(false)
  const sleepRef = useRef(null)
  const utterRef = useRef(null) // тримаємо посилання, щоб Chrome не збирав utterance

  const setRunning = (v) => {
    runningRef.current = v
    setIsRunningState(v)
  }

  const cancelAll = useCallback(() => {
    runIdRef.current++
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel()
    if (sleepRef.current) {
      clearTimeout(sleepRef.current.t)
      sleepRef.current.res()
      sleepRef.current = null
    }
    setActive(null)
  }, [])

  const sleep = (ms) =>
    new Promise((res) => {
      const t = setTimeout(() => {
        sleepRef.current = null
        res()
      }, ms)
      sleepRef.current = { t, res }
    })

  const speakChunk = (text, lang, rate) =>
    new Promise((resolve) => {
      const synth = window.speechSynthesis
      const u = new SpeechSynthesisUtterance(text)
      u.lang = lang
      u.rate = rate
      const v = pickVoice(lang)
      if (v) u.voice = v
      let done = false
      let timer
      const finish = () => {
        if (done) return
        done = true
        clearTimeout(timer)
        resolve()
      }
      // страховка: якщо onend не прийшов (трапляється в Chrome)
      timer = setTimeout(
        () => {
          synth.cancel()
          finish()
        },
        Math.max(3000, (text.length * 120) / rate + 3000),
      )
      u.onend = finish
      u.onerror = finish
      utterRef.current = u
      synth.speak(u)
    })

  // true — договорили; false — цикл скасовано
  const say = async (text, lang, id, slot) => {
    const sentences = splitSentences(text)
    for (let si = 0; si < sentences.length; si++) {
      for (const part of chunkText(sentences[si])) {
        if (id !== runIdRef.current) return false
        setActive({ slot, i: si })
        await speakChunk(part, lang, settingsRef.current.rate)
      }
    }
    if (id === runIdRef.current) setActive(null)
    return id === runIdRef.current
  }

  const pairAt = (i) => {
    const w = wordsRef.current[i]
    const st = settingsRef.current
    if (!w) return null
    const orig = { text: w.word || "", lang: st.fromLang }
    const tran = { text: w.translation || "", lang: st.toLang }
    return st.reverseOrder ? { first: tran, second: orig } : { first: orig, second: tran }
  }

  const runLoop = useCallback(
    async (startIdx) => {
      if (!wordsRef.current.length) return
      cancelAll()
      const id = runIdRef.current
      setRunning(true)
      setFinished(false)
      let i = startIdx
      while (i < wordsRef.current.length) {
        if (id !== runIdRef.current) return
        indexRef.current = i
        setIndex(i)
        setShowSecond(false)
        const { first, second } = pairAt(i)
        const st = settingsRef.current

        if (!(await say(first.text, first.lang, id, "first"))) return
        await sleep(st.delayOriginal)
        if (id !== runIdRef.current) return

        setShowSecond(true)
        if (!(await say(second.text, second.lang, id, "second"))) return
        await sleep(st.delayTranslation1)
        if (id !== runIdRef.current) return

        if (st.repeatTranslation) {
          if (!(await say(second.text, second.lang, id, "second"))) return
          await sleep(st.delayTranslation2)
          if (id !== runIdRef.current) return
        }
        i++
      }
      if (id === runIdRef.current) {
        setRunning(false)
        setFinished(true)
      }
    },
    [cancelAll],
  )

  // ── Команди ───────────────────────────────────────────────────
  const goTo = useCallback(
    (i) => {
      const len = wordsRef.current.length
      if (i < 0 || i >= len) return
      if (runningRef.current) {
        runLoop(i)
      } else {
        cancelAll()
        indexRef.current = i
        setIndex(i)
        setShowSecond(false)
        setFinished(false)
      }
    },
    [runLoop, cancelAll],
  )

  const start = useCallback(() => runLoop(0), [runLoop])
  const pause = useCallback(() => {
    cancelAll()
    setRunning(false)
  }, [cancelAll])
  const resume = useCallback(() => runLoop(indexRef.current), [runLoop])
  const toggle = useCallback(() => (runningRef.current ? pause() : resume()), [pause, resume])
  const repeat = useCallback(() => runLoop(indexRef.current), [runLoop])
  const next = useCallback(() => goTo(indexRef.current + 1), [goTo])
  const back = useCallback(() => goTo(indexRef.current - 1), [goTo])

  const nextTopic = useCallback(() => {
    const ws = wordsRef.current
    const cur = ws[indexRef.current]?.topic_id
    if (cur == null) return
    for (let i = indexRef.current + 1; i < ws.length; i++) {
      if (ws[i].topic_id !== cur) return goTo(i)
    }
  }, [goTo])

  const prevTopic = useCallback(() => {
    const ws = wordsRef.current
    const cur = ws[indexRef.current]?.topic_id
    if (cur == null) return
    for (let i = indexRef.current - 1; i >= 0; i--) {
      if (ws[i].topic_id !== cur) {
        const prevId = ws[i].topic_id
        return goTo(ws.findIndex((w) => w.topic_id === prevId))
      }
    }
  }, [goTo])

  // ── Підтримка браузером і наявність голосів ───────────────────
  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setSupported(false)
      return
    }
    const synth = window.speechSynthesis
    const check = () => {
      const voices = synth.getVoices()
      if (!voices.length) return
      const langs = [s.fromLang, s.toLang]
      setMissingLangs(langs.filter((l) => !voices.some((v) => norm(v.lang).startsWith(norm(l).slice(0, 2)))))
    }
    check()
    synth.addEventListener("voiceschanged", check)
    return () => synth.removeEventListener("voiceschanged", check)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.fromLang, s.toLang])

  useEffect(() => () => cancelAll(), [cancelAll])

  return {
    index,
    total: words.length,
    current: words[index] ?? null,
    pair: pairAt(index),
    showSecond,
    isRunning,
    finished,
    supported,
    missingLangs,
    active,
    commands: { start, pause, resume, toggle, repeat, next, back, nextTopic, prevTopic, stop: pause },
  }
}
