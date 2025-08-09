// words/page_tw.jsx
//
"use client"

import React, { useEffect, useState, useTransition, useRef } from "react"
import {
  getWords,
  createWord,
  updateWord,
//   deleteWord,
  deleteWords,
//   updateWordPn,
  importCSV,
  translateWord,
} from "@/app/actions/wordActions"
import { getSections } from "@/app/actions/sectionActions"
import { getTopics } from "@/app/actions/topicActions"
// import { useAuth } from "@/app/context/AuthContext"
import { useSession } from "next-auth/react"
import MoveRowModal from "@/app/components/tables/MoveRowModal"
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

//Для TableView
const columns = [
  {
    label: "№п",
    accessor: "pn",
    type: "integer",
    width: 50,
    styleCell: { alignItems: "center" },
    //   styleCellText: {color: 'green'},
    markIfOwner: true, // 🚀 нове поле
  },
  {
    label: "Зн",
    accessor: "know",
    type: "boolean",
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

export default function WordsPage() {
  // prors
  const showOwnerMark = true

  //   const { user } = useAuth()
  const { data: session, status } = useSession()
  const user = session?.user
  const [words, setWords] = useState([])
  const [topics, setTopics] = useState([])
  const [sections, setSections] = useState([])
  const [modal, setModal] = useState(null) // null | {type, word}
  const [id, setId] = useState(null)
  const [word, setWord] = useState("")
  const [translation, setTranslation] = useState("")
  const [topic_id, setTopicId] = useState("")
  const [pn, setPn] = useState("")
  const [know, setKnow] = useState(false)
  const [img, setImg] = useState("")
  const [message, setMessage] = useState("")
  // startTransition	Виконати важкі або менш критичні зміни стану без блокування UI
  const [isPending, startTransition] = useTransition() // isPending	Показати loader / disabled//
  //   const [isOrderChanged, setIsOrderChanged] = useState(false) //Для порередження про зміну порядку
  // Стани для перекладу (useState та useRef)
  const [translate, setTranslate] = useState(false)
  const [translatedCount, setTranslatedCount] = useState(0)
  const [totalWords, setTotalWords] = useState(0)
  const stopRequested = useRef(false)
  const translatedCountRef = useRef(0)
  //   const [selectedIds, setSelectedIds] = useState([]) //
    const [actionsOk, setActionsOk] = useState(false) //Для успішноговиконання акцій(delete)
  //   Для модалки стрілок переміщення рядків
  //   const [moveMode, setMoveMode] = useState(false)
  //   const [moveInfo, setMoveInfo] = useState(null) // { idx, total }
  //   const rowRefs = useRef([]) //Для скролу при переміщенні
  //   Для рогкриття груп(секцій)
  //   const [openSections, setOpenSections] = useState([])
  //   const [openTopics, setOpenTopics] = useState(topics.map((t) => t.id)) // за замовчуванням всі відкриті

  //  Вхідні змінні які мають передаватись в майбутній TableView
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
    console.log("words/openAddModal")
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
    if (!word.trim()) return setMessage("Заповніть слово ")
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
          //   await updateWord(id, data, user)
          await updateWord(id, data, user?.id, user?.role)
          setMessage("Слово оновлено")
        } else {
          await createWord(data, user?.id)
          setMessage("Слово створено")
        }
        closeModal()
        loadWords()
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  const handleDelete = (words) => {
    // console.log("words/handleDelete/words=", words)

    if (!confirm(`Ви впевнені, що хочете видалити ${words.length} слів?`)) return

    startTransition(async () => {
      try {
        await deleteSelected(words) // ✅ вже масив
        setMessage(`🗑️ Видалено ${words.length} слів`)
        loadWords()
      } catch (err) {
        console.error(err)
        setMessage("Помилка: " + err.message)
      }
    })
  }

  const updatePNs = (updatedWords) => {
    const newWords = updatedWords.map((w, i) => ({
      ...w,
      pn: i + 1, // оновлюємо pn
    }))
    setWords(newWords)
    setIsOrderChanged(true) // ⚠️ встановлюємо прапорець змін
  }

  //   const isOwnerOrAdmin = (w) => user && (user.role === "admin" || user.id === w.user_id)

  //Для попередження про зміни при виході або призакритті вкладки
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
    console.log("words/handleFileUpload")
    const file = event.target.files[0]
    if (!file) return
    console.log("words/handleFileUpload/")
    setMessage("Початок імпорту...")
    startTransition(async () => {
      try {
        const text = await file.text()
        // Виклик серверної action-функції importCSV, яку треба імпортувати
        // const result = await importCSV(text, user?.id, user?.role)
        const result = await importCSV(text, user?.id)
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

  //   const deleteSelected = async () => {
  const deleteSelected = async (selectedWords) => {
    // console.log("words/deleteSelected0/selectedWords=", selectedWords)
    console.log("words/deleteSelected0/selectedWords=", JSON.stringify(selectedWords, null, 2))
    if (!user) {
      alert("Потрібна авторизація, щоб видаляти слова")
      return
    }
    console.log("words/deleteSelected1")

    // Визначаємо, які слова належать користувачу
    const ownWords = selectedWords.filter((w) => user.role === "admin" || w.user_id === user.id)
    const ownIds = ownWords.map((w) => w.id)
    const othersCount = selectedWords.length - ownWords.length
    console.log("words/deleteSelected2")
    if (ownIds.length === 0) {
      // Нема своїх слів для видалення
      alert("Усі вибрані записи належать іншим користувачам. Видаляти нічого.")
      return
    }
    console.log("words/deleteSelected2")

    if (othersCount > 0) {
      const confirmed = confirm(
        `У виборі є ${othersCount} чужих слів. Видалити лише ваші (${ownIds.length})? Натисніть OK, щоб видалити свої, або Відмінити.`
      )
      if (!confirmed) return
    } else {
      const confirmed = confirm(`Видалити ${ownIds.length} слів?`)
      if (!confirmed) return
    }
    console.log("words/deleteSelected2")
    try {
      console.log("words/deleteSelected3/deleteWords")
      await deleteWords(ownIds, user?.id, user?.role)
      setMessage(`🗑️ Видалено ${ownIds.length} слів`)
    //   clearSelection()
      setActionsOk(true)
      loadWords()
    } catch (err) {
      setMessage("Помилка при видаленні: " + err.message)
    }
  }

//   const clearSelection = () => {
//     setSelectedIds([])
//   }

  // Функція для переміщення рядка в масиві words в стані:
  //   const moveSelectedRow = (direction) => {
  //     if (!moveInfo) return

  //     const { idx } = moveInfo
  //     const topicId = words[idx].topic_id

  //     // Знаходимо всі елементи цього topic
  //     const topicWords = words.filter((w) => w.topic_id === topicId)
  //     const topicIndexes = topicWords.map((w) => words.findIndex((x) => x.id === w.id))
  //     const localIdx = topicIndexes.indexOf(idx)

  //     let newIdx = idx

  //     // Переміщення в межах групи
  //     if (direction === "up" && localIdx > 0) {
  //       newIdx = topicIndexes[localIdx - 1]
  //     } else if (direction === "down" && localIdx < topicIndexes.length - 1) {
  //       newIdx = topicIndexes[localIdx + 1]
  //     }

  //     if (newIdx === idx) return // нічого не змінилось

  //     // Створюємо копію масиву та міняємо місцями
  //     let updatedWords = [...words]
  //     ;[updatedWords[idx], updatedWords[newIdx]] = [updatedWords[newIdx], updatedWords[idx]]

  //     // Оновлюємо pn
  //     const newWordsWithPN = updatedWords.map((w, i) => ({ ...w, pn: i + 1 }))

  //     setWords(newWordsWithPN)
  //     setIsOrderChanged(true)

  //     // Найбезпечніше: оновлюємо лише idx, інші поля залишаються
  //     setMoveInfo((prev) => ({ ...prev, idx: newIdx }))

  //     // Скролимо до нового рядка
  //     if (rowRefs.current[newIdx]) {
  //       rowRefs.current[newIdx].scrollIntoView({
  //         behavior: "smooth",
  //         block: "nearest",
  //       })
  //     }
  //   }

  return (
    <main className="p-1 max-w-4xl mx-auto">
      {/* {topics.length > 0 && sections.length > 0 && ( */}
      <TableView
        data={words}
        dataLevel1={topics}
        dataLevel2={sections}
        level1Id="topic_id"
        level2Id="section_id"
        columns={columns}
        title={"Слова"}
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={handleDelete} // передаємо лише id
        onClickCsv={() => document.getElementById("csvInput").click()}
        onTranslate={handleTranslate}
        translate={translate} //Чи перекладено для зміни кнопки
        level0Head="Слова"
        level1Head="Тема"
        level2Head="Група тем"
        sortField={"pn"} //поле для порядку
        isPending={isPending} //ДЛя блокування кнопки імпорт покийде імпорт
        message={message} //Для повідомлення
        setMessage={setMessage} //Для повідомлення
        actionsOk={actionsOk} //
        setActionsOk={setActionsOk}
      />
      {/* )} */}
      <input type="file" id="csvInput" accept=".csv,text/csv" style={{ display: "none" }} onChange={handleFileUpload} />
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
              //   required
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
      {/* <MoveRowModal
        open={moveMode}
        onClose={() => setMoveMode(false)}
        moveInfo={moveInfo}
        moveSelectedRow={moveSelectedRow}
      /> */}
    </main>
  )
}
