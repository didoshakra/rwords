// words/page.js
//
"use client"

import React, { useEffect, useState, useTransition, useRef } from "react"
import { getWords, createWord, updateWord, deleteWords, importCSV, translateWord } from "@/app/actions/wordActions"
import { getSections } from "@/app/actions/sectionActions"
import { getTopics } from "@/app/actions/topicActions"
import { useSession } from "next-auth/react"
import TableView from "@/app/components/tables/TableView"
import CustomDialog from "@/app/components/dialogs/CustomDialog"
import { useAuth } from "@/app/context/AuthContext" //Чи вхід з додатку
import { incrementWordDownloads } from "@/app/actions/statsActions"

function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex ite             ms-center justify-center bg-black/50">
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
//   {
//     label: "№п",
//     accessor: "pn",
//     type: "integer",
//     width: 50,
//     styleCell: { alignItems: "center" },
//     markIfOwner: true, // 🚀 нове поле
//   },
//   {
//     label: "Зн",
//     accessor: "know",
//     type: "boolean",
//     type: "know",
//     width: 50,
//     styleCell: { alignItems: "center" },
//     styleCellText: { color: "red" },
//   },
  {
    label: "Слова",
    accessor: "word",
    type: "text",
    width: 250,
    // styleCellText: { fontWeight: 600 },
  },
  { label: "Переклад", accessor: "translation", type: "text", width: 250 },

//   { label: "Тема", accessor: "topic_name", type: "text", width: 250 },
//   { label: "Секція", accessor: "section_name", type: "text", width: 250 },

//   { label: "Файл img", accessor: "img", type: "text", width: 150 },
//   {
//     label: "№s",
//     accessor: "section_pn",
//     type: "integer",
//     width: 50,
//     styleCell: { alignItems: "center" },
//   },
//   {
//     label: "№t",
//     accessor: "topic_pn",
//     type: "integer",
//     width: 50,
//     styleCell: { alignItems: "center" },
//   },

//   {
//     label: "id",
//     accessor: "id",
//     type: "integer",
//     width: 60,
//     styleCell: { alignItems: "center" },
//     //   styleCellText: {color: 'green'},
//   },
//   {
//     label: "Tid",
//     accessor: "topic_id",
//     type: "integer",
//     width: 40,
//     styleCell: { alignItems: "center" },
//   },
]

export default function WordsPage() {
  // prors
  const { isFromApp } = useAuth() //Чи вхід з додатку
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
  const [isPending, startTransition] = useTransition() // isPending	Показати loader / disabled//
  // Стани для перекладу (useState та useRef)
  const [translate, setTranslate] = useState(false)
  const stopRequested = useRef(false)
  const translatedCountRef = useRef(0)
  const [actionsOk, setActionsOk] = useState(false) //Для успішноговиконання акцій(delete)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogConfig, setDialogConfig] = useState({})
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
    setDialogConfig({
      type: "delete",
      title: "Підтвердження видалення",
      message: `Ви впевнені, що хочете видалити ${words.length} слів?`,
      buttons: [
        { label: "Видалити", className: "bg-red-600 text-white" },
        { label: "Відмінити", className: "bg-gray-200" },
      ],
      wordsToDelete: words, // додатково, якщо треба передати дані
    })
    setDialogOpen(true)
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
        loadTopics()
        loadSections()
      } catch (error) {
        setMessage(error.message || "Помилка імпорту")
      }
      // Очищуємо input, щоб можна було знову завантажити той самий файл, якщо треба
      event.target.value = null
    })
  }

  const startTranslation = async (wordsToTranslate) => {
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
        translatedCountRef.current++
        setMessage(`Перекладено ${translatedCountRef.current} з ${wordsToTranslate.length}`)
      } catch (err) {
        console.error("❌ Помилка перекладу:", word, err)
        setMessage(`Помилка перекладу слова "${word}" (${translatedCountRef.current} з ${wordsToTranslate.length})`)
      }

      await new Promise((res) => setTimeout(res, 400)) // пауза
    }

    alert(`✅ Переклад завершено: ${translatedCountRef.current} із ${wordsToTranslate.length}`)
    setTranslate(false)
    setMessage(`✅ Переклад завершено: ${translatedCountRef.current} із ${wordsToTranslate.length}`)
    loadWords?.()
  }

  //   const translateSelectedWords = async (selectedWords) => {

  // Одна універсальна функція для перекладу
  const translateWords = async (words) => {
    // Якщо натиснули "Зупинити переклад"
    if (words === "stop") {
      stopRequested.current = true
      setTranslate(false)
      return
    }

    // Перевірка, що words — масив
    if (!Array.isArray(words)) {
      setTranslate(false)
      alert("⚠️ Не вибрано жодного слова.")
      return
    }

    stopRequested.current = false
    translatedCountRef.current = 0

    if (words.length === 0) {
      setTranslate(false)
      alert("⚠️ Не вибрано жодного слова.")
      return
    }

    const untranslatedWords = words.filter((w) => !w.translation?.trim())

    if (untranslatedWords.length === 0) {
      setDialogConfig({
        type: "translate",
        title: "Усі слова вже перекладено",
        message: "Усі вибрані слова вже мають переклад. Перекласти ще раз?",
        buttons: [{ label: "Перекласти всі" }, { label: "Відмінити" }],
        allWords: words,
        untranslatedWords: [],
      })
      setDialogOpen(true)
      setTranslate(false)
      return
    }

    if (untranslatedWords.length < words.length) {
      setDialogConfig({
        type: "translate",
        title: "Що перекладати?",
        message: "Деякі слова вже перекладено. Оберіть дію:",
        buttons: [{ label: "Перекласти всі" }, { label: "Лише неперекладені" }, { label: "Відмінити" }],
        allWords: words,
        untranslatedWords,
      })
      setDialogOpen(true)
      setTranslate(false)
      return
    }

    setTranslate(true)
    startTranslation(untranslatedWords)
  }

  //   -------------------------------------------

//   // Кнопка завантаження тем
//   const handleThemeDownload = async (selectedWords) => {
//     if (!selectedWords || !selectedWords.length) {
//       setMessage("Нічого не вибрано (потрібно відмітити слова).")
//       return
//     }

//     const topicIds = [...new Set(selectedWords.map((w) => w.topic_id))]
//     if (!topicIds.length) {
//       setMessage("Нічого не вибрано для завантаження.")
//       return
//     }

//     setMessage("Завантаження...")

//     try {
//       const res = await fetch(`/api/export?ids=${topicIds.join(",")}`, { cache: "no-store" })
//       if (!res.ok) throw new Error(await res.text())

//       const payload = await res.json()

//       // Фільтруємо слова по відмічених id
//       const selectedWordIds = new Set(selectedWords.map((w) => w.id))
//       payload.words = payload.words.filter((w) => selectedWordIds.has(w.id))

//       // Відправка у додаток лише якщо ми дійсно в RN WebView
//       if (isFromApp && typeof window !== "undefined" && window.ReactNativeWebView) {
//         window.ReactNativeWebView.postMessage(JSON.stringify({ type: "rwords-export", payload }))
//         setMessage(`Відправлено у додаток: тем ${payload.topics.length}, слів ${payload.words.length}.`)
//         return
//       }

//       // Якщо не у додатку — пропускаємо JSON (не робимо імпорт у браузері)
//       setMessage("Завантаження JSON можливе лише у додатку.")
//     } catch (err) {
//       console.error(err)
//       setMessage("Помилка експорту: " + (err?.message || "невідома"))
//     }
//   }


const handleThemeDownload = async (selectedWords) => {
  if (!selectedWords || !selectedWords.length) {
    setMessage("Нічого не вибрано (потрібно відмітити слова).")
    return
  }

  const topicIds = [...new Set(selectedWords.map((w) => w.topic_id))]
  if (!topicIds.length) {
    setMessage("Нічого не вибрано для завантаження.")
    return
  }

  setMessage("Завантаження...")

  try {
    const res = await fetch(`/api/export?ids=${topicIds.join(",")}`, { cache: "no-store" })
    if (!res.ok) throw new Error(await res.text())

    const payload = await res.json()

    // Фільтруємо слова по відмічених id
    const selectedWordIds = new Set(selectedWords.map((w) => w.id))
    payload.words = payload.words.filter((w) => selectedWordIds.has(w.id))

    // Відправка у додаток лише якщо ми дійсно в RN WebView

    // if (isFromApp && typeof window !== "undefined" && window.ReactNativeWebView) {
    if (isFromApp) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "rwords-export", payload }))

      // ✅ Оновлюємо статистику завантажень слів
      try {
        await incrementWordDownloads(session?.user?.id)
      } catch (err) {
        console.error("Не вдалося оновити статистику:", err)
      }

      setMessage(`Відправлено у додаток: тем ${payload.topics.length}, слів ${payload.words.length}.`)
      return
    }

    // Якщо не у додатку — пропускаємо JSON (не робимо імпорт у браузері)
    setMessage("Завантаження JSON можливе лише у додатку.")
  } catch (err) {
    console.error(err)
    setMessage("Помилка експорту: " + (err?.message || "невідома"))
  }
}


  //функція для видалення вибраних слів
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

  //функція для обробки результату діалогу
  const handleDialogResult = (index) => {
    setDialogOpen(false)
    if (dialogConfig.type === "translate") {
      if (dialogConfig.untranslatedWords.length === 0) {
        // Всі слова вже перекладено
        if (index === 0) {
          setTranslate(true)
          stopRequested.current = false
          startTranslation(dialogConfig.allWords)
        } else {
          // index === 1 — Відмінити
          setTranslate(false)
          stopRequested.current = true
        }
      } else {
        // Є неперекладені
        if (index === 0) {
          setTranslate(true)
          stopRequested.current = false
          startTranslation(dialogConfig.allWords)
        } else if (index === 1) {
          setTranslate(true)
          stopRequested.current = false
          startTranslation(dialogConfig.untranslatedWords)
        } else {
          // index === 2 — Відмінити
          setTranslate(false)
          stopRequested.current = true
        }
      }
    } else if (dialogConfig.type === "delete") {
      if (index === 0) {
        // Видалити
        startTransition(async () => {
          try {
            await deleteSelected(dialogConfig.wordsToDelete)
            setMessage(`🗑️ Видалено ${dialogConfig.wordsToDelete.length} слів`)
            loadWords()
          } catch (err) {
            setMessage("Помилка: " + err.message)
          }
        })
      }
      // index === 1 — Відмінити
    }
    // Додавай інші типи діалогів за потреби
  }
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
        onTranslate={translateWords}
        onThemeDownload={isFromApp ? handleThemeDownload : undefined}
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
      <CustomDialog
        open={dialogOpen}
        title={dialogConfig.title}
        message={dialogConfig.message}
        buttons={dialogConfig.buttons}
        onResult={handleDialogResult}
        onClose={() => setDialogOpen(false)}
      />
    </main>
  )
}
