// words/page.js
//
"use client"

import React, { useEffect, useState, useTransition, useRef } from "react"
import {
  getWords,
  createWord,
  updateWord,
  deleteWords,
  importCSV,
  translateWord,
} from "@/app/actions/words/wordActions"
import { getSections } from "@/app/actions/words/sectionActions"
import { getTopics } from "@/app/actions/words/topicActions"
import { useSession } from "next-auth/react"
import TableView from "@/app/components/tables/TableView"
import CustomDialog from "@/app/components/dialogs/CustomDialog"
import { useAuth } from "@/app/context/AuthContext" //Чи вхід з додатку
import { incrementWordDownloads } from "@/app/actions/statsActions"
import ImportTextModal from "@/app/components/modals/ImportTextModal"

// ExpandableField який рендерить textarea + кнопку ⛶ що відкриває ViewModal в режимі редагування.
function ExpandableField({ id, label, value, onChange, placeholder, required }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <label htmlFor={id} className="block font-medium mb-1">
        {label}
      </label>
      <div className="flex gap-1 items-start">
        <textarea
          id={id}
          rows={2}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="border p-2 rounded flex-1 resize-none text-sm"
        />
        <button
          type="button"
          onClick={() => setExpanded(true)}
          title="Розгорнути"
          className="text-lg px-2 py-1 border rounded hover:bg-gray-100"
        >
          ⛶
        </button>
      </div>

      {/* Велике модальне вікно редагування */}
      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
          onClick={() => setExpanded(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "860px",
              height: "85vh",
              background: "white",
              borderRadius: "16px 16px 0 0",
              boxShadow: "0 -4px 32px rgba(0,0,0,0.18)",
              display: "flex",
              flexDirection: "column",
              padding: "16px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
                flexShrink: 0,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 16 }}>{label}</span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                style={{
                  fontSize: 22,
                  lineHeight: 1,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#888",
                }}
              >
                ✕
              </button>
            </div>
            <textarea
              autoFocus
              rows={10}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              style={{
                flex: 1,
                width: "100%",
                resize: "none",
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
                fontSize: 15,
                lineHeight: 1.6,
                outline: "none",
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 min-w-[320px] max-h-[90vh] overflow-y-auto relative shadow-xl">
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
  const [section_id, setSectionId] = useState("")
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
  const [importTextOpen, setImportTextOpen] = useState(false)

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
    setSectionId("")
    setWord("")
    setTranslation("")
    setTopicId("")
    setPn("0")
    setKnow(false)
    setImg("")
    setModal({ type: "add" })
    setMessage("")
  }

  const openEditModal = (w) => {
    setId(w.id)
    // Знаходимо section_id з topic
    const topic = topics.find((t) => t.id === w.topic_id)
    setSectionId(topic?.section_id?.toString() || "")
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
    setSectionId("")
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
    if (!section_id) return setMessage("Оберіть секцію")
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

  // Кнопка завантаження тем в додаток
  const handleThemeDownload = async (selectedWords) => {
    // alert("window.ReactNativeWebView = " + (window.ReactNativeWebView ? "YES" : "NO"))//Для перевірки
    //   alert("isFromApp=" + isFromApp + " window.ReactNativeWebView=" + !!window.ReactNativeWebView)
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
      if (isFromApp && typeof window !== "undefined" && window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: "rwords-export", payload }))

        // ✅ Оновлюємо статистику після успішної відправки
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
  //       const selectedWordIds = new Set(selectedWords.map((w) => w.id))
  //       payload.words = payload.words.filter((w) => selectedWordIds.has(w.id))

  //       // --- мінімальне доповнення ---
  //       const sendMessageToApp = () => {
  //         if (window?.ReactNativeWebView?.postMessage) {
  //           window.ReactNativeWebView.postMessage(JSON.stringify({ type: "rwords-export", payload }))
  //           setMessage(`Відправлено у додаток: тем ${payload.topics.length}, слів ${payload.words.length}.`)
  //         } else {
  //           // якщо WebView ще не готовий, повторюємо через 200мс
  //           setTimeout(sendMessageToApp, 200)
  //         }
  //       }

  //       if (isFromApp) {
  //         sendMessageToApp()
  //         return
  //       }

  //       setMessage("Завантаження JSON можливе лише у додатку.")
  //     } catch (err) {
  //       console.error(err)
  //       setMessage("Помилка експорту: " + (err?.message || "невідома"))
  //     }
  //   }

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
        `У виборі є ${othersCount} чужих слів. Видалити лише ваші (${ownIds.length})? Натисніть OK, щоб видалити свої, або Відмінити.`,
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
        onImportText={() => setImportTextOpen(true)}
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
          <ExpandableField id="word" label="Слово" value={word} onChange={setWord} placeholder="Слово" required />
          <ExpandableField
            id="translation"
            label="Переклад"
            value={translation}
            onChange={setTranslation}
            placeholder="Переклад"
          />
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
            <label htmlFor="section_id" className="block font-medium mb-1">
              Секція
            </label>
            <select
              id="section_id"
              value={section_id}
              onChange={(e) => {
                setSectionId(e.target.value)
                setTopicId("") // Скидаємо топік при зміні секції
              }}
              className="border p-2 rounded"
              required
            >
              <option value="">Оберіть секцію</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="topic_id" className="block font-medium mb-1">
              Тема
            </label>
            <select
              id="topic_id"
              value={topic_id}
              onChange={(e) => setTopicId(e.target.value)}
              className="border p-2 rounded"
              required
              disabled={!section_id}
            >
              <option value="">Оберіть топік</option>
              {section_id &&
                topics
                  .filter((t) => t.section_id?.toString() === section_id)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
            </select>
          </div>
          <ExpandableField id="img" label="URL зображення" value={img} onChange={setImg} placeholder="URL зображення" />
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
      <ImportTextModal
        open={importTextOpen}
        onClose={() => setImportTextOpen(false)}
        sections={sections}
        userId={user?.id}
        onSuccess={() => {
          loadWords()
          loadTopics()
          loadSections()
        }}
      />
    </main>
  )
}
