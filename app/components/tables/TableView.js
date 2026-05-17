// components/TableView.js
// Оптимізовано
// Працює для всіх рівнів

import React, { useEffect, useState, useTransition, useRef } from "react"
// import { useAuth } from "@/app/context/AuthContext"
import { useSession } from "next-auth/react"
import MoveRowModal from "@/app/components/tables/MoveRowModal"

// Додати хук useLongPress для мобілки(перед компонентом TableView):
function useLongPress(callback, ms = 500) {
  const timerRef = useRef(null)

  const start = (e) => {
    // Не спрацьовувати якщо це скрол
    timerRef.current = setTimeout(() => {
      callback(e)
    }, ms)
  }

  const clear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchMove: clear, // скасувати якщо почався скрол
    onTouchCancel: clear,
  }
}

export default function TableView({
  data,
  dataLevel1,
  dataLevel2,
  level1Id,
  level2Id,
  //   level0Head = "Слова",
  level1Head = "Тема",
  level2Head = "Автор",
  columns,
  title,
  onAdd,
  onEdit,
  onDelete,
  onClickCsv,
  onTranslate,
  onThemeDownload,
  //   onTranslateSelected,
  translate,
  //   sortField = "pn",
  isPending, //ДЛя блокування кнопки імпорт покийде імпорт
  message, //Для повідомлення
  setMessage,
  actionsOk, //Успіх акцій (delete)
  setActionsOk, //Успіх акцій (delete)
}) {
  // prors
  const showOwnerMark = true
  //   const { user } = useAuth()
  const { data: session, status } = useSession()
  const user = session?.user
  //
  const [tData, setTData] = useState(data || [])
  const [level1, setLevel1] = useState(dataLevel1 || [])
  const [level2, setLevel2] = useState(dataLevel2 || [])
  //   const [pn, setPn] = useState("")
  const [isOrderChanged, setIsOrderChanged] = useState(false) //Для порередження про зміну порядку
  const [selectedIds, setSelectedIds] = useState([]) //
  const [selectedLevel1, setSelectedLevel1] = useState([])
  //   Для модалки стрілок переміщення рядків
  const [moveMode, setMoveMode] = useState(false)
  const [moveInfo, setMoveInfo] = useState(null) // { idx, total }
  const tableContainerRef = useRef(null) //Для скролу при переміщенні****
  const rowRefs = useRef([]) //Для скролу при переміщенні
  //   Для розкриття груп(секцій)
  const [openLevel2, setOpenLevel2] = useState([]) //   Для розкриття груп
  const [openLevel1, setOpenLevel1] = useState([]) //   Для розкриття груп // за замовчуванням всі відкриті
  const [viewModal, setViewModal] = useState(null) // { item, colAccessor }

  useEffect(() => {
    setTData(data || [])
    setLevel1(dataLevel1 || [])
    setLevel2(dataLevel2 || [])
    setOpenLevel1(dataLevel1?.map((item) => item.id) || []) // За замовчуванням всі теми розкриті
    setOpenLevel2(dataLevel2?.map((item) => item.id) || []) // За замовчуванням всі групи розкриті
  }, [data, dataLevel2, dataLevel1])

  useEffect(() => {
    if (actionsOk) {
      clearSelection() // прибрати всі відмітки
      setActionsOk(false) // готуємо до наступної події
    }
  }, [actionsOk])

  //   Коли ставиш message, запускай таймер, який через 3-4 секунди обнуляє його:
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000)
      return () => clearTimeout(timer) // очищає таймер при розмонтуванні або зміні message
    }
  }, [message])

  //   console.log("TableView/TData=========================================================")
  //   console.log("TableView/TData=", tData)
  //   console.log("TableView/level1=", level1)
  //   console.log("TableView/level2=", level2)
  //   console.log("TableView/openLevel1=", openLevel1)
  //   console.log("TableView/openLevel2=", openLevel2)
  //   console.log("TableView/level2Id=", level2Id)
  //   console.log("TableView/level1Id=", level1Id)
  if (level2?.length > 0) {
    // console.log("TableView/first level2 item:", level2[0])
    // console.log(
    //   "TableView/level1 filtered by level2[0].id:",
    //   level1?.filter((t) => t[level2Id] === level2[0].id)
    // )
  }

  const toggleSelectTopic = (id) => {
    setSelectedLevel1((prev) => {
      let selectedLevel1
      if (prev.includes(id)) {
        // Зняти вибір теми
        selectedLevel1 = prev.filter((x) => x !== id)
        // Зняти всі слова теми з selectedIds
        const topicWordIds = tData.filter((w) => w[level1Id] === id).map((w) => w.id)
        setSelectedIds((prevIds) => prevIds.filter((wid) => !topicWordIds.includes(wid)))
      } else {
        // Додати тему до вибраних
        selectedLevel1 = [...prev, id]
        // Додати всі слова теми до selectedIds (уникнути дублювань)
        const topicWordIds = tData.filter((w) => w[level1Id] === id).map((w) => w.id)
        setSelectedIds((prevIds) => {
          const newIds = [...prevIds]
          for (const tid of topicWordIds) {
            if (!newIds.includes(tid)) newIds.push(tid)
          }
          return newIds
        })
      }
      return selectedLevel1
    })
  }

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

  //   const isOwnerOrAdmin = (w) => user && (user.role === "admin" || user.id === w.user_id)

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

  const isSelected = (id) => selectedIds.includes(id)

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const selectAll = () => {
    setSelectedIds(tData.map((w) => w.id))
    setSelectedLevel1(level1.map((w) => w.id))
  }

  const clearSelection = () => {
    setSelectedIds([])
    setSelectedLevel1([])
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
  const toggleLevel2 = (sectionId) => {
    setOpenLevel2((prev) => (prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]))
  }
  //   Для розкриття груп
  const toggleLevel1 = (topicId) => {
    setOpenLevel1((prev) => (prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]))
  }

  // Допоміжні функції
  //=== Нові функції для рендерингу рядків
  const renderTopic = (topic, topicWords) => {
    const topicWordIds = topicWords.map((w) => w.id)
    const selectedCount = topicWordIds.filter((id) => selectedIds.includes(id)).length

    let checkbox = "🔲"
    if (selectedCount === topicWords.length && selectedCount > 0) checkbox = `☑️`
    else if (selectedCount > 0) checkbox = `➖`
    if (topicWords.length < 1) checkbox = "  "

    return (
      <React.Fragment key={topic.id}>
        <tr
          onClick={() => toggleLevel1(topic.id)}
          className="bg-tabTr1Bg dark:bg-tabTr1BgD cursor-pointer hover:bg-tabTr1BgHov dark:hover:bg-tabTr1BgHovD"
        >
          <td colSpan={showOwnerMark ? columns.length + 2 : columns.length} className="p-2 font-semibold">
            <div
              className="flex text-tabTr1On dark:text-tabTr1OnD items-center gap-2"
              style={{ userSelect: "none", cursor: "pointer" }}
            >
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSelectTopic(topic.id)
                }}
              >
                {topicWords.length > 1 ? (
                  <>
                    {checkbox} [{selectedCount}]
                  </>
                ) : (
                  "  "
                )}
              </span>

              <span>
                {/* ({topicWords.length})⮞ {level1Head}: {topic.name} */}({topicWords.length}) {level1Head}:{" "}
                {topic.name}
              </span>
              <span>{topicWords.length > 0 ? (openLevel1.includes(topic.id) ? " 🔽" : " ▶️") : ""}</span>
            </div>
          </td>
        </tr>
        {openLevel1.includes(topic.id) &&
          topicWords.length > 0 &&
          topicWords.map((item) => <ItemRow key={item.id} item={item} />)}
      </React.Fragment>
    )
  }

  //  Ф-ція для рендерингу рядка
  const renderItemRow = (item) => (
    <tr
      key={item.id}
      className={
        isSelected(item.id)
          ? "bg-tabTrBgSel hover:bg-tabTrBgSelHov "
          : "bg-tabTrBg dark:bg-tabTrBgD dark:hover:bg-tabTrBgHovD hover:bg-tabTrBgHov "
      }
    >
      <td style={{ width: 30, borderBottom: "1px solid #ccc", padding: "4px", textAlign: "center" }}>
        <input
          type="checkbox"
          checked={isSelected(item.id)}
          onClick={(e) => e.stopPropagation()}
          onChange={() => toggleSelect(item.id)}
        />
      </td>

      {showOwnerMark && (
        <td style={{ width: 30, borderBottom: "1px solid #ccc", padding: "4px", textAlign: "center" }}>
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

        const isTextCol = !col.type || col.type === "text"

        const handleOpen = () => {
          if (isTextCol) setViewModal({ item, col })
        }

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const longPress = useLongPress(handleOpen, 500)

        return (
          <td
            key={col.accessor}
            style={{
              width: col.width,
              borderBottom: "1px solid #ccc",
              padding: "4px",
              ...(col.styleCell || {}),
            }}
            onDoubleClick={handleOpen}
            {...longPress}
          >
            <span
              style={{
                ...col.styleCellText,
                display: "block",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                cursor: isTextCol ? "pointer" : "default",
                maxWidth: col.width ? col.width - 8 : undefined,
              }}
              title={isTextCol && typeof content === "string" ? content : undefined}
            >
              {content}
            </span>
          </td>
        )
      })}
    </tr>
  )

  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0)

  //   компонент модалки показу тексту поля
  const ViewModal = () => {
    if (!viewModal) return null
    const { item, col } = viewModal
    const value = item[col.accessor] ?? ""

    return (
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
        onClick={() => setViewModal(null)}
      >
        <div
          className="
          bg-white dark:bg-gray-800
          w-full sm:w-[90vw] sm:max-w-2xl
          max-h-[90vh] sm:max-h-[80vh]
          rounded-t-2xl sm:rounded-xl
          shadow-xl flex flex-col
          p-4 sm:p-6
        "
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-3 shrink-0">
            <h2 className="font-semibold text-base text-gray-700 dark:text-gray-200 truncate pr-4">{col.label}</h2>
            <button
              onClick={() => setViewModal(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none shrink-0"
            >
              ✕
            </button>
          </div>
          <textarea
            readOnly
            className="
            flex-1 w-full resize-none rounded border
            border-gray-300 dark:border-gray-600
            p-3 text-sm
            text-gray-800 dark:text-gray-100
            bg-gray-50 dark:bg-gray-700
            focus:outline-none
          "
            value={value}
            onFocus={(e) => e.target.select()}
            autoFocus
          />
        </div>
      </div>
    )
  }

  // ItemRow
  const ItemRow = ({ item }) => {
    const longPressHandlers = columns.map((col) => {
      const isTextCol = !col.type || col.type === "text"
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useLongPress(() => {
        if (isTextCol) setViewModal({ item, col })
      }, 500)
    })

    return (
      <tr
        key={item.id}
        className={
          isSelected(item.id)
            ? "bg-tabTrBgSel hover:bg-tabTrBgSelHov "
            : "bg-tabTrBg dark:bg-tabTrBgD dark:hover:bg-tabTrBgHovD hover:bg-tabTrBgHov "
        }
      >
        <td style={{ width: 30, borderBottom: "1px solid #ccc", padding: "4px", textAlign: "center" }}>
          <input
            type="checkbox"
            checked={isSelected(item.id)}
            onClick={(e) => e.stopPropagation()}
            onChange={() => toggleSelect(item.id)}
          />
        </td>

        {showOwnerMark && (
          <td style={{ width: 30, borderBottom: "1px solid #ccc", padding: "4px", textAlign: "center" }}>
            {item.user_id === user?.id && "🧑‍💻"}
          </td>
        )}

        {columns.map((col, colIdx) => {
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

          const isTextCol = !col.type || col.type === "text"
          const handleOpen = () => {
            if (isTextCol) setViewModal({ item, col })
          }

          return (
            <td
              key={col.accessor}
              style={{
                width: col.width,
                borderBottom: "1px solid #ccc",
                padding: "4px",
                ...(col.styleCell || {}),
              }}
              onDoubleClick={handleOpen}
              {...longPressHandlers[colIdx]}
            >
              <span
                style={{
                  ...col.styleCellText,
                  display: "block",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  cursor: isTextCol ? "pointer" : "default",
                  maxWidth: col.width ? col.width - 8 : undefined,
                }}
                title={isTextCol && typeof content === "string" ? content : undefined}
              >
                {content}
              </span>
            </td>
          )
        })}
      </tr>
    )
  }

  return (
    <main className="p-1 max-w-4xl mx-auto">
      <h1 className="text-h1On dark:text-h1OnD font-heading text-lg sm:text-xl lg:text-2xl font-bold mb-4 mx-auto w-fit">
        {title}
      </h1>
      <div className="flex flex-wrap gap-1 sm:gap-2 items-center text-xs sm:text-sm lg:text-sm mb-3 font-body">
        {/* ДОДАТИ, ПЕРЕКЛАСТИ, ІМПОРТУВАТИ – завжди */}
        {user && selectedIds.length === 0 && (
          <>
            {onAdd && (
              <button
                onClick={onAdd}
                className="bg-btBg hover:opacity-70 text-white px-2 py-0.5 rounded-full font-medium"
              >
                ➕Додати
              </button>
            )}
            {onClickCsv && (
              <button
                onClick={onClickCsv}
                className="bg-btBg hover:opacity-70 text-white px-2 py-0.5 rounded-full font-medium"
                disabled={isPending}
              >
                📂 Імпорт CSV
              </button>
            )}
          </>
        )}
        {/* ЗБЕРЕГТИ ПОРЯДОК – тільки якщо були зміни */}
        {/* {isOrderChanged && (
          <button onClick={saveOrder} className="bg-green-600 text-white px-4 py-0.5 rounded">
            💾 Зберегти порядок
          </button>
        )} */}
        {/* 1 ВИДІЛЕНИЙ РЯДОК */}
        {selectedIds.length === 1 &&
          (() => {
            const selectedWord = tData.find((w) => w.id === selectedIds[0])
            // console.log("TableView/selectedWord=", selectedWord)
            // const isOwner = user && selectedWord && selectedWord.user_id === user.id
            const isOwner = user && selectedWord && (selectedWord.user_id === user.id || user.role === "admin")

            return (
              <>
                {isOwner && (
                  <>
                    {onEdit && (
                      //   <button onClick={() => onEdit(selectedWord)} className="bg-blue-600 text-white px-4 py-0.5 rounded">
                      <button
                        onClick={() => {
                          const word = tData.find((w) => w.id === selectedIds[0])
                          if (word) onEdit(word) // <-- передається весь об'єкт
                        }}
                        className="bg-btBg hover:opacity-70 text-white px-2 py-0.5 rounded-full font-medium"
                      >
                        ✏️ Редагувати
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          const words = tData.filter((w) => selectedIds.includes(w.id))
                          if (words.length > 0) onDelete(words) // ✅ передаємо масив об'єктів
                        }}
                        className="bg-btBg hover:opacity-70 text-white px-2 py-0.5 rounded-full font-medium"
                      >
                        🗑️ Видалити
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={startMoveMode}
                  //   onClick={() => setModal({ type: "move", word: selectedWord })}
                  className="bg-btBg hover:opacity-70 text-white px-2 py-0.5 rounded-full font-medium"
                >
                  🔀 Перемістити
                </button>
              </>
            )
          })()}
        {/* БАГАТО ВИДІЛЕНИХ */}
        {onDelete && selectedIds.length > 0 && (
          <button
            onClick={() => {
              const words = tData.filter((w) => selectedIds.includes(w.id))
              if (words.length > 0) onDelete(words) // ✅ передаємо масив об'єктів
            }}
            className="bg-btBg hover:opacity-70 text-white px-2 py-0.5 rounded-full font-medium"
          >
            🗑️ Видалити
          </button>
        )}
        {onThemeDownload && selectedIds.length > 0 && (
          <button
            onClick={() => {
              const words = tData.filter((w) => selectedIds.includes(w.id))
              onThemeDownload(words) // ✅ передаємо масив id
            }}
            className="bg-btBg hover:opacity-70 text-white px-2 py-0.5 rounded-full font-medium"
          >
            ⬇️ Заватажити
          </button>
        )}
        {/* Перекласти всі/виділені */}
        {onTranslate && (
          <button
            onClick={() => {
              if (translate) {
                // Зупинити переклад
                onTranslate("stop")
              } else if (selectedIds.length > 0) {
                // Перекласти виділені
                const selectedWords = tData.filter((w) => selectedIds.includes(w.id))
                onTranslate(selectedWords)
              } else {
                // Перекласти всі
                onTranslate(tData)
              }
            }}
            className={`px-2 py-0.5 rounded-full text-white font-medium ${
              translate ? "bg-btBg hover:opacity-70" : "bg-btBg hover:opacity-70"
            }`}
          >
            {translate
              ? "⛔Зупинити переклад"
              : selectedIds.length > 0
                ? "🌐Перекласти виділені✔️"
                : "🌐Перекласти всі"}{" "}
          </button>
        )}
      </div>
      {/* 2ий рядок над таблицею/повідомлення */}
      {message && (
        <p className="mb-3 text-pOn dark:text-pOnD font-medium text-xs sm:text-sm" role="alert">
          {message}
        </p>
      )}
      {/* перший рядок над таблицею */}
      <div className="flex gap-1 sm:gap-2 items-center text-xs sm:text-sm lg:text-sm mb-2 font-body">
        <span className="text-pOn dark:text-pOnD">📄Всього зап: {tData.length} </span>

        <button
          onClick={() => (selectedIds.length === tData.length ? clearSelection() : selectAll())}
          className="text-pOn dark:text-pOnD text-sm px-2 py-1 rounded border"
        >
          {selectedIds.length === tData.length ? "☑ Зняти всі" : "☐ Виділити всі"}
        </button>
        {selectedIds.length > 0 && (
          <span className="text-infoMsg dark:text-infoMsgD">Виділено Слів: {selectedIds.length}</span>
        )}
        {selectedLevel1.length > 0 && (
          // <span className="text-green-700">Виділено {level1Head} : {selectedLevel1.length}</span>
          <span className="text-infoMsg dark:text-infoMsgD">Тем : {selectedLevel1.length}</span>
        )}
      </div>
      {/*  */}
      <div
        ref={tableContainerRef}
        className="overflow-x-auto max-h-[500px] overflow-auto border border-tabThBorder dark:border-tabThBorderD rounded shadow-sm"
      >
        <table style={{ width: totalWidth }} className="border-collapse text-xs sm:text-sm lg:text-sm font-body">
          <thead className="bg-tabThBg dark:bg-tabThBgD text-tabThOn dark:text-tabThOnD sticky top-0 z-10">
            <tr>
              {showOwnerMark && <th style={{ width: 30, border: "1px solid #ccc", padding: "4px" }}>✔️</th>}
              {showOwnerMark && <th style={{ width: 30, border: "1px solid #ccc", padding: "4px" }}>👤</th>}
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  style={{
                    width: col.width,
                    border: "1px solid #ccc",
                    padding: "4px",
                    overflowWrap: "break-word", // перенос тільки при переповненні
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Основне тіло (<tbody>) */}

          <tbody>
            {/* Коли є level2 */}
            {level2?.length > 0 &&
              level2.map((section) => {
                const sectionLevel1 = level1?.filter((t) => t[level2Id] === section.id) || []

                return (
                  //
                  <React.Fragment key={section.id}>
                    <tr
                      onClick={() => toggleLevel2(section.id)}
                      //   className="bg-gray-300 cursor-pointer hover:opacity-70"
                      className="bg-tabTr2Bg dark:bg-tabTr2BgD cursor-pointer hover:bg-tabTr2BgHov dark:hover:bg-tabTr2BgHovD"
                    >
                      <td
                        colSpan={showOwnerMark ? columns.length + 2 : columns.length}
                        className="text-tabTr2On dark:text-tabTr2OnD p-2 font-bold"
                      >
                        {level2Head}: {section.name} ({sectionLevel1.length})
                        {sectionLevel1.length > 0 ? (openLevel2.includes(section.id) ? " 🔽" : " ▶️") : ""}
                      </td>
                    </tr>

                    {openLevel2.includes(section.id) &&
                      sectionLevel1.map((topic) => {
                        const topicWords = tData.filter((w) => w[level1Id] === topic.id)
                        return renderTopic(topic, topicWords)
                      })}
                  </React.Fragment>
                )
              })}
            {/* Коли є тільки level1 */}
            {(!level2 || level2.length === 0) &&
              level1?.length > 0 &&
              level1.map((topic) => {
                const topicWords = tData?.filter((w) => w[level1Id] === topic.id) || []
                return renderTopic(topic, topicWords)
              })}
            {/* Коли немає ні level1, ні level2 — плоска таблиця */}
            {(!level2 || level2.length === 0) &&
              (!level1 || level1.length === 0) &&
              //   data.map((item) => renderFlatRow(item))}
              data.map((item) => <ItemRow key={item.id} item={item} />)}
          </tbody>
        </table>
      </div>

      <MoveRowModal
        open={moveMode}
        onClose={() => setMoveMode(false)}
        moveInfo={moveInfo}
        moveSelectedRow={moveSelectedRow}
      />
      <ViewModal />
    </main>
  )
}
