"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSession } from "next-auth/react"
import { getSections } from "@/app/actions/words/sectionActions"
import { getTopics } from "@/app/actions/words/topicActions"
import { translateText, addWordFromReader } from "@/app/actions/words/wordActions"

// ─── Утилітки ───────────────────────────────────────────────────────────────

function tokenize(text) {
  // Розбиває текст на токени: слова і розділювачі (пробіли, пунктуація)
  return text.split(/(\s+|[.,!?;:()\[\]{}"'«»—–\-])/).filter(Boolean)
}

function isWord(token) {
  return /[a-zA-ZÀ-öø-ÿА-яҐєіїЄІЇ]/.test(token)
}

// ─── Попап перекладу / додавання ────────────────────────────────────────────

function WordPopup({ word, position, sections, topics, userId, knownWords, onClose, onAdded }) {
  const [translation, setTranslation] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [status, setStatus] = useState(null) // null | "added" | "duplicate" | "error"
  const [dupInfo, setDupInfo] = useState("")
  const [adding, setAdding] = useState(false)
  const popupRef = useRef(null)

  const filteredTopics = topics.filter((t) => t.section_id?.toString() === selectedSection)

  // Підтягуємо переклад при відкритті
  useEffect(() => {
    setLoading(true)
    setStatus(null)
    setTranslation("")
    translateText(word, "en", "uk")
      .then((t) => setTranslation(t))
      .catch(() => setTranslation(""))
      .finally(() => setLoading(false))
  }, [word])

  // Закриття по кліку поза попапом
  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) onClose()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [onClose])

  const handleAdd = async () => {
    if (!selectedTopic) return
    setAdding(true)
    try {
      const result = await addWordFromReader(word, translation, Number(selectedTopic), userId)
      if (result.status === "duplicate") {
        setStatus("duplicate")
        setDupInfo(result.existingIn)
      } else {
        setStatus("added")
        onAdded(word)
        setTimeout(onClose, 1200)
      }
    } catch {
      setStatus("error")
    } finally {
      setAdding(false)
    }
  }

  const handleAddAnyway = async () => {
    if (!selectedTopic) return
    setAdding(true)
    try {
      // Пряме додавання через createWord — передаємо флаг force
      const result = await addWordFromReader(word, translation, Number(selectedTopic), userId, true)
      setStatus("added")
      onAdded(word)
      setTimeout(onClose, 1200)
    } catch {
      setStatus("error")
    } finally {
      setAdding(false)
    }
  }

  // Позиціонування попапу щоб не вилазив за межі екрану
  const style = {
    position: "fixed",
    top: Math.min(position.y + 8, window.innerHeight - 320),
    left: Math.min(position.x, window.innerWidth - 300),
    zIndex: 1000,
  }

  return (
    <div
      ref={popupRef}
      style={style}
      className="bg-white border border-gray-200 rounded-xl shadow-xl w-72 p-4 flex flex-col gap-3"
    >
      {/* Слово */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900">{word}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
      </div>

      {/* Переклад */}
      <div className="min-h-[28px]">
        {loading ? (
          <span className="text-sm text-gray-400 animate-pulse">Перекладаємо...</span>
        ) : (
          <input
            className="border rounded px-2 py-1 text-sm w-full"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="Переклад"
          />
        )}
      </div>

      {/* Вже є в списку — мітка */}
      {knownWords.has(word.toLowerCase()) && (
        <div className="text-xs text-emerald-600 bg-emerald-50 rounded px-2 py-1">
          ✓ Вже є у вашому словнику
        </div>
      )}

      {/* Статуси */}
      {status === "added" && (
        <div className="text-sm text-emerald-600 font-medium">✓ Додано!</div>
      )}
      {status === "error" && (
        <div className="text-sm text-red-500">Помилка при додаванні</div>
      )}
      {status === "duplicate" && (
        <div className="flex flex-col gap-2">
          <div className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
            Вже є в: <span className="font-medium">{dupInfo}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddAnyway}
              disabled={adding}
              className="text-xs border border-amber-400 text-amber-700 rounded px-2 py-1 hover:bg-amber-50"
            >
              Все одно додати
            </button>
            <button onClick={onClose} className="text-xs border rounded px-2 py-1 text-gray-500 hover:bg-gray-50">
              Скасувати
            </button>
          </div>
        </div>
      )}

      {/* Вибір секції → теми + кнопка додати (якщо не дублікат) */}
      {status !== "added" && status !== "duplicate" && (
        <>
          <select
            value={selectedSection}
            onChange={(e) => { setSelectedSection(e.target.value); setSelectedTopic("") }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">Оберіть секцію</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            disabled={!selectedSection}
            className="border rounded px-2 py-1 text-sm disabled:opacity-40"
          >
            <option value="">Оберіть тему</option>
            {filteredTopics.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <button
            onClick={handleAdd}
            disabled={!selectedTopic || adding || loading}
            className="bg-blue-600 text-white text-sm rounded px-3 py-1.5 hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            {adding ? "Додаємо..." : "Додати в словник"}
          </button>
        </>
      )}
    </div>
  )
}

// ─── Основний компонент ──────────────────────────────────────────────────────

export default function ReaderPage() {
  const { data: session } = useSession()
  const user = session?.user

  const [text, setText] = useState("")
  const [editMode, setEditMode] = useState(true) // true = редагування тексту, false = режим читання
  const [sections, setSections] = useState([])
  const [topics, setTopics] = useState([])
  const [knownWords, setKnownWords] = useState(new Set()) // слова що вже є в словнику юзера
  const [popup, setPopup] = useState(null) // { word, position }
  const [addedInSession, setAddedInSession] = useState(new Set()) // додані за цю сесію

  useEffect(() => {
    getSections(user?.id, user?.role).then(setSections).catch(() => setSections([]))
    getTopics().then(setTopics).catch(() => setTopics([]))
  }, [user])

  // Завантажуємо слова юзера для підсвічування
  useEffect(() => {
    if (!user?.id) return
    fetch("/api/user-words") // потрібен простий endpoint що повертає список слів юзера
      .then((r) => r.json())
      .then((words) => {
        setKnownWords(new Set(words.map((w) => w.word?.toLowerCase())))
      })
      .catch(() => {})
  }, [user])

  const handleWordClick = useCallback((word, e) => {
    const clean = word.replace(/[^a-zA-ZÀ-öø-ÿА-яҐєіїЄІЇ]/g, "")
    if (!clean) return
    const rect = e.target.getBoundingClientRect()
    setPopup({
      word: clean,
      position: { x: rect.left, y: rect.bottom },
    })
  }, [])

  const handleAdded = useCallback((word) => {
    setAddedInSession((prev) => new Set([...prev, word.toLowerCase()]))
    setKnownWords((prev) => new Set([...prev, word.toLowerCase()]))
  }, [])

  const tokens = tokenize(text)

  return (
    <main className="max-w-3xl mx-auto p-4 min-h-screen">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Читач</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setEditMode((v) => !v)}
            className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            {editMode ? "Читати" : "Редагувати текст"}
          </button>
          {addedInSession.size > 0 && (
            <span className="text-sm text-emerald-600 bg-emerald-50 rounded px-2 py-1.5">
              +{addedInSession.size} слів додано
            </span>
          )}
        </div>
      </div>

      {/* Легенда */}
      {!editMode && (
        <div className="flex gap-4 mb-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-300" />
            Вже у словнику
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm bg-blue-100 border border-blue-300" />
            Додано зараз
          </span>
          <span className="flex items-center gap-1.5 text-gray-400">
            Клікніть на слово щоб перекласти і додати
          </span>
        </div>
      )}

      {/* Режим редагування */}
      {editMode ? (
        <div className="flex flex-col gap-3">
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Вставте або введіть текст для читання..."
            className="w-full border border-gray-200 rounded-xl p-4 text-base leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            rows={16}
          />
          <button
            onClick={() => { if (text.trim()) setEditMode(false) }}
            disabled={!text.trim()}
            className="self-end bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            Читати →
          </button>
        </div>
      ) : (
        /* Режим читання */
        <div
          className="text-base leading-8 select-none bg-white border border-gray-100 rounded-xl p-5 shadow-sm"
          style={{ fontFamily: "Georgia, serif", fontSize: "1.05rem" }}
        >
          {tokens.map((token, i) => {
            if (!isWord(token)) {
              return <span key={i}>{token}</span>
            }
            const lower = token.toLowerCase()
            const isKnown = knownWords.has(lower)
            const isNew = addedInSession.has(lower)

            let cls = "cursor-pointer rounded px-0.5 transition-colors hover:bg-yellow-100"
            if (isNew) cls += " bg-blue-100"
            else if (isKnown) cls += " bg-emerald-50"

            return (
              <span
                key={i}
                className={cls}
                onClick={(e) => handleWordClick(token, e)}
              >
                {token}
              </span>
            )
          })}
        </div>
      )}

      {/* Попап */}
      {popup && (
        <WordPopup
          word={popup.word}
          position={popup.position}
          sections={sections}
          topics={topics}
          userId={user?.id}
          knownWords={knownWords}
          onClose={() => setPopup(null)}
          onAdded={handleAdded}
        />
      )}

      {!user && (
        <div className="mt-4 text-sm text-amber-600 bg-amber-50 rounded-lg p-3">
          Увійдіть в акаунт щоб додавати слова в словник
        </div>
      )}
    </main>
  )
}
