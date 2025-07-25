// components/TableView.js
// Моя переробка з words/page.js

import React, { useEffect, useState, useTransition, useRef } from "react"
// import { useAuth } from "@/app/context/AuthContext"
import { useSession } from "next-auth/react"
import MoveRowModal from "@/app/components/tables/MoveRowModal"

export default function TableView({
  data,
  dataLevel1,
  dataLevel2,
  level1Head = "Тема",
  level2Head = "Секція",
  columns,
  title,
  onAdd,
  onEdit,
  onDelete,
  onClickCsv,
  onTranslate,
  translate,

  sortField = "pn",
  isPending, //ДЛя блокування кнопки імпорт покийде імпорт
}) {
  // prors
  const showOwnerMark = true

//   const { user } = useAuth()
   const { data: session, status } = useSession()
   const user = session?.user
  const [tData, setTData] = useState([])
  const [topics, setTopics] = useState([])
  const [sections, setSections] = useState([])
  const [pn, setPn] = useState("")
  const [message, setMessage] = useState("")
  const [isOrderChanged, setIsOrderChanged] = useState(false) //Для порередження про зміну порядку
  const [selectedIds, setSelectedIds] = useState([]) //
  //   Для модалки стрілок переміщення рядків
  const [moveMode, setMoveMode] = useState(false)
  const [moveInfo, setMoveInfo] = useState(null) // { idx, total }
  const tableContainerRef = useRef(null) //Для скролу при переміщенні****
  const rowRefs = useRef([]) //Для скролу при переміщенні
  //   Для розкриття груп(секцій)
  const [openSections, setOpenSections] = useState([])
  const [openTopics, setOpenTopics] = useState(topics.map((t) => t.id)) // за замовчуванням всі відкриті
  //   console.log("TableView/data=", data)
  //   console.log("TableView/dataLevel1=", dataLevel1)
  //   console.log("TableView/dataLevel2=", dataLevel2)

  useEffect(() => {
    setTData(data || [])
    setTopics(dataLevel1 || [])
    setSections(dataLevel2 || [])
    setOpenTopics((dataLevel1 || []).map((t) => t.id))
  }, [data, dataLevel2, dataLevel1])

  //   console.log("TableView/tData=", tData)
  //   console.log("TableView/topics=", topics)
  //   console.log("TableView/sections=", sections)

  //GPT/ Кнопки переміщення рядків

  const saveOrder = async () => {
    if (!user) return

    if (user.role !== "admin") {
      alert("Зберігати порядок усіх слів може лише адміністратор.")
      return
    }

    try {
      for (let i = 0; i < tData.length; i++) {
        const w = tData[i]
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
    setTData(newWords)
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

  const deleteSelected = async () => {
    if (!user) {
      alert("Потрібна авторизація, щоб видаляти слова")
      return
    }
    if (selectedIds.length === 0) return
    // Знаходимо слова за id
    const selectedWords = tData.filter((w) => selectedIds.includes(w.id))

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
    setSelectedIds(tData.map((w) => w.id))
  }

  const clearSelection = () => {
    setSelectedIds([])
  }
  //   Для модалки стрілок переміщення рядків
  const startMoveMode = () => {
    if (selectedIds.length !== 1) return

    const id = selectedIds[0]
    const idx = tData.findIndex((w) => w.id === id)
    if (idx === -1) return

    setMoveInfo({ idx, total: tData.length })
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

  // Функція для переміщення рядка в масиві tData в стані:
  const moveSelectedRow = (direction) => {
    if (!moveInfo) return

    const { idx } = moveInfo
    const topicId = tData[idx].topic_id

    // Знаходимо всі елементи цього topic
    const topicWords = tData.filter((w) => w.topic_id === topicId)
    const topicIndexes = topicWords.map((w) => tData.findIndex((x) => x.id === w.id))
    const localIdx = topicIndexes.indexOf(idx)

    let newIdx = idx

    // Переміщення в межах групи
    if (direction === "up" && localIdx > 0) {
      newIdx = topicIndexes[localIdx - 1]
    } else if (direction === "down" && localIdx < topicIndexes.length - 1) {
      newIdx = topicIndexes[localIdx + 1]
    }

    if (newIdx === idx) return // нічого не змінилось

    // Створюємо копію масиву та міняємо місцями
    let updatedWords = [...tData]
    ;[updatedWords[idx], updatedWords[newIdx]] = [updatedWords[newIdx], updatedWords[idx]]

    // Оновлюємо pn
    const newWordsWithPN = updatedWords.map((w, i) => ({ ...w, pn: i + 1 }))

    setTData(newWordsWithPN)
    setIsOrderChanged(true)

    // Найбезпечніше: оновлюємо лише idx, інші поля залишаються
    setMoveInfo((prev) => ({ ...prev, idx: newIdx }))

    // Скролимо до нового рядка
    if (rowRefs.current[newIdx]) {
      rowRefs.current[newIdx].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }

  //   Для розкриття груп
  const toggleSection = (sectionId) => {
    setOpenSections((prev) => (prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]))
  }
  //   Для розкриття груп
  const toggleTopic = (topicId) => {
    setOpenTopics((prev) => (prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]))
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      {/* <h1 className="text-2xl font-bold mb-6">Слова TW</h1> */}
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      <div className="flex flex-wrap gap-2 items-center mb-4">
        {/* ДОДАТИ, ПЕРЕКЛАСТИ, ІМПОРТУВАТИ – завжди */}
        {user && selectedIds.length === 0 && (
          <>
            {onAdd && (
              <button onClick={onAdd} className="bg-blue-600 text-white px-4 py-2 rounded">
                ➕ Додати слово
              </button>
            )}
            {onClickCsv && (
              <button onClick={onClickCsv} className="bg-purple-600 text-white px-4 py-2 rounded" disabled={isPending}>
                📂 Імпортувати CSV
              </button>
            )}
            {onTranslate && (
              <button
                onClick={onTranslate}
                className={`px-4 py-2 rounded text-white ${translate ? "bg-red-600" : "bg-indigo-600"}`}
              >
                {translate ? "⏸ Зупинити переклад" : "▶️ Старт перекладу"}
              </button>
            )}
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
            const selectedWord = tData.find((w) => w.id === selectedIds[0])
            const isOwner = user && selectedWord && selectedWord.user_id === user.id

            return (
              <>
                {isOwner && (
                  <>
                    {onEdit && (
                      <button onClick={() => onEdit(selectedWord)} className="bg-blue-600 text-white px-4 py-2 rounded">
                        ✏️ Редагувати
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(selectedWord)}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                      >
                        🗑️ Видалити
                      </button>
                    )}
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
      {/* Діалог вибору файлу для csv */}
      {message && (
        <p className="mb-4 text-green-700 font-medium" role="alert">
          {message}
        </p>
      )}
      {/* перший рядок над таблицею */}
      <div className="flex gap-2 items-center">
        <span className="text-gray-700">📄Всього зап: {tData.length} </span>

        <button
          onClick={() => (selectedIds.length === tData.length ? clearSelection() : selectAll())}
          className="text-sm px-2 py-1 rounded border"
        >
          {selectedIds.length === tData.length ? "☑ Зняти всі" : "☐ Виділити всі"}
          {/* {selectedIds.length === tData.length ? "☑" : "☐"} */}
        </button>
        {selectedIds.length > 0 && <span className="text-blue-700">Виділено: {selectedIds.length}</span>}
      </div>
      {/*  */}
      <div ref={tableContainerRef} className="max-h-[500px] overflow-auto border border-gray-300 rounded shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {showOwnerMark && <th style={{ width: 30, border: "1px solid #ccc", padding: "4px" }}>👤</th>}
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  style={{
                    width: col.width,
                    border: "1px solid #ccc",
                    padding: "4px",
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => {
              const sectionTopics = topics.filter((t) => t.section_id === section.id)
              const sectionWords = tData.filter((w) => sectionTopics.some((t) => t.id === w.topic_id))
              if (sectionWords.length === 0) return null

              return (
                <React.Fragment key={section.id}>
                  <tr
                    onClick={() => toggleSection(section.id)}
                    className="bg-gray-300 cursor-pointer hover:bg-gray-400"
                  >
                    <td colSpan={showOwnerMark ? columns.length + 1 : columns.length} className="p-2 font-bold">
                      {level2Head}
                      {": "}
                      {section.name} ({sectionWords.length}){openSections.includes(section.id) ? " 🔽" : " ▶️"}
                    </td>
                  </tr>

                  {openSections.includes(section.id) &&
                    sectionTopics.map((topic) => {
                      const topicWords = tData.filter((w) => w.topic_id === topic.id)
                      if (topicWords.length === 0) return null

                      return (
                        <React.Fragment key={topic.id}>
                          <tr
                            onClick={() => toggleTopic(topic.id)}
                            className="bg-gray-200 cursor-pointer hover:bg-gray-300"
                          >
                            <td
                              colSpan={showOwnerMark ? columns.length + 1 : columns.length}
                              className="p-2 font-semibold"
                            >
                              ⮞ {level1Head}
                              {": "}
                              {topic.name} {topicWords.length}
                              {openTopics.includes(topic.id) ? " 🔽" : " ▶️"}
                            </td>
                          </tr>

                          {openTopics.includes(topic.id) &&
                            topicWords.map((item, index) => (
                              <tr
                                key={item.id}
                                ref={(el) => (rowRefs.current[index] = el)}
                                onClick={() => toggleSelect(item.id)}
                                className={`cursor-pointer ${isSelected(item.id) ? "bg-blue-100" : "hover:bg-gray-50"}`}
                              >
                                {showOwnerMark && (
                                  <td
                                    style={{
                                      width: 30,
                                      border: "1px solid #ccc",
                                      padding: "4px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {item.user_id === user?.id && "🧑‍💻"}
                                  </td>
                                )}
                                {columns.map((col) => {
                                  const value = item[col.accessor]
                                  let content

                                  switch (col.type) {
                                    case "know":
                                      content = value ? "👍" : ""
                                      break
                                    case "boolean":
                                      content = value ? "✔" : ""
                                      break
                                    case "integer":
                                      content = value != null ? Math.floor(Number(value)) : "-"
                                      break
                                    default:
                                      content = value ?? ""
                                  }
                                  return (
                                    <td
                                      key={col.accessor}
                                      //   style={{
                                      //     width: col.width,
                                      //     border: "1px solid #ccc",
                                      //     padding: "4px",
                                      //     ...(col.styleCell || {}),
                                      //   }}
                                      style={{
                                        ...{
                                          width: col.width,
                                          border: "1px solid #ccc",
                                          padding: "4px",
                                        },
                                        ...(col.styleCell || {}),
                                      }}
                                    >
                                      <span style={col.styleCellText}>{content}</span>
                                    </td>
                                  )
                                })}
                              </tr>
                            ))}
                        </React.Fragment>
                      )
                    })}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      <MoveRowModal
        open={moveMode}
        onClose={() => setMoveMode(false)}
        moveInfo={moveInfo}
        moveSelectedRow={moveSelectedRow}
      />
    </main>
  )
}
