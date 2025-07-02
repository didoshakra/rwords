// words/page.jsx
// з TableView
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
import { getSections } from "@/app/actions/sectionActions"
import { getTopics } from "@/app/actions/topicActions"
import { useAuth } from "@/app/context/AuthContext"
import { deleteWords } from "@/app/actions/wordActions"
import TableView from "@/app/components/tables/TableView"

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
  //   Для рогкриття груп(секцій)
    const [openSections, setOpenSections] = useState([])
    const [openTopics, setOpenTopics] = useState(topics.map((t) => t.id)) // за замовчуванням всі відкриті
    const [sections, setSections] = useState([])
//   //   Для модалки стрілок переміщення рядків
//   const [moveMode, setMoveMode] = useState(false)
//   const [moveInfo, setMoveInfo] = useState(null) // { idx, total }
//   const rowRefs = useRef([]) //Для скролу при переміщенні

  const fromLanguage = "uk"
  const toLanguage = "en"

  useEffect(() => {
    loadWords()
    loadTopics()
    loadSections()
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
  const loadSections = () => {
    getSections()
      .then(setSections)
      .catch(() => setSections([]))
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

  // Для модалки додати/коригувати
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

  //   //Для попередження про зміни в порядку при виході або призакритті вкладки
  //   useEffect(() => {
  //     const handleBeforeUnload = (e) => {
  //       if (isOrderChanged) {
  //         e.preventDefault()
  //         e.returnValue = "" // Потрібно для деяких браузерів
  //       }
  //     }

  //     window.addEventListener("beforeunload", handleBeforeUnload)

  //     return () => {
  //       window.removeEventListener("beforeunload", handleBeforeUnload)
  //     }
  //   }, [isOrderChanged])

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
  //   delete
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

  //   const isSelected = (id) => selectedIds.includes(id)

  //   const toggleSelect = (id) => {
  //     setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  //   }

  //   const selectAll = () => {
  //     setSelectedIds(words.map((w) => w.id))
  //   }

  const clearSelection = () => {
    setSelectedIds([])
  }

  //Для TableView
  const columns = [
    {
      label: "№w",
      accessor: "pn",
      type: "integer",
      width: 50,
      styleCell: { alignItems: "center" },
      //   styleCellText: {color: 'green'},
    },
    {
      label: "Зн",
      accessor: "know",
        type: 'boolean',
      type: "know",
      width: 50,
      styleCell: { alignItems: "center" },
      styleCellText: { color: "red" },
    },
    {
      label: "Слова / вирази",
      accessor: "word",
      type: "text",
      width: 250,
      //   style: {backgroundColor: '#fff1'},
      //   styleCell: {alignItems: 'center'},
      //   styleCellText: {fontWeight: 'bold'},
      styleCellText: { fontWeight: 600 },
    },
    { label: "Переклад", accessor: "translation", type: "text", width: 250 },

    // {label: 'Переклад', accessor: 'translation', type: 'text', width: 250},
    { label: "Тема", accessor: "topic_name", type: "text", width: 250 },
    { label: "Секція", accessor: "section_name", type: "text", width: 250 },

    { label: "Файл img", accessor: "img", type: "text", width: 150 },
    {
      label: "№s",
      accessor: "section_pn",
      type: "integer",
      width: 50,
      styleCell: { alignItems: "center" },
    },
    {
      label: "№t",
      accessor: "topic_pn",
      type: "integer",
      width: 50,
      styleCell: { alignItems: "center" },
    },

    {
      label: "id",
      accessor: "id",
      type: "integer",
      width: 60,
      styleCell: { alignItems: "center" },
      //   styleCellText: {color: 'green'},
    },
    {
      label: "Tid",
      accessor: "topic_id",
      type: "integer",
      width: 40,
      styleCell: { alignItems: "center" },
    },
  ]

  return (
    <main className="p-6 max-w-4xl mx-auto">
      {/* Додати/Редагувати */}
      <TableView
        data={words}
        setData={setWords}
        // onSavePn={updateWordsPn}
        columns={columns}
        title={"Слова"}
        //   colorsTable={colorsTable}
        // indexScheme={indexScheme} //колір
        onAdd={openAddModal}
        onEdit={() => openEditModal(selectedWord)}
        onDelete={() => handleDelete(selectedWord)} // передаємо лише id
        onImport={importCSV}
        onTranslate={handleTranslate}
        translate={translate} //Чи перекладено для зміни кнопки
        sectionId={"topic_id"} //🔒 Прив’язка переміщення до певного значення поля
        sectionName={"topic_name"} //Назва секції
        beforeSectionName={"Тема"} // Назва перед: назвою секції
        sortField={"pn"} //поле для порядку
      />
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
    </main>
  )
}
