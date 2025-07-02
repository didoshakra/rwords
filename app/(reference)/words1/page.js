// words/page.jsx
// Групування 1-го рівня /Topics
"use client"

import React, { useEffect, useState, useTransition, useRef } from "react"
import {
  getWords,
  createWord,
  updateWord,
  deleteWord,
  updateWordPn,
  importCSV,
  translateWord,
} from "@/app/actions/wordActions"
import { getTopics } from "@/app/actions/topicActions"
import { useAuth } from "@/app/context/AuthContext"
import { deleteWords } from "@/app/actions/wordActions"
import MoveRowModal from "@/app/components/tables/MoveRowModal"

function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 min-w-[320px] relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

export default function WordsPage() {
  const { user } = useAuth()
  const [words, setWords] = useState([])
  const [topics, setTopics] = useState([])
  const [modal, setModal] = useState(null) // null | {type, word}
  const [id, setId] = useState(null)
  const [word, setWord] = useState("")
  const [translation, setTranslation] = useState("")
  const [topic_id, setTopicId] = useState("")
  const [pn, setPn] = useState("")
  const [know, setKnow] = useState(false)
  const [img, setImg] = useState("")
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()
  const [isOrderChanged, setIsOrderChanged] = useState(false) //Для порередження про зміну порядку
  // Стани для перекладу (useState та useRef)
  const [translate, setTranslate] = useState(false)
  const [translatedCount, setTranslatedCount] = useState(0)
  const [totalWords, setTotalWords] = useState(0)
  const stopRequested = useRef(false)
  const translatedCountRef = useRef(0)
  const [selectedIds, setSelectedIds] = useState([]) //
  //   Для модалки стрілок переміщення рядків
  const [moveMode, setMoveMode] = useState(false)
  const [moveInfo, setMoveInfo] = useState(null) // { idx, total }
  const tableContainerRef = useRef(null) //Для скролу при переміщенні****
  const rowRefs = useRef([]) //Для скролу при переміщенні
  //   Для рогкриття груп(секцій)
  const [openTopics, setOpenTopics] = useState(topics.map((t) => t.id)) // за замовчуванням всі відкриті

  const fromLanguage = "uk"
  const toLanguage = "en"

  useEffect(() => {
    loadWords()
    loadTopics()
  }, [])

  const loadWords = () => {
    getWords()
      .then(setWords)
      .catch((err) => setMessage("Помилка: " + err.message))
  }

  const loadTopics = () => {
    getTopics()
      .then(setTopics)
      .catch(() => setTopics([]))
  }

  const openAddModal = () => {
    setId(null)
    setWord("")
    setTranslation("")
    setTopicId("")
    setPn("")
    setKnow(false)
    setImg("")
    setModal({ type: "add" })
    setMessage("")
  }

  const openEditModal = (w) => {
    setId(w.id)
    setWord(w.word)
    setTranslation(w.translation)
    setTopicId(w.topic_id.toString())
    setPn(w.pn.toString())
    setKnow(w.know)
    setImg(w.img || "")
    setModal({ type: "edit", word: w })
    setMessage("")
  }

  const closeModal = () => {
    setModal(null)
    setId(null)
    setWord("")
    setTranslation("")
    setTopicId("")
    setPn("")
    setKnow(false)
    setImg("")
    setMessage("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!user) return setMessage("Потрібна авторизація")
    if (!word.trim() || !translation.trim()) return setMessage("Заповніть слово та переклад")
    if (!topic_id) return setMessage("Оберіть топік")

    const data = {
      word: word.trim(),
      translation: translation.trim(),
      topic_id: Number(topic_id),
      pn: pn ? Number(pn) : 0,
      know,
      img: img.trim(),
    }

    startTransition(async () => {
      try {
        if (modal?.type === "edit") {
          await updateWord(id, data, user)
          setMessage("Слово оновлено")
        } else {
          await createWord(data, user.id)
          setMessage("Слово створено")
        }
        closeModal()
        loadWords()
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  const handleDelete = (w) => {
    if (!confirm("Ви впевнені, що хочете видалити це слово?")) return
    startTransition(async () => {
      try {
        await deleteWord(w.id, user)
        setMessage("Слово видалено")
        loadWords()
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  //GPT/ Кнопки переміщення рядків
  const handleMoveUp = async (w) => {
    try {
      await moveWordUp(w.id, user)
      loadWords()
    } catch (err) {
      setMessage("Помилка переміщення: " + err.message)
    }
  }

  const handleMoveDown = async (w) => {
    try {
      await moveWordDown(w.id, user)
      loadWords()
    } catch (err) {
      setMessage("Помилка переміщення: " + err.message)
    }
  }
  const moveUpInState = (index) => {
    if (index <= 0) return
    const updatedWords = [...words]
    ;[updatedWords[index - 1], updatedWords[index]] = [updatedWords[index], updatedWords[index - 1]]
    updatePNs(updatedWords)
  }

  const moveDownInState = (index) => {
    if (index >= words.length - 1) return
    const updatedWords = [...words]
    ;[updatedWords[index], updatedWords[index + 1]] = [updatedWords[index + 1], updatedWords[index]]
    updatePNs(updatedWords)
  }

  const saveOrder = async () => {
    if (!user) return

    if (user.role !== "admin") {
      alert("Зберігати порядок усіх слів може лише адміністратор.")
      return
    }

    try {
      for (let i = 0; i < words.length; i++) {
        const w = words[i]
        const newPn = i + 1
        if (w.pn !== newPn) {
          await updateWordPn(w.id, newPn, user)
        }
      }
      setMessage("✅ Порядок збережено адміністратором")
      setTimeout(() => setMessage(""), 2000)
      setIsOrderChanged(false)
      loadWords()
    } catch (err) {
      setMessage("Помилка при збереженні: " + err.message)
    }
  }

  const updatePNs = (updatedWords) => {
    const newWords = updatedWords.map((w, i) => ({
      ...w,
      pn: i + 1, // оновлюємо pn
    }))
    setWords(newWords)
    setIsOrderChanged(true) // ⚠️ встановлюємо прапорець змін
  }

  const isOwnerOrAdmin = (w) => user && (user.role === "admin" || user.id === w.user_id)

  //Для попередження про зміни при виході або призакритті вкладки
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isOrderChanged) {
        e.preventDefault()
        e.returnValue = "" // Потрібно для деяких браузерів
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [isOrderChanged])

  // Імпорт з csv
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setMessage("")
    startTransition(async () => {
      try {
        const text = await file.text()
        // Виклик серверної action-функції importCSV, яку треба імпортувати
        const result = await importCSV(text, user)
        setMessage(result)
        loadWords()
      } catch (error) {
        setMessage(error.message || "Помилка імпорту")
      }
      // Очищуємо input, щоб можна було знову завантажити той самий файл, якщо треба
      event.target.value = null
    })
  }

  const translateAllWords = async () => {
    stopRequested.current = false
    setTranslate(true)
    setTranslatedCount(0)
    translatedCountRef.current = 0

    let allWords
    try {
      allWords = await getWords()
    } catch (err) {
      alert("❌ Не вдалося завантажити слова з БД.")
      setTranslate(false)
      return
    }

    const untranslatedWords = allWords.filter((w) => !w.translation?.trim())

    if (allWords.length === 0) {
      setTranslate(false)
      alert("⚠️ У таблиці немає жодного слова.")
      return
    }

    const ask = confirm(
      untranslatedWords.length < allWords.length
        ? "Деякі слова вже перекладено. Перекладати всі?"
        : "Перекладати всі слова?"
    )

    const wordsToTranslate = untranslatedWords.length < allWords.length && !ask ? untranslatedWords : allWords

    startTranslation(wordsToTranslate)
  }

  const startTranslation = async (wordsToTranslate) => {
    setTotalWords(wordsToTranslate.length)
    if (wordsToTranslate.length === 0) {
      setTranslate(false)
      return
    }

    for (let i = 0; i < wordsToTranslate.length; i++) {
      if (stopRequested.current) {
        alert(`⏸ Зупинено на ${i} із ${wordsToTranslate.length} слів`)
        setTranslate(false)
        loadWords?.()
        return
      }

      const word = wordsToTranslate[i].word
      const id = wordsToTranslate[i].id

      try {
        await translateWord(word, fromLanguage, toLanguage) // server action
        setTranslatedCount((prev) => prev + 1)
        translatedCountRef.current++
      } catch (err) {
        console.error("❌ Помилка перекладу:", word, err)
      }

      await new Promise((res) => setTimeout(res, 400)) // пауза
    }

    alert(`✅ Переклад завершено: ${translatedCountRef.current} із ${wordsToTranslate.length}`)
    setTranslate(false)
    loadWords?.()
  }
  //   -------------------------------------------

  // Кнопка старт/стоп перекладу
  const handleTranslate = () => {
    if (!translate) {
      translateAllWords()
    } else {
      stopRequested.current = true
      setTranslate(false)
    }
  }

  const deleteSelected = async () => {
    if (!user) {
      alert("Потрібна авторизація, щоб видаляти слова")
      return
    }
    if (selectedIds.length === 0) return
    // Знаходимо слова за id
    const selectedWords = words.filter((w) => selectedIds.includes(w.id))

    // Визначаємо, які слова належать користувачу
    const ownWords = selectedWords.filter((w) => user.role === "admin" || w.user_id === user.id)
    const ownIds = ownWords.map((w) => w.id)
    const othersCount = selectedWords.length - ownWords.length

    if (ownIds.length === 0) {
      // Нема своїх слів для видалення
      alert("Усі вибрані записи належать іншим користувачам. Видаляти нічого.")
      return
    }

    if (othersCount > 0) {
      const confirmed = confirm(
        `У виборі є ${othersCount} чужих слів. Видалити лише ваші (${ownIds.length})? Натисніть OK, щоб видалити свої, або Відмінити.`
      )
      if (!confirmed) return
    } else {
      const confirmed = confirm(`Видалити ${ownIds.length} слів?`)
      if (!confirmed) return
    }

    try {
      await deleteWords(ownIds, user)
      setMessage(`🗑️ Видалено ${ownIds.length} слів`)
      clearSelection()
      loadWords()
    } catch (err) {
      setMessage("Помилка при видаленні: " + err.message)
    }
  }

  const isSelected = (id) => selectedIds.includes(id)

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const selectAll = () => {
    setSelectedIds(words.map((w) => w.id))
  }

  const clearSelection = () => {
    setSelectedIds([])
  }
  //   Для модалки стрілок переміщення рядків
  const startMoveMode = () => {
    if (selectedIds.length !== 1) return

    const id = selectedIds[0]
    const idx = words.findIndex((w) => w.id === id)
    if (idx === -1) return

    setMoveInfo({ idx, total: words.length })
    scrollRowIntoView(idx) //Для автоскролу
    setMoveMode(true)
  }
  //   Для автоскролу при переміщенні
  const scrollRowIntoView = (rowIndex) => {
    const container = document.querySelector(".table-container") // контейнер з overflow-auto, що обгортає таблицю
    if (!container) return

    const rows = container.querySelectorAll("tbody tr")
    if (!rows[rowIndex]) return

    const row = rows[rowIndex]

    const containerTop = container.scrollTop
    const containerBottom = containerTop + container.clientHeight

    const rowTop = row.offsetTop
    const rowBottom = rowTop + row.offsetHeight

    if (rowTop < containerTop) {
      // рядок вище видимої області, скролимо наверх, щоб побачити його
      container.scrollTop = rowTop
    } else if (rowBottom > containerBottom) {
      // рядок нижче видимої області, скролимо вниз
      container.scrollTop = rowBottom - container.clientHeight
    }
  }

  //   Функція для переміщення рядка в масиві words в стані:
  const moveSelectedRow = (direction) => {
    if (!moveInfo) return

    // let { idx, total } = moveInfo
    // Для обмеження переміщення в межах групи
    let { idx } = moveInfo
    const topicId = words[idx].topic_id
    const topicWords = words.filter((w) => w.topic_id === topicId)
    const topicIndexes = topicWords.map((w) => words.findIndex((x) => x.id === w.id))
    const localIdx = topicIndexes.indexOf(idx)

    let newIdx = idx

    // Для обмеження переміщення в межах групи
    if (direction === "up" && localIdx > 0) {
      newIdx = topicIndexes[localIdx - 1]
    } else if (direction === "down" && localIdx < topicIndexes.length - 1) {
      newIdx = topicIndexes[localIdx + 1]
    }

    if (newIdx === idx) return // нічого не змінилось

    // Створюємо копію масиву
    let updatedWords = [...words]

    // Міняємо місцями два елементи
    ;[updatedWords[idx], updatedWords[newIdx]] = [updatedWords[newIdx], updatedWords[idx]]

    // Оновлюємо pn
    const newWordsWithPN = updatedWords.map((w, i) => ({ ...w, pn: i + 1 }))

    setWords(newWordsWithPN)
    setIsOrderChanged(true)
    setMoveInfo({ idx: newIdx, total })
    // скролимо
    if (rowRefs.current[newIdx]) {
      rowRefs.current[newIdx].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }

  //   Для розкриття груп
  const toggleTopic = (topicId) => {
    setOpenTopics((prev) => (prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]))
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Слова</h1>
      <div className="flex flex-wrap gap-2 items-center mb-4">
        {/* ДОДАТИ, ПЕРЕКЛАСТИ, ІМПОРТУВАТИ – завжди */}
        {user && selectedIds.length === 0 && (
          <>
            <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded">
              ➕ Додати слово
            </button>
            <button
              onClick={() => document.getElementById("csvInput").click()}
              className="bg-purple-600 text-white px-4 py-2 rounded"
              disabled={isPending}
            >
              📂 Імпортувати CSV
            </button>
            <button
              onClick={handleTranslate}
              className={`px-4 py-2 rounded text-white ${translate ? "bg-red-600" : "bg-indigo-600"}`}
            >
              {translate ? "⏸ Зупинити переклад" : "▶️ Старт перекладу"}
            </button>
          </>
        )}

        {/* ЗБЕРЕГТИ ПОРЯДОК – тільки якщо були зміни */}
        {isOrderChanged && (
          <button onClick={saveOrder} className="bg-green-600 text-white px-4 py-2 rounded">
            💾 Зберегти порядок
          </button>
        )}

        {/* 1 ВИДІЛЕНИЙ РЯДОК */}
        {selectedIds.length === 1 &&
          (() => {
            const selectedWord = words.find((w) => w.id === selectedIds[0])
            const isOwner = user && selectedWord && selectedWord.user_id === user.id

            return (
              <>
                {isOwner && (
                  <>
                    <button
                      onClick={() => openEditModal(selectedWord)}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      ✏️ Редагувати
                    </button>
                    <button
                      onClick={() => handleDelete(selectedWord)}
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      🗑️ Видалити
                    </button>
                  </>
                )}
                <button
                  onClick={startMoveMode}
                  //   onClick={() => setModal({ type: "move", word: selectedWord })}
                  className="bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  🔀 Перемістити
                </button>
              </>
            )
          })()}

        {/* БАГАТО ВИДІЛЕНИХ */}
        {selectedIds.length > 1 && (
          <button onClick={deleteSelected} className="bg-red-600 text-white px-4 py-2 rounded">
            🗑 Видалити вибрані
          </button>
        )}
      </div>
      <input type="file" id="csvInput" accept=".csv,text/csv" style={{ display: "none" }} onChange={handleFileUpload} />
      {message && (
        <p className="mb-4 text-green-700 font-medium" role="alert">
          {message}
        </p>
      )}
      {/* перший рядок над таблицею */}
      <div className="flex gap-2 items-center">
        <span className="text-gray-700">📄Всього зап: {words.length} </span>

        <button
          onClick={() => (selectedIds.length === words.length ? clearSelection() : selectAll())}
          className="text-sm px-2 py-1 rounded border"
        >
          {selectedIds.length === words.length ? "☑ Зняти всі" : "☐ Виділити всі"}
          {/* {selectedIds.length === words.length ? "☑" : "☐"} */}
        </button>
        {selectedIds.length > 0 && <span className="text-blue-700">Виділено: {selectedIds.length}</span>}
      </div>
      <div ref={tableContainerRef} className="max-h-[500px] overflow-auto border border-gray-300 rounded shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">№п</th>
              <th className="p-2 border">Слово</th>
              <th className="p-2 border">Переклад</th>
              <th className="p-2 border">Топік</th>
              <th className="p-2 border">Знає?</th>
            </tr>
          </thead>
          <tbody>
            {/* {words.map((w, index) => (
              <tr
                key={w.id}
                ref={(el) => (rowRefs.current[index] = el)}
                onClick={() => toggleSelect(w.id)}
                className={`cursor-pointer ${isSelected(w.id) ? "bg-blue-100" : "hover:bg-gray-50"}`}
              >
                <td className="p-2 border">{w.id}</td>
                <td className="p-2 border">
                  {w.pn}
                  {w.user_id === user.id && "🧑‍💻"}
                </td>
                <td className="p-2 border">{w.word}</td>
                <td className="p-2 border">{w.translation}</td>
                <td className="p-2 border">{topics.find((t) => t.id === w.topic_id)?.name || w.topic_id}</td>
                <td className="p-2 border">{w.know ? "✅" : "❌"}</td>
              </tr>
            ))} */}
            {topics.map((topic) => {
              const topicWords = words.filter((w) => w.topic_id === topic.id)
              if (topicWords.length === 0) return null
              return (
                <React.Fragment key={topic.id}>
                  <tr onClick={() => toggleTopic(topic.id)} className="bg-gray-200 cursor-pointer">
                    <td colSpan="6" className="p-2 font-semibold">
                      {topic.name} ({topicWords.length}){openTopics.includes(topic.id) ? " 🔽" : " ▶️"}
                    </td>
                  </tr>
                  {openTopics.includes(topic.id) &&
                    topicWords.map((w, index) => (
                      <tr
                        key={w.id}
                        onClick={() => toggleSelect(w.id)}
                        className={`cursor-pointer ${isSelected(w.id) ? "bg-blue-100" : "hover:bg-gray-50"}`}
                      >
                        <td className="p-2 border">{w.id}</td>
                        <td className="p-2 border">
                          {w.pn}
                          {w.user_id === user?.id && "🧑‍💻"}
                        </td>
                        <td className="p-2 border">{w.word}</td>
                        <td className="p-2 border">{w.translation}</td>
                        <td className="p-2 border">{topic.name}</td>
                        <td className="p-2 border">{w.know ? "✅" : "❌"}</td>
                      </tr>
                    ))}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
      <Modal open={!!modal} onClose={closeModal}>
        <h2 className="text-lg font-semibold mb-4">{modal?.type === "edit" ? "Редагувати слово" : "Додати слово"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {modal?.type === "edit" && (
            <div>
              <label htmlFor="id" className="block font-medium mb-1">
                ID
              </label>
              <input
                id="id"
                type="text"
                value={id}
                readOnly
                className="border p-2 rounded bg-gray-100 cursor-not-allowed"
              />
            </div>
          )}
          <div>
            <label htmlFor="word" className="block font-medium mb-1">
              Слово
            </label>
            <input
              id="word"
              type="text"
              placeholder="Слово"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="border p-2 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="translation" className="block font-medium mb-1">
              Переклад
            </label>
            <input
              id="translation"
              type="text"
              placeholder="Переклад"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              className="border p-2 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="pn" className="block font-medium mb-1">
              Порядок (PN)
            </label>
            <input
              id="pn"
              type="number"
              placeholder="Порядок"
              value={pn}
              onChange={(e) => setPn(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="topic_id" className="block font-medium mb-1">
              Топік
            </label>
            <select
              id="topic_id"
              value={topic_id}
              onChange={(e) => setTopicId(e.target.value)}
              className="border p-2 rounded"
              required
            >
              <option value="">Оберіть топік</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="img" className="block font-medium mb-1">
              URL зображення
            </label>
            <input
              id="img"
              type="text"
              placeholder="URL зображення"
              value={img}
              onChange={(e) => setImg(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={know} onChange={(e) => setKnow(e.target.checked)} />
            Знаю
          </label>
          <div className="flex gap-4 mt-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {modal?.type === "edit" ? "Оновити" : "Додати"}
            </button>
            <button type="button" onClick={closeModal} className="border px-4 py-2 rounded">
              Відмінити
            </button>
          </div>
        </form>
      </Modal>
      <MoveRowModal
        open={moveMode}
        onClose={() => setMoveMode(false)}
        moveInfo={moveInfo}
        moveSelectedRow={moveSelectedRow}
      />
    </main>
  )
}
