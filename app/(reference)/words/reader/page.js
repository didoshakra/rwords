// app/words/reader/page.js
"use client"

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react"
import { useSession } from "next-auth/react"
import {
  translateText,
  addWordFromReader,
  getOrCreateInboxTopic,
  getUserWordsSet,
} from "@/app/actions/words/wordActions"

// ─── Попап ──────────────────────────────────────────────────────────────────

function WordPopup({ selectedText, anchor = { top: 0, left: 0 }, topicId, pageTitle, onEnsureTopic, userId, knownWords, onClose, onAdded }) {
  const [translation, setTranslation] = useState("")
  const [loadingTranslation, setLoadingTranslation] = useState(true)
  const [step, setStep] = useState("idle") // idle | needTitle | adding | duplicate | added | error
  const [dupInfo, setDupInfo] = useState("")
  const [localTitle, setLocalTitle] = useState("")
  const [coords, setCoords] = useState({ top: anchor.top + 10, left: anchor.left })
  const popupRef = useRef(null)
  const textareaRef = useRef(null)

  const POPUP_WIDTH = 700
  const MAX_TEXTAREA_HEIGHT = 160

  // Переклад при відкритті
  useEffect(() => {
    setLoadingTranslation(true)
    setStep("idle")
    setTranslation("")
    translateText(selectedText, "en", "uk")
      .then((t) => setTranslation(t))
      .catch(() => setTranslation(""))
      .finally(() => setLoadingTranslation(false))
  }, [selectedText])

  // Закриття по кліку поза попапом
  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) onClose()
    }
    const timer = setTimeout(() => document.addEventListener("mousedown", handler), 100)
    return () => {
      clearTimeout(timer)
      document.removeEventListener("mousedown", handler)
    }
  }, [onClose])

  // Авторозмір textarea під довжину перекладу, з межею висоти
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const next = Math.min(textareaRef.current.scrollHeight, MAX_TEXTAREA_HEIGHT)
      textareaRef.current.style.height = next + "px"
    }
  }, [translation, loadingTranslation])

  // Позиціонування: зліва під останнім рядком виділення, з межами екрану
  useLayoutEffect(() => {
    if (!popupRef.current) return
    const popupHeight = popupRef.current.offsetHeight
    const left = Math.min(Math.max(anchor.left, 8), window.innerWidth - POPUP_WIDTH - 8)
    const top =
      anchor.top + 10 + popupHeight > window.innerHeight ? Math.max(anchor.top - popupHeight - 10, 8) : anchor.top + 10
    setCoords({ top, left })
  }, [translation, loadingTranslation, step, dupInfo, anchor])

  const handleAdd = async (force = false) => {
    if (!userId) return
    setStep("adding")
    try {
      let activeTopicId = topicId
      if (!activeTopicId) {
        const title = (pageTitle || localTitle).trim()
        if (!title) {
          setStep("needTitle")
          return
        }
        const result = await onEnsureTopic(title)
        activeTopicId = result.topicId
      }
      const result = await addWordFromReader(selectedText, translation, activeTopicId, userId, force)
      if (result.status === "duplicate") {
        setStep("duplicate")
        setDupInfo(result.existingIn)
      } else {
        setStep("added")
        onAdded(selectedText)
        setTimeout(onClose, 1000)
      }
    } catch {
      setStep("error")
    }
  }

  return (
    <div
      ref={popupRef}
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        width: POPUP_WIDTH,
        maxHeight: "70vh",
        overflowY: "auto",
        zIndex: 1000,
      }}
      className="relative bg-white border border-gray-200 rounded-xl shadow-2xl p-4 flex flex-col gap-3"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-300 hover:text-gray-500 text-xl leading-none"
      >
        ×
      </button>

      {/* Переклад */}
      {loadingTranslation ? (
        <div className="text-sm text-gray-400 animate-pulse py-1 pr-5">Перекладаємо...</div>
      ) : (
        <textarea
          ref={textareaRef}
          style={{ maxHeight: MAX_TEXTAREA_HEIGHT, overflowY: "auto" }}
          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 pr-5"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          placeholder="Переклад"
          rows={1}
        />
      )}

      {/* Вже є у словнику */}
      {knownWords.has(selectedText.toLowerCase()) && step === "idle" && (
        <div className="text-xs text-emerald-600 bg-emerald-50 rounded-lg px-2 py-1.5">✓ Вже є у вашому словнику</div>
      )}

      {/* Не залогінений */}
      {!userId && (
        <div className="text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1.5">
          Увійдіть, щоб додавати слова в словник
        </div>
      )}

      {/* Статуси */}
      {userId && step === "added" && (
        <div className="text-sm text-emerald-600 font-medium text-center py-1">✓ Додано!</div>
      )}
      {userId && step === "error" && <div className="text-sm text-red-500 text-center">Помилка, спробуйте ще раз</div>}

      {userId && step === "duplicate" && (
        <div className="flex flex-col gap-2">
          <div className="text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1.5">
            Вже є в: <span className="font-medium">{dupInfo}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleAdd(true)}
              className="flex-1 text-xs bg-amber-500 text-white rounded-lg px-2 py-1.5 hover:bg-amber-600 transition-colors"
            >
              Все одно додати
            </button>
            <button
              onClick={onClose}
              className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Відмінити
            </button>
          </div>
        </div>
      )}

      {/* Запит назви тексту — лише якщо тема ще не створена і назва ніде не вказана */}
      {userId && step === "needTitle" && (
        <div className="flex flex-col gap-2">
          <div className="text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1.5">
            Вкажіть назву тексту — вона стане назвою теми
          </div>
          <input
            autoFocus
            type="text"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            placeholder="Наприклад: Harry Potter ch.1"
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={() => handleAdd(false)}
            disabled={!localTitle.trim()}
            className="w-full bg-blue-600 text-white text-sm rounded-lg px-3 py-2 hover:bg-blue-700 disabled:opacity-40 transition-colors font-medium"
          >
            Зберегти і додати
          </button>
        </div>
      )}

      {/* Кнопка додати */}
      {userId && (step === "idle" || step === "adding") && (
        <button
          onClick={() => handleAdd(false)}
          disabled={step === "adding" || loadingTranslation}
          className="w-full bg-blue-600 text-white text-sm rounded-lg px-3 py-2 hover:bg-blue-700 disabled:opacity-40 transition-colors font-medium"
        >
          {step === "adding" ? "Додаємо..." : "Додати в словник"}
        </button>
      )}
    </div>
  )
}

// ─── Підсвічування тексту ───────────────────────────────────────────────────

function renderHighlightedText(text, knownWords, addedInSession) {
  const tokens = text.split(/(\s+)/)
  return tokens.map((token, i) => {
    const clean = token.replace(/[^a-zA-ZÀ-öø-ÿА-яҐєіїЄІЇ]/g, "").toLowerCase()
    if (!clean) return <span key={i}>{token}</span>
    if (addedInSession.has(clean)) {
      return (
        <span key={i} className="bg-blue-100 rounded px-0.5">
          {token}
        </span>
      )
    }
    if (knownWords.has(clean)) {
      return (
        <span key={i} className="bg-emerald-50 rounded px-0.5">
          {token}
        </span>
      )
    }
    return <span key={i}>{token}</span>
  })
}

// ─── Основна сторінка ────────────────────────────────────────────────────────

export default function ReaderPage() {
  const { data: session } = useSession()
  const user = session?.user

  const [textTitle, setTextTitle] = useState("")
  const [text, setText] = useState("")
  const [readMode, setReadMode] = useState(false)

  const [topicId, setTopicId] = useState(null)
  const [topicName, setTopicName] = useState("")
  const [sectionName, setSectionName] = useState("")

  const [knownWords, setKnownWords] = useState(new Set())
  const [addedInSession, setAddedInSession] = useState(new Set())

  const [popup, setPopup] = useState(null)
  const readerRef = useRef(null)

  // Слова юзера для підсвічування
  useEffect(() => {
    if (!user?.id) return
    getUserWordsSet(user.id).then((words) => setKnownWords(new Set(words)))
  }, [user])

  // Перехід в режим читання — тема НЕ створюється тут, лише при першому додаванні слова
  const handleStartReading = () => {
    if (!text.trim()) return
    setReadMode(true)
  }

  // Створює тему лише в момент, коли вона реально потрібна (перше додавання слова)
  const ensureTopic = useCallback(
    async (title) => {
      const result = await getOrCreateInboxTopic(user.id, user.name, title)
      setTopicId(result.topicId)
      setTopicName(result.topicName)
      setSectionName(result.sectionName)
      return result
    },
    [user],
  )

  // mouseup — відкриваємо попап після виділення, прив'язуючи його до лівого краю
  // контейнера читача й до останнього рядка виділення (а не до точки кліку)
  useEffect(() => {
    if (!readMode) return
    const handleMouseUp = () => {
      setTimeout(() => {
        const selection = window.getSelection()
        const selected = selection?.toString().trim()
        if (!selected || selected.length < 2) return
        if (!selection.rangeCount) return
        if (readerRef.current && !readerRef.current.contains(selection.anchorNode)) return

        const range = selection.getRangeAt(0)
        const rects = range.getClientRects()
        const lastRect = rects.length > 0 ? rects[rects.length - 1] : range.getBoundingClientRect()
        const containerRect = readerRef.current.getBoundingClientRect()

        setPopup({
          text: selected,
          anchor: { left: containerRect.left, top: lastRect.bottom },
        })
      }, 10)
    }
    document.addEventListener("mouseup", handleMouseUp)
    return () => document.removeEventListener("mouseup", handleMouseUp)
  }, [readMode])

  const handleAdded = useCallback((word) => {
    const lower = word.toLowerCase()
    setAddedInSession((prev) => new Set([...prev, lower]))
    setKnownWords((prev) => new Set([...prev, lower]))
  }, [])

  const handleClosePopup = useCallback(() => {
    setPopup(null)
    window.getSelection()?.removeAllRanges()
  }, [])

  return (
    <main className="max-w-3xl mx-auto p-4 min-h-screen">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-gray-800">Читач</h1>
        <div className="flex items-center gap-2">
          {readMode && addedInSession.size > 0 && (
            <span className="text-sm text-emerald-600 bg-emerald-50 rounded-lg px-2 py-1">
              +{addedInSession.size} додано
            </span>
          )}
          {readMode && (
            <button
              onClick={() => {
                setReadMode(false)
                setPopup(null)
              }}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              ← Змінити текст
            </button>
          )}
        </div>
      </div>

      {/* Режим вводу */}
      {!readMode && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Назва тексту{" "}
              <span className="text-gray-400 font-normal">(стане темою у вашій секції; можна вказати пізніше)</span>
            </label>
            <input
              type="text"
              value={textTitle}
              onChange={(e) => setTextTitle(e.target.value)}
              placeholder="Наприклад: Harry Potter ch.1"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Текст</label>
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Вставте або введіть текст для читання..."
              className="w-full border border-gray-200 rounded-xl p-4 text-base leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
              rows={14}
            />
          </div>
          <button
            onClick={handleStartReading}
            disabled={!text.trim()}
            className="self-end bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            Читати →
          </button>
        </div>
      )}

      {/* Режим читання */}
      {readMode && (
        <>
          <div className="flex items-center gap-4 mb-4 text-xs text-gray-400 flex-wrap">
            {sectionName && topicName && (
              <span className="text-gray-500">
                📥 <span className="font-medium text-gray-700">{sectionName}</span> →{" "}
                <span className="font-medium text-gray-700">{topicName}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-200 inline-block" />
              Вже у словнику
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-200 inline-block" />
              Додано зараз
            </span>
            <span>Виділіть слово або фразу мишкою</span>
          </div>

          <div
            ref={readerRef}
            className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm leading-8 text-gray-900 cursor-text"
            style={{ fontFamily: "Georgia, serif", fontSize: "1.05rem", userSelect: "text" }}
          >
            {renderHighlightedText(text, knownWords, addedInSession)}
          </div>

          {!user && (
            <div className="mt-4 text-sm text-amber-600 bg-amber-50 rounded-xl p-3">
              Увійдіть в акаунт щоб додавати слова в словник
            </div>
          )}
        </>
      )}

      {/* Попап */}
      {popup && (
        <WordPopup
          selectedText={popup.text}
          anchor={popup.anchor}
          topicId={topicId}
          pageTitle={textTitle}
          onEnsureTopic={ensureTopic}
          userId={user?.id}
          knownWords={knownWords}
          onClose={handleClosePopup}
          onAdded={handleAdded}
        />
      )}
    </main>
  )
}
