// components/TableView.js
// Оптимізовано// Працює для всіх рівнів
// Недоробл селект секш


import React, { useEffect, useState, useRef } from "react"
import { useSession } from "next-auth/react"
import MoveRowModal from "@/app/components/tables/MoveRowModal"

// ── Хук для long press (поза компонентом) ──────────────────────────────────
function useLongPress(callback, ms = 600) {
  const timerRef = useRef(null)

  const start = () => {
    timerRef.current = setTimeout(() => {
      callback()
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
    onTouchEnd:   clear,
    onTouchMove:  clear,
    onTouchCancel: clear,
  }
}

// ── Модалка перегляду тексту (поза TableView, окремий компонент) ───────────
function ViewModal({ viewModal, onClose }) {
  if (!viewModal) return null
  const { item, col } = viewModal
  const value = item[col.accessor] ?? ""

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
      style={{ alignItems: "flex-end" }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "860px",
          height: "85vh",
          background: "var(--modal-bg, white)",
          borderRadius: "16px 16px 0 0",
          boxShadow: "0 -4px 32px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          padding: "16px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexShrink: 0 }}>
          <span style={{ fontWeight: 600, fontSize: 16, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>
            {col.label}
          </span>
          <button
            onClick={onClose}
            style={{ fontSize: 22, lineHeight: 1, background: "none", border: "none", cursor: "pointer", color: "#888", flexShrink: 0 }}
          >
            ✕
          </button>
        </div>
        {/* Текст */}
        <textarea
          readOnly
          autoFocus
          onFocus={(e) => e.target.select()}
          value={value}
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
            background: "#f9f9f9",
            color: "#222",
          }}
        />
      </div>
    </div>
  )
}

// //Автоскрол при переміщенні рядків
// const scrollToMarkerRow = (offset) => {
//   if (!moveInfo) return
//   const { idx, groups, topicWords } = moveInfo
//   const targetIdx = idx + offset
//   if (targetIdx < 0 || targetIdx >= groups.length) return

//   const targetGroupKey = groups[targetIdx]
//   const groupItems = topicWords.filter((w) => (w.group_key || String(w.id)) === targetGroupKey)

//   // При русі вгору — перший рядок групи, вниз — останній
//   const targetItem = offset < 0 ? groupItems[0] : groupItems[groupItems.length - 1]
//   if (!targetItem) return

//   // Знаходимо рядок в таблиці по data-id
//   const container = tableContainerRef.current
//   if (!container) return
//   const row = container.querySelector(`tr[data-id="${targetItem.id}"]`)
//   if (!row) return
//   row.scrollIntoView({ behavior: "smooth", block: "nearest" })
// }

// ── Рядок таблиці (окремий компонент щоб хуки працювали коректно) ──────────
function ItemRow({
  item,
  columns,
  isSelected,
  toggleSelect,
  showOwnerMark,
  user,
  setViewModal,
  moveMode,
  moveOffset,
  moveInfo,
}) {
  // Один масив long-press handlers — по одному на колонку
  // Хуки викликаються на верхньому рівні компонента (не в .map) ✅
  const handlers = columns.map((col) => {
    const isTextCol = !col.type || col.type === "text"
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useLongPress(() => {
      if (isTextCol) setViewModal({ item, col })
    }, 600)
  })

  return (
    <tr
      data-id={item.id}
      className={
        isSelected(item.id)
          ? "bg-tabTrBgSel hover:bg-tabTrBgSelHov dark:bg-tabTrBgSelD dark:hover:bg-tabTrBgSelHovD"
          : "bg-tabTrBg dark:bg-tabTrBgD dark:hover:bg-tabTrBgHovD hover:bg-tabTrBgHov"
      }
    >
      {/* Чекбокс */}
      <td style={{ width: 30, borderBottom: "1px solid #ccc", padding: "4px", textAlign: "center" }}>
        {moveMode && moveInfo ? (
          (() => {
            const { idx, groups, topicWords, word } = moveInfo
            const targetIdx = idx + moveOffset

            if (item.id === word.id) return <span style={{ color: "orange", fontSize: 16 }}>⮞</span>

            if (item.topic_id !== word.topic_id)
              return (
                <input
                  type="checkbox"
                  checked={isSelected(item.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleSelect(item.id)}
                />
              )

            const itemGroupKey = item.group_key || String(item.id)
            const itemGroupIdx = groups.indexOf(itemGroupKey)
            const groupItems = topicWords.filter((w) => (w.group_key || String(w.id)) === itemGroupKey)

            if (moveOffset < 0 && itemGroupIdx === targetIdx && groupItems[0]?.id === item.id)
              return <span style={{ color: "orange", fontSize: 16 }}>▲</span>

            if (moveOffset > 0 && itemGroupIdx === targetIdx && groupItems[groupItems.length - 1]?.id === item.id)
              return <span style={{ color: "orange", fontSize: 16 }}>▼</span>

            return (
              <input
                type="checkbox"
                checked={isSelected(item.id)}
                onClick={(e) => e.stopPropagation()}
                onChange={() => toggleSelect(item.id)}
              />
            )
          })()
        ) : (
          <input
            type="checkbox"
            checked={isSelected(item.id)}
            onClick={(e) => e.stopPropagation()}
            onChange={() => toggleSelect(item.id)}
          />
        )}
      </td>

      {/* Власник */}
      {showOwnerMark && (
        <td style={{ width: 30, borderBottom: "1px solid #ccc", padding: "4px", textAlign: "center" }}>
          {item.user_id === user?.id && "🧑‍💻"}
        </td>
      )}

      {/* Колонки */}
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
              minWidth: col.width,
              borderBottom: "1px solid #ccc",
              padding: "4px",
              overflow: "hidden", // 👈 ДОДАЙ
              ...(col.styleCell || {}),
            }}
            onDoubleClick={handleOpen}
            {...handlers[colIdx]}
          >
            <span
              style={{
                ...col.styleCellText,
                display: "block",
                // width: "100%",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                cursor: isTextCol ? "pointer" : "default",
                // maxWidth: col.width ? col.width - 8 : undefined,
                maxWidth: "100%", // 👈 ключ
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

// ── Основний компонент ─────────────────────────────────────────────────────
export default function TableView({
  data,
  dataLevel1,
  dataLevel2,
  level1Id,
  level2Id,
  level1Head = "Тема",
  level2Head = "Автор",
  columns,
  title,
  onAdd,
  onEdit,
  onDelete,
  onClickCsv,
  translate,
  onTranslate,
  reversTranslate,
  onReversTranslate,
  onThemeDownload,
  onImportText,
  onSavePn,
  isPending,
  message,
  setMessage,
  actionsOk,
  setActionsOk,
}) {
  const showOwnerMark = true
  const { data: session } = useSession()
  const user = session?.user

  const [tData, setTData] = useState(data || [])
  const [level1, setLevel1] = useState(dataLevel1 || [])
  const [level2, setLevel2] = useState(dataLevel2 || [])

  const [isOrderChanged, setIsOrderChanged] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectedLevel1, setSelectedLevel1] = useState([])
  const [selectedLevel2, setSelectedLevel2] = useState([]) // додати

  const [moveMode, setMoveMode] = useState(false)
  const [moveInfo, setMoveInfo] = useState(null)
  const tableContainerRef = useRef(null)
  const rowRefs = useRef([])

  const [openLevel2, setOpenLevel2] = useState([])
  const [openLevel1, setOpenLevel1] = useState([])
  const [viewModal, setViewModal] = useState(null)
  const [moveOffset, setMoveOffset] = useState(0)

  // ── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    setTData(data || [])
    setLevel1(dataLevel1 || [])
    setLevel2(dataLevel2 || [])
    // setOpenLevel1([]) // ← закриті за замовчуванням
    // setOpenLevel2([]) // ← закриті за замовчуванням
  }, [data, dataLevel2, dataLevel1])

  useEffect(() => {
    if (actionsOk) {
      clearSelection()
      setActionsOk(false)
    }
  }, [actionsOk])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 8000)
      return () => clearTimeout(timer)
    }
  }, [message])

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isOrderChanged) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isOrderChanged])

  // ── Helpers ───────────────────────────────────────────────────────────────
  const isSelected = (id) => selectedIds.includes(id)
  const toggleSelect = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  const selectAll = () => {
    setSelectedIds(tData.map((w) => w.id))
    setSelectedLevel1(level1.map((w) => w.id))
  }
  const clearSelection = () => {
    setSelectedIds([])
    setSelectedLevel1([])
  }

  const toggleSelectTopic = (id) => {
    setSelectedLevel1((prev) => {
      if (prev.includes(id)) {
        const topicWordIds = tData.filter((w) => w[level1Id] === id).map((w) => w.id)
        setSelectedIds((prevIds) => prevIds.filter((wid) => !topicWordIds.includes(wid)))
        return prev.filter((x) => x !== id)
      } else {
        const topicWordIds = tData.filter((w) => w[level1Id] === id).map((w) => w.id)
        setSelectedIds((prevIds) => {
          const newIds = [...prevIds]
          for (const tid of topicWordIds) {
            if (!newIds.includes(tid)) newIds.push(tid)
          }
          return newIds
        })
        return [...prev, id]
      }
    })
  }

  const toggleSelectSection = (sectionId) => {
    const sectionTopics = level1.filter((t) => t[level2Id] === sectionId)
    const sectionTopicIds = sectionTopics.map((t) => t.id)
    const sectionWordIds = tData.filter((w) => sectionTopicIds.includes(w[level1Id])).map((w) => w.id)

    setSelectedLevel2((prev) => {
      if (prev.includes(sectionId)) {
        setSelectedLevel1((pl1) => pl1.filter((id) => !sectionTopicIds.includes(id)))
        setSelectedIds((pids) => pids.filter((id) => !sectionWordIds.includes(id)))
        return prev.filter((x) => x !== sectionId)
      } else {
        setSelectedLevel1((pl1) => {
          const n = [...pl1]
          for (const id of sectionTopicIds) {
            if (!n.includes(id)) n.push(id)
          }
          return n
        })
        setSelectedIds((pids) => {
          const n = [...pids]
          for (const id of sectionWordIds) {
            if (!n.includes(id)) n.push(id)
          }
          return n
        })
        return [...prev, sectionId]
      }
    })
  }

  const countSelectedTopicsInSection = (sectionId) => {
    const sectionTopicIds = level1.filter((t) => t[level2Id] === sectionId).map((t) => t.id)
    return sectionTopicIds.filter((id) => selectedLevel1.includes(id)).length
  }

  const toggleLevel2 = (id) =>
    setOpenLevel2((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  const toggleLevel1 = (id) =>
    setOpenLevel1((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const scrollRowIntoView = (rowIndex) => {
    const container = document.querySelector(".table-container")
    if (!container) return
    const rows = container.querySelectorAll("tbody tr")
    if (!rows[rowIndex]) return
    const row = rows[rowIndex]
    const containerTop = container.scrollTop
    const containerBottom = containerTop + container.clientHeight
    const rowTop = row.offsetTop
    const rowBottom = rowTop + row.offsetHeight
    if (rowTop < containerTop) container.scrollTop = rowTop
    else if (rowBottom > containerBottom) container.scrollTop = rowBottom - container.clientHeight
  }

  const startMoveMode = () => {
    if (selectedIds.length !== 1) return
    const id = selectedIds[0]
    const word = tData.find((w) => w.id === id)
    if (!word) return

    const topicWords = tData.filter((w) => w.topic_id === word.topic_id).sort((a, b) => a.pn - b.pn)

    const groups = [...new Set(topicWords.map((w) => w.group_key || String(w.id)))]
    const idx = groups.indexOf(word.group_key || String(word.id))

    console.log("word:", word)
    console.log("groups:", groups)
    console.log("idx:", idx) // якщо -1 — проблема тут

    setMoveOffset(0)
    setMoveInfo({ idx, total: groups.length, groups, topicWords, word })
    setMoveMode(true)
  }

  const scrollToMarkerRow = (offset) => {
    if (!moveInfo) return
    const { idx, groups, topicWords } = moveInfo
    const targetIdx = idx + offset
    if (targetIdx < 0 || targetIdx >= groups.length) return

    const targetGroupKey = groups[targetIdx]
    const groupItems = topicWords.filter((w) => (w.group_key || String(w.id)) === targetGroupKey)
    const targetItem = offset < 0 ? groupItems[0] : groupItems[groupItems.length - 1]
    if (!targetItem) return

    const container = tableContainerRef.current
    if (!container) return
    const row = container.querySelector(`tr[data-id="${targetItem.id}"]`)
    if (!row) return
    row.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  const moveSelectedRow = (offset) => {
    if (!moveInfo) return
    const { idx, groups, topicWords } = moveInfo

    const newIdx = idx + offset
    if (newIdx < 0 || newIdx >= groups.length) return

    const newGroups = [...groups]

    // Послідовні свапи замість одного великого
    if (offset > 0) {
      for (let i = idx; i < newIdx; i++) {
        ;[newGroups[i], newGroups[i + 1]] = [newGroups[i + 1], newGroups[i]]
      }
    } else {
      for (let i = idx; i > newIdx; i--) {
        ;[newGroups[i], newGroups[i - 1]] = [newGroups[i - 1], newGroups[i]]
      }
    }

    let pn = 1
    const reindexed = []
    for (const key of newGroups) {
      const groupWords = topicWords.filter((w) => (w.group_key || String(w.id)) === key)
      for (const w of groupWords) {
        reindexed.push({ ...w, pn: pn++ })
      }
    }

    const newData = tData.map((w) => {
      const updated = reindexed.find((u) => u.id === w.id)
      return updated || w
    })

    setTData(newData)
    setIsOrderChanged(true)
  }

  // ── Рендер групи level1 ───────────────────────────────────────────────────
  const renderTopic = (topic, topicWords) => {
    const topicWordIds = topicWords.map((w) => w.id)
    const selectedCount = topicWordIds.filter((id) => selectedIds.includes(id)).length
    let checkbox =
      topicWords.length < 1
        ? "  "
        : selectedCount === topicWords.length && selectedCount > 0
          ? "☑️"
          : selectedCount > 0
            ? "➖"
            : "🔲"

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
                ({topicWords.length}) {level1Head}: {topic.name}
              </span>
              <span>{topicWords.length > 0 ? (openLevel1.includes(topic.id) ? " 🔽" : " ▶️") : ""}</span>
            </div>
          </td>
        </tr>
        {openLevel1.includes(topic.id) &&
          topicWords.length > 0 &&
          topicWords.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              columns={columns}
              isSelected={isSelected}
              toggleSelect={toggleSelect}
              showOwnerMark={showOwnerMark}
              user={user}
              setViewModal={setViewModal}
              moveMode={moveMode}
              moveOffset={moveOffset}
              moveInfo={moveInfo}
            />
          ))}
      </React.Fragment>
    )
  }

  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0)

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <main className="p-1 max-w-4xl mx-auto">
      <h1 className="text-h1On dark:text-h1OnD font-heading text-lg sm:text-xl lg:text-2xl font-bold mb-4 mx-auto w-fit">
        {title}
      </h1>

      {/* Кнопки дій */}
      <div className="flex flex-wrap gap-1 sm:gap-2 items-center text-xs sm:text-sm lg:text-sm mb-3 font-body">
        {/* ДОДАТИ, ІМПОРТУВАТИ – коли нічого не виділено */}
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
            {onImportText && (
              <button
                onClick={onImportText}
                className="bg-btBg hover:opacity-70 text-white px-2 py-0.5 rounded-full font-medium"
              >
                📋 Імпорт тексту
              </button>
            )}
          </>
        )}

        {/* 1 ВИДІЛЕНИЙ РЯДОК */}
        {selectedIds.length === 1 &&
          (() => {
            const selectedWord = tData.find((w) => w.id === selectedIds[0])
            const isOwner =
              user && selectedWord && (String(selectedWord.user_id) === String(user.id) || user.role === "admin")
            return (
              <>
                {isOwner && onEdit && (
                  <button
                    onClick={() => {
                      const word = tData.find((w) => w.id === selectedIds[0])
                      if (word) onEdit(word)
                    }}
                    className="bg-btBg hover:opacity-70 text-white px-2 py-0.5 rounded-full font-medium"
                  >
                    ✏️ Редагувати
                  </button>
                )}
                {isOwner && onDelete && (
                  <button
                    onClick={() => {
                      const words = tData.filter((w) => selectedIds.includes(w.id))
                      if (words.length > 0) onDelete(words)
                    }}
                    className="bg-btBg hover:opacity-70 text-white px-2 py-0.5 rounded-full font-medium"
                  >
                    🗑️ Видалити
                  </button>
                )}
                <button
                  onClick={startMoveMode}
                  className="bg-btBg hover:opacity-70 text-white px-2 py-0.5 rounded-full font-medium"
                >
                  🔀 Перемістити
                </button>
              </>
            )
          })()}

        {/* БАГАТО ВИДІЛЕНИХ — видалити тільки свої (або всі якщо адмін) */}
        {onDelete &&
          selectedIds.length > 1 &&
          (() => {
            const deletable = tData.filter(
              (w) => selectedIds.includes(w.id) && (String(w.user_id) === String(user?.id) || user?.role === "admin"),
            )
            if (deletable.length === 0) return null
            return (
              <button
                onClick={() => onDelete(deletable)}
                className="bg-btBg hover:opacity-70 text-white px-2 py-0.5 rounded-full font-medium"
              >
                🗑️ Видалити ({deletable.length})
              </button>
            )
          })()}

        {/* ЗАВАНТАЖИТИ */}
        {onThemeDownload && selectedIds.length > 0 && (
          <button
            onClick={() => {
              const words = tData.filter((w) => selectedIds.includes(w.id))
              onThemeDownload(words)
            }}
            className="bg-btBg hover:opacity-70 text-white px-2 py-0.5 rounded-full font-medium"
          >
            ⬇️ Завантажити
          </button>
        )}

        {/* ПЕРЕКЛАСТИ – завжди видима */}
        {onTranslate && (
          <button
            onClick={() => {
              if (translate) {
                onTranslate("stop")
              } else if (selectedIds.length > 0) {
                onTranslate(tData.filter((w) => selectedIds.includes(w.id)))
              } else {
                onTranslate(tData)
              }
            }}
            className="px-2 py-0.5 rounded-full text-white font-medium bg-btBg hover:opacity-70"
          >
            {translate
              ? "⛔Зупинити переклад"
              : selectedIds.length > 0
                ? "🌐Перекласти виділені✔️"
                : "🌐Перекласти всі"}
          </button>
        )}
        {onReversTranslate && (
          <button
            onClick={onReversTranslate}
            className="px-2 py-0.5 rounded-full text-white font-medium bg-btBg hover:opacity-70"
          >
            {reversTranslate ? "🔄 translate→word" : "🔄 word→translate"}
          </button>
        )}
      </div>

      {/* Повідомлення */}
      {isPending && (
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-blue-600">Імпортую...</span>
        </div>
      )}
      {message && (
        <div
          className="mb-3 px-4 py-2 rounded-lg text-sm font-medium text-center shadow"
          style={{
            background: message.includes("Помилка") ? "#fee2e2" : "#dcfce7",
            color: message.includes("Помилка") ? "#b91c1c" : "#15803d",
            border: message.includes("Помилка") ? "1px solid #fca5a5" : "1px solid #86efac",
          }}
          role="alert"
        >
          {message}
        </div>
      )}

      {/* Рядок статистики */}
      <div className="flex gap-1 sm:gap-2 items-center text-xs sm:text-sm lg:text-sm mb-2 font-body">
        <span className="text-pOn dark:text-pOnD">📄Всього зап: {tData.length}</span>
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
          <span className="text-infoMsg dark:text-infoMsgD">Тем: {selectedLevel1.length}</span>
        )}
        {selectedLevel2.length > 0 && (
          <span className="text-infoMsg dark:text-infoMsgD">Секцій: {selectedLevel2.length}</span>
        )}
      </div>

      {/* Таблиця */}
      <div
        ref={tableContainerRef}
        className="overflow-x-auto max-h-[500px] overflow-auto border border-tabThBorder dark:border-tabThBorderD rounded shadow-sm"
      >
        <table
          style={{ minWidth: totalWidth, width: "100%", tableLayout: "fixed" }}
          className="border-collapse text-xs sm:text-sm lg:text-sm font-body"
        >
          <thead className="bg-tabThBg dark:bg-tabThBgD text-tabThOn dark:text-tabThOnD sticky top-0 z-10">
            <tr>
              {showOwnerMark && <th style={{ width: 30, border: "1px solid #ccc", padding: "4px" }}>✔️</th>}
              {showOwnerMark && <th style={{ width: 30, border: "1px solid #ccc", padding: "4px" }}>👤</th>}
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  style={{ minWidth: col.width, border: "1px solid #ccc", padding: "4px", overflowWrap: "break-word" }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* level2 + level1 */}
            {level2?.length > 0 &&
              level2.map((section) => {
                const sectionLevel1 = level1?.filter((t) => t[level2Id] === section.id) || []
                return (
                  <React.Fragment key={section.id}>
                    <tr
                      onClick={() => toggleLevel2(section.id)}
                      className="bg-tabTr2Bg dark:bg-tabTr2BgD cursor-pointer hover:bg-tabTr2BgHov dark:hover:bg-tabTr2BgHovD"
                    >
                      {/* <td
                        colSpan={showOwnerMark ? columns.length + 2 : columns.length}
                        className="text-tabTr2On dark:text-tabTr2OnD p-2 font-bold"
                      >
                        {level2Head}: {section.name} ({sectionLevel1.length})
                        {sectionLevel1.length > 0 ? (openLevel2.includes(section.id) ? " 🔽" : " ▶️") : ""}
                      </td> */}
                      <td
                        colSpan={showOwnerMark ? columns.length + 2 : columns.length}
                        className="text-tabTr2On dark:text-tabTr2OnD p-2 font-bold"
                      >
                        <div className="flex items-center gap-2" style={{ userSelect: "none" }}>
                          <span
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleSelectSection(section.id)
                            }}
                            title="Виділити всі теми секції"
                          >
                            {sectionLevel1.length > 0
                              ? selectedLevel2.includes(section.id)
                                ? "☑️"
                                : countSelectedTopicsInSection(section.id) > 0
                                  ? "➖"
                                  : "🔲"
                              : "  "}
                          </span>

                          <span>
                            {level2Head}: {section.name} ({sectionLevel1.length})
                          </span>

                          {countSelectedTopicsInSection(section.id) > 0 && (
                            <span style={{ fontSize: "0.75rem", color: "#f59e0b", fontWeight: 700 }}>
                              ✔️{countSelectedTopicsInSection(section.id)} тем
                            </span>
                          )}

                          <span>
                            {sectionLevel1.length > 0 ? (openLevel2.includes(section.id) ? "🔽" : " ▶️") : ""}
                          </span>
                        </div>
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

            {/* тільки level1 */}
            {(!level2 || level2.length === 0) &&
              level1?.length > 0 &&
              level1.map((topic) => renderTopic(topic, tData?.filter((w) => w[level1Id] === topic.id) || []))}

            {/* плоска таблиця */}
            {(!level2 || level2.length === 0) &&
              (!level1 || level1.length === 0) &&
              data.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  columns={columns}
                  isSelected={isSelected}
                  toggleSelect={toggleSelect}
                  showOwnerMark={showOwnerMark}
                  user={user}
                  setViewModal={setViewModal}
                  moveMode={moveMode}
                  moveOffset={moveOffset}
                  moveInfo={moveInfo}
                />
              ))}
          </tbody>
        </table>
      </div>

      <MoveRowModal
        open={moveMode}
        onClose={() => {
          setMoveMode(false)
          setMoveOffset(0)
        }}
        onDone={() => {
          if (moveOffset !== 0) {
            const { idx, groups, topicWords } = moveInfo
            const newIdx = idx + moveOffset
            const newGroups = [...groups]

            // Послідовні свапи
            if (moveOffset > 0) {
              for (let i = idx; i < newIdx; i++) {
                ;[newGroups[i], newGroups[i + 1]] = [newGroups[i + 1], newGroups[i]]
              }
            } else {
              for (let i = idx; i > newIdx; i--) {
                ;[newGroups[i], newGroups[i - 1]] = [newGroups[i - 1], newGroups[i]]
              }
            }

            let pn = 1
            const reindexed = []
            for (const key of newGroups) {
              const groupWords = topicWords.filter((w) => (w.group_key || String(w.id)) === key)
              for (const w of groupWords) {
                reindexed.push({ ...w, pn: pn++ })
              }
            }

            const newData = tData.map((w) => {
              const updated = reindexed.find((u) => u.id === w.id)
              return updated || w
            })

            setTData(newData)
            setIsOrderChanged(true)
            if (onSavePn) onSavePn(reindexed)
          }
          setMoveMode(false)
          setMoveOffset(0)
        }}
        moveInfo={moveInfo}
        moveOffset={moveOffset}
        onUp={() => {
          setMoveOffset((prev) => prev - 1)
          scrollToMarkerRow(moveOffset - 1)
        }}
        onDown={() => {
          setMoveOffset((prev) => prev + 1)
          scrollToMarkerRow(moveOffset + 1)
        }}
      />

      <ViewModal viewModal={viewModal} onClose={() => setViewModal(null)} />
    </main>
  )
}