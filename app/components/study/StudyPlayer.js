"use client"
// app/components/study/StudyPlayer.js
// Повноекранна накладка відтворення слів. Широкий екран: дві колонки (оригінал | переклад),
// вузький: один над одним. Кожен блок прокручується окремо, довгі тексти отримують дрібніший шрифт.

import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import PlayerSettingsPanel, { ALL_TYPES, loadSavedSettings, saveSettings } from "./PlayerSettingsPanel"
import { useWordPlayer, splitSentences } from "@/app/hooks/useWordPlayer"

const fontSizeFor = (text) => {
  const n = (text || "").length
  if (n <= 15) return "clamp(2rem, 6vw, 3.5rem)"
  if (n <= 50) return "clamp(1.5rem, 4vw, 2.5rem)"
  if (n <= 150) return "clamp(1.25rem, 2.8vw, 1.75rem)"
  if (n <= 400) return "1.125rem"
  return "1rem"
}

// Один блок тексту. Якщо речень більше одного, активне (те, що зараз звучить) підсвічується плашкою.
function SentenceText({ text, activeIndex, fontSize }) {
  const sentences = splitSentences(text)
  const activeRef = useRef(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [activeIndex])

  const style = { fontSize, lineHeight: 1.35 }

  if (sentences.length <= 1) {
    return (
      <p className="whitespace-pre-line" style={style}>
        {text}
      </p>
    )
  }

  return (
    <p className="whitespace-pre-line" style={style}>
      {sentences.map((s, i) => {
        const core = s.trimEnd()
        const tail = s.slice(core.length)
        const on = i === activeIndex
        return (
          <Fragment key={i}>
            <span
              ref={on ? activeRef : null}
              className={
                "rounded px-1 transition-colors " +
                (on ? "bg-amber-200 text-gray-900 dark:bg-amber-600 dark:text-white" : "")
              }
              style={{ boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}
            >
              {core}
            </span>
            {tail}
          </Fragment>
        )
      })}
    </p>
  )
}

function Panel({ label, children }) {
  return (
    <section
      aria-label={label}
      className="flex min-h-0 flex-col overflow-y-auto rounded-2xl border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800"
    >
      {/* m-auto: центр, коли тексту мало; прокрутка, коли багато */}
      <div className="m-auto w-full text-center text-gray-900 dark:text-gray-100">{children}</div>
    </section>
  )
}

function CtrlButton({ onClick, label, children, primary = false, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={
        "min-h-[44px] min-w-[44px] rounded-full px-3 text-lg font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:opacity-40 " +
        (primary
          ? "bg-btBg text-white hover:opacity-70"
          : "border border-gray-400 text-gray-800 hover:bg-gray-100 dark:border-gray-500 dark:text-gray-100 dark:hover:bg-gray-700")
      }
    >
      {children}
    </button>
  )
}

export default function StudyPlayer({ words, topicNameById = {}, settings, onClose }) {
  // Пріоритет: типові < передані сторінкою < збережені в браузері
  const [cfg, setCfg] = useState(() => ({ types: ALL_TYPES, ...settings, ...loadSavedSettings() }))
  const [panelOpen, setPanelOpen] = useState(false)
  const [kick, setKick] = useState(null)
  const panelOpenRef = useRef(false)
  panelOpenRef.current = panelOpen
  const wasRunningRef = useRef(false)

  // Фільтр типів + групування за темою (теми за порядком першої появи, слова в темі в тому ж порядку).
  // Інші (невідомі) типи завжди проходять.
  const playlist = useMemo(() => {
    const filtered = (words || []).filter((w) => {
      const t = w.type || "word"
      return !ALL_TYPES.includes(t) || cfg.types.includes(t)
    })
    const order = []
    const byTopic = new Map()
    for (const w of filtered) {
      if (!byTopic.has(w.topic_id)) {
        byTopic.set(w.topic_id, [])
        order.push(w.topic_id)
      }
      byTopic.get(w.topic_id).push(w)
    }
    return order.flatMap((id) => byTopic.get(id))
  }, [words, cfg.types])

  const p = useWordPlayer(playlist, cfg)
  const { commands: c } = p
  const showSecondRef = useRef(false)
  showSecondRef.current = p.showSecond

  const openPanel = () => {
    wasRunningRef.current = p.isRunning
    c.pause()
    setPanelOpen(true)
  }

  const saveCfg = (next) => {
    const typesChanged = next.types.join() !== cfg.types.join()
    setCfg(next)
    saveSettings(next)
    setPanelOpen(false)
    setKick(typesChanged ? "start" : wasRunningRef.current ? "repeat" : null)
  }

  // Виконується після рендера, коли хук уже бачить нові слова й налаштування
  useEffect(() => {
    if (!kick) return
    if (kick === "start") c.start()
    else c.repeat()
    setKick(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kick])

  // Автостарт. Якщо браузер заблокує озвучку, користувач натисне ▶
  useEffect(() => {
    c.start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Не прокручуємо сторінку під накладкою
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Гарячі клавіші
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return
      if (panelOpenRef.current) {
        if (e.key === "Escape") setPanelOpen(false) // Esc закриває панель, а не плеєр
        return
      }
      switch (e.key) {
        case " ":
          e.preventDefault()
          c.toggle()
          break
        case "ArrowRight":
          c.next()
          break
        case "ArrowLeft":
          c.back()
          break
        case "ArrowDown":
          e.preventDefault()
          c.nextTopic()
          break
        case "ArrowUp":
          e.preventDefault()
          c.prevTopic()
          break
        case "r":
        case "R":
        case "к":
        case "К":
          c.repeat()
          break
        case "t":
        case "T":
        case "е":
        case "Е":
          if (!showSecondRef.current) c.skipToSecond()
          break
        case "Escape":
          c.stop()
          onClose()
          break
        default:
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = () => {
    c.stop()
    onClose()
  }

  const { pair, current } = p
  const topicName = current ? topicNameById[current.topic_id] : ""
  const pct = p.total ? ((p.index + 1) / p.total) * 100 : 0

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Відтворення слів"
      className="fixed inset-0 z-50 flex flex-col gap-3 bg-white p-3 dark:bg-gray-900"
      style={{
        paddingTop: "max(0.75rem, env(safe-area-inset-top))",
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
    >
      {/* Шапка */}
      <header className="flex items-center justify-between gap-2 text-sm text-gray-700 dark:text-gray-200">
        <div className="min-w-0">
          <div className="font-semibold">
            {p.total ? p.index + 1 : 0} з {p.total}
          </div>
          {topicName && <div className="truncate text-xs opacity-80">{topicName}</div>}
        </div>
        <div className="flex gap-2">
          <CtrlButton onClick={openPanel} label="Налаштування">
            ⚙
          </CtrlButton>
          <CtrlButton onClick={close} label="Закрити (Esc)">
            ✕
          </CtrlButton>
        </div>
      </header>

      {/* Прогрес */}
      <div className="h-1 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-700" aria-hidden="true">
        <div className="h-full bg-amber-500" style={{ width: `${pct}%` }} />
      </div>

      {!p.supported && (
        <p role="alert" className="rounded-lg bg-red-100 p-2 text-sm text-red-800">
          Цей браузер не підтримує озвучку. Спробуйте Chrome, Edge або Safari.
        </p>
      )}
      {p.supported && p.missingLangs.length > 0 && (
        <p role="status" className="rounded-lg bg-amber-100 p-2 text-sm text-amber-900">
          У системі немає голосу для: {p.missingLangs.join(", ")}. Слова читатимуться іншим голосом.
        </p>
      )}
      {p.supported && p.total === 0 && (
        <p role="status" className="rounded-lg bg-amber-100 p-2 text-sm text-amber-900">
          Немає слів обраних типів. Змініть фільтр у ⚙.
        </p>
      )}

      {/* Картка */}
      <main
        className="grid min-h-0 flex-1 grid-cols-1 gap-3 md:grid-cols-2"
        style={{ gridTemplateRows: "minmax(0,1fr)" }}
      >
        <Panel label="Спочатку">
          <SentenceText
            text={pair?.first.text}
            activeIndex={p.active?.slot === "first" ? p.active.i : -1}
            fontSize={fontSizeFor(pair?.first.text)}
          />
        </Panel>
        <Panel label="Потім">
          {p.showSecond ? (
            <SentenceText
              text={pair?.second.text}
              activeIndex={p.active?.slot === "second" ? p.active.i : -1}
              fontSize={fontSizeFor(pair?.second.text)}
            />
          ) : (
            <p className="opacity-40" style={{ fontSize: "2.25rem" }}>
              ?
            </p>
          )}
        </Panel>
      </main>
      <p
        role="status"
        aria-live="polite"
        className={
          "min-h-[1.25rem] text-center text-sm " +
          (p.finished ? "font-semibold text-amber-600 dark:text-amber-400" : "text-gray-700 dark:text-gray-200")
        }
      >
        {p.notice || (p.finished ? "✔ Кінець списку слів" : p.isRunning ? "▶ Грає" : "⏸ Пауза")}
      </p>

      {/* Керування */}
      <footer className="flex flex-wrap items-center justify-center gap-2">
        <CtrlButton onClick={c.prevTopic} label="Попередня тема (↑)">
          ⏮
        </CtrlButton>
        <CtrlButton onClick={c.back} label="Назад (←)" disabled={p.index === 0}>
          ◀
        </CtrlButton>
        <CtrlButton onClick={c.toggle} label={p.isRunning ? "Пауза (пробіл)" : "Грати (пробіл)"} primary>
          {p.isRunning ? "⏸" : "▶"}
        </CtrlButton>
        <CtrlButton onClick={c.skipToSecond} label="До перекладу (T)" disabled={p.showSecond}>
          🌐
        </CtrlButton>
        <CtrlButton onClick={c.next} label="Далі (→)" disabled={p.index >= p.total - 1}>
          ▶
        </CtrlButton>
        <CtrlButton onClick={c.nextTopic} label="Наступна тема (↓)">
          ⏭
        </CtrlButton>
        <CtrlButton onClick={c.start} label="Спочатку">
          ⟲
        </CtrlButton>
        <CtrlButton onClick={c.repeat} label="Повторити слово (R)">
          ↻
        </CtrlButton>
      </footer>
      {panelOpen && <PlayerSettingsPanel value={cfg} onSave={saveCfg} onClose={() => setPanelOpen(false)} />}
    </div>
  )
}
