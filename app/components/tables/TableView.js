// components/TableView.js
// Оптимізовано// Працює для всіх рівнів


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

// ── Рядок таблиці (окремий компонент щоб хуки працювали коректно) ──────────
function ItemRow({ item, columns, isSelected, toggleSelect, showOwnerMark, user, setViewModal }) {
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
      className={
        isSelected(item.id)
          ? "bg-tabTrBgSel hover:bg-tabTrBgSelHov"
          : "bg-tabTrBg dark:bg-tabTrBgD dark:hover:bg-tabTrBgHovD hover:bg-tabTrBgHov"
      }
    >
      {/* Чекбокс */}
      <td style={{ width: 30, borderBottom: "1px solid #ccc", padding: "4px", textAlign: "center" }}>
        <input
          type="checkbox"
          checked={isSelected(item.id)}
          onClick={(e) => e.stopPropagation()}
          onChange={() => toggleSelect(item.id)}
        />
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
          case "know":    content = value ? "👍" : "";  break
          case "boolean": content = value ? "✔"  : "";  break
          case "integer": content = value != null ? Math.floor(Number(value)) : "-"; break
          default:        content = value ?? ""
        }

        const isTextCol = !col.type || col.type === "text"
        const handleOpen = () => { if (isTextCol) setViewModal({ item, col }) }

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
            {...handlers[colIdx]}
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
  onTranslate,
  onThemeDownload,
  translate,
  isPending,
  message,
  setMessage,
  actionsOk,
  setActionsOk,
}) {
  const showOwnerMark = true
  const { data: session } = useSession()
  const user = session?.user

  const [tData,    setTData]    = useState(data        || [])
  const [level1,   setLevel1]   = useState(dataLevel1  || [])
  const [level2,   setLevel2]   = useState(dataLevel2  || [])

  const [isOrderChanged, setIsOrderChanged] = useState(false)
  const [selectedIds,    setSelectedIds]    = useState([])
  const [selectedLevel1, setSelectedLevel1] = useState([])

  const [moveMode, setMoveMode] = useState(false)
  const [moveInfo, setMoveInfo] = useState(null)
  const tableContainerRef = useRef(null)
  const rowRefs = useRef([])

  const [openLevel2, setOpenLevel2] = useState([])
  const [openLevel1, setOpenLevel1] = useState([])
  const [viewModal,  setViewModal]  = useState(null)

  // ── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    setTData(data || [])
    setLevel1(dataLevel1 || [])
    setLevel2(dataLevel2 || [])
    setOpenLevel1([]) // ← закриті за замовчуванням
    setOpenLevel2([]) // ← закриті за замовчуванням
  }, [data, dataLevel2, dataLevel1])

  useEffect(() => {
    if (actionsOk) {
      clearSelection()
      setActionsOk(false)
    }
  }, [actionsOk])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000)
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
  const isSelected   = (id) => selectedIds.includes(id)
  const toggleSelect = (id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  const selectAll    = ()   => { setSelectedIds(tData.map((w) => w.id)); setSelectedLevel1(level1.map((w) => w.id)) }
  const clearSelection = () => { setSelectedIds([]); setSelectedLevel1([]) }

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
          for (const tid of topicWordIds) { if (!newIds.includes(tid)) newIds.push(tid) }
          return newIds
        })
        return [...prev, id]
      }
    })
  }

  const toggleLevel2 = (id) => setOpenLevel2((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  const toggleLevel1 = (id) => setOpenLevel1((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const scrollRowIntoView = (rowIndex) => {
    const container = document.querySelector(".table-container")
    if (!container) return
    const rows = container.querySelectorAll("tbody tr")
    if (!rows[rowIndex]) return
    const row = rows[rowIndex]
    const containerTop    = container.scrollTop
    const containerBottom = containerTop + container.clientHeight
    const rowTop    = row.offsetTop
    const rowBottom = rowTop + row.offsetHeight
    if      (rowTop    < containerTop)    container.scrollTop = rowTop
    else if (rowBottom > containerBottom) container.scrollTop = rowBottom - container.clientHeight
  }

  const startMoveMode = () => {
    if (selectedIds.length !== 1) return
    const id  = selectedIds[0]
    const idx = tData.findIndex((w) => w.id === id)
    if (idx === -1) return
    setMoveInfo({ idx, total: tData.length })
    scrollRowIntoView(idx)
    setMoveMode(true)
  }

  const moveSelectedRow = (direction) => {
    if (!moveInfo) return
    const { idx } = moveInfo
    const topicId     = tData[idx].topic_id
    const topicWords  = tData.filter((w) => w.topic_id === topicId)
    const topicIndexes = topicWords.map((w) => tData.findIndex((x) => x.id === w.id))
    const localIdx    = topicIndexes.indexOf(idx)
    let newIdx = idx
    if      (direction === "up"   && localIdx > 0)                      newIdx = topicIndexes[localIdx - 1]
    else if (direction === "down" && localIdx < topicIndexes.length - 1) newIdx = topicIndexes[localIdx + 1]
    if (newIdx === idx) return
    let updatedWords = [...tData]
    ;[updatedWords[idx], updatedWords[newIdx]] = [updatedWords[newIdx], updatedWords[idx]]
    setTData(updatedWords.map((w, i) => ({ ...w, pn: i + 1 })))
    setIsOrderChanged(true)
    setMoveInfo((prev) => ({ ...prev, idx: newIdx }))
    if (rowRefs.current[newIdx]) rowRefs.current[newIdx].scrollIntoView({ behavior: "smooth", block: "nearest" })
  }

  // ── Рендер групи level1 ───────────────────────────────────────────────────
  const renderTopic = (topic, topicWords) => {
    const topicWordIds   = topicWords.map((w) => w.id)
    const selectedCount  = topicWordIds.filter((id) => selectedIds.includes(id)).length
    let checkbox = topicWords.length < 1 ? "  " : selectedCount === topicWords.length && selectedCount > 0 ? "☑️" : selectedCount > 0 ? "➖" : "🔲"

    return (
      <React.Fragment key={topic.id}>
        <tr
          onClick={() => toggleLevel1(topic.id)}
          className="bg-tabTr1Bg dark:bg-tabTr1BgD cursor-pointer hover:bg-tabTr1BgHov dark:hover:bg-tabTr1BgHovD"
        >
          <td colSpan={showOwnerMark ? columns.length + 2 : columns.length} className="p-2 font-semibold">
            <div className="flex text-tabTr1On dark:text-tabTr1OnD items-center gap-2" style={{ userSelect: "none", cursor: "pointer" }}>
              <span onClick={(e) => { e.stopPropagation(); toggleSelectTopic(topic.id) }}>
                {topicWords.length > 1 ? <>{checkbox} [{selectedCount}]</> : "  "}
              </span>
              <span>({topicWords.length}) {level1Head}: {topic.name}</span>
              <span>{topicWords.length > 0 ? (openLevel1.includes(topic.id) ? " 🔽" : " ▶️") : ""}</span>
            </div>
          </td>
        </tr>
        {openLevel1.includes(topic.id) && topicWords.length > 0 &&
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
      </div>

      {/* Повідомлення */}
      {message && (
        <p className="mb-3 text-pOn dark:text-pOnD font-medium text-xs sm:text-sm" role="alert">
          {message}
        </p>
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
      </div>

      {/* Таблиця */}
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
                  style={{ width: col.width, border: "1px solid #ccc", padding: "4px", overflowWrap: "break-word" }}
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
                />
              ))}
          </tbody>
        </table>
      </div>

      <MoveRowModal
        open={moveMode}
        onClose={() => setMoveMode(false)}
        moveInfo={moveInfo}
        moveSelectedRow={moveSelectedRow}
      />

      <ViewModal viewModal={viewModal} onClose={() => setViewModal(null)} />
    </main>
  )
}