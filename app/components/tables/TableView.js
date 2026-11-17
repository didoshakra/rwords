// components/tables/TableView.js
// Оптимізовано// Працює для всіх рівнів
// Недоробл селект секш

import React, { useEffect, useState, useRef } from "react"
import { useSession } from "next-auth/react"

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
    onTouchEnd: clear,
    onTouchMove: clear,
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontWeight: 600,
              fontSize: 16,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              paddingRight: 8,
            }}
          >
            {col.label}
          </span>
          <button
            onClick={onClose}
            style={{
              fontSize: 22,
              lineHeight: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#888",
              flexShrink: 0,
            }}
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
  isActive,
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
      style={
        isActive
          ? { background: "rgba(245,158,11,0.55)", outline: "3px solid #f59e0b", outlineOffset: "-3px" }
          : undefined
      }
      className={
        isSelected(item.id)
          ? "bg-tabTrBgSel hover:bg-tabTrBgSelHov hover:bg:opacity-70 dark:bg-tabTrBgSelD dark:hover:bg-tabTrBgSelHovD border-b-2 border-amber-400 text-tabTrOn dark:text-tabTrOnD hover:text-tabTrOnHov "
          : "bg-tabTrBg dark:bg-tabTrBgD dark:hover:bg-tabTrBgHovD hover:bg-tabTrBgHov text-tabTrOn dark:text-tabTrOnD hover:text-tabTrOnHov"
      }
    >
      {/* Чекбокс */}
      <td className="w-[30px] border-b border-tabThBorder dark:border-tabThBorderD p-1 text-center">
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
        <td className="w-[30px] border-l border-b border-tabThBorder dark:border-tabThBorderD p-1 text-left">
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
          // content = value ?? "\u00A0"
        }

        const isTextCol = !col.type || col.type === "text"
        const handleOpen = () => {
          if (isTextCol) setViewModal({ item, col })
        }

        return (
          <td
            key={col.accessor}
            className="border-l border-b border-tabThBorder dark:border-tabThBorderD p-1 overflow-hidden"
            style={{ minWidth: col.width, ...col.styleCell }}
            onDoubleClick={handleOpen}
            {...handlers[colIdx]}
          >
            <span
              style={{
                // ...col.styleCellText,
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

// компонент модалки меню CRUD для секцій і тем
function MenuModal({
  menuModal,
  onClose,
  onAdd,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  level1Head,
  level2Head,
  user,
  positionText,
  moveError,
}) {
  if (!menuModal) return null
  console.log("MenuModal/user=", user) // в TableView, не в MenuModal
  console.log("MenuModal/user?.role=", user?.role)
  const isSection = menuModal.type === "section"
  const canEdit = user && (user.role === "admin" || String(user.id) === String(menuModal.item.user_id))

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-white dark:bg-gray-800 rounded-t-xl shadow-2xl border-t-2 border-amber-400 p-4 w-full max-w-md flex flex-col gap-2">
        <p className="font-semibold text-sm mb-2 text-center">
          {isSection ? level2Head : level1Head}: {menuModal.item.name}
        </p>
        {positionText && <p className="text-center text-xs opacity-70">{positionText}</p>}
        {moveError && <p className="text-center text-xs text-red-600">{moveError}</p>}
        {onMoveUp && onMoveDown && (
          <div className="flex gap-2">
            <button
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="flex-1 px-4 py-2 rounded-lg bg-btBg text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-70"
            >
              ⬆️ Вище
            </button>
            <button
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="flex-1 px-4 py-2 rounded-lg bg-btBg text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-70"
            >
              ⬇️ Нижче
            </button>
          </div>
        )}
        {onAdd && (
          <button
            onClick={() => {
              onAdd()
              onClose()
            }}
            className="px-4 py-2 rounded-lg bg-btBg text-white hover:opacity-70 text-sm"
          >
            ➕ {isSection ? `Додати секцію` : "Додати тему"}
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => {
              if (canEdit) {
                onEdit()
                onClose()
              }
            }}
            disabled={!canEdit}
            title={!canEdit ? "Тільки власник може редагувати" : ""}
            className="px-4 py-2 rounded-lg bg-btBg text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-70"
          >
            ✏️ Редагувати
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => {
              if (canEdit) {
                onDelete()
                onClose()
              }
            }}
            disabled={!canEdit}
            title={!canEdit ? "Тільки власник може видалити" : ""}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-70"
          >
            🗑️ Видалити
          </button>
        )}
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Закрити
        </button>
      </div>
    </div>
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
  level2Head = "Група",
  columns,
  title,
  onAdd,
  onEdit,
  onDelete,
  onAddSection,
  onEditSection,
  onDeleteSections,
  onAddTopic,
  onEditTopic,
  onDeleteTopics,
  onMoveTopic,
  onMoveSection,
  onClickCsv,
  translate,
  onTranslate,
  reversTranslate,
  onReversTranslate,
  onThemeDownload,
  onPlay,
  onImportText,
  onSavePn,
  isPending,
  message,
  setMessage,
  actionsOk,
  setActionsOk,
}) {
  const showOwnerMark = true
  const { data: session, status } = useSession()
  const user = session?.user
  console.log("onMoveTopic:", typeof onMoveTopic, "user:", !!user)
  console.log("TableView/session=", session, "user=", user, "status=", status)
  console.log("onMoveTopic:", typeof onMoveTopic)

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
  const [menuModal, setMenuModal] = useState(null) // null | { type: "section"|"topic", item }
  const [activeTopicId, setActiveTopicId] = useState(null) // постійно підсвічена тема
  const [activeSectionId, setActiveSectionId] = useState(null)
  const [activeGroup, setActiveGroup] = useState(null) // { topicId, key } група слів, яку рухали
  const scrollToWordRef = useRef(null)
  const [wordMoveOpen, setWordMoveOpen] = useState(false)
  const [wordMoveError, setWordMoveError] = useState("")
  const scrollToActiveSectionRef = useRef(false)
  const [moveError, setMoveError] = useState("")
  const scrollToActiveRef = useRef(false)

  const isOwnerOrAdmin = (w) => user && (user.role === "admin" || String(user.id) === String(w.user_id))

  // ── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (tData.length > 0) console.log(tData[0])
  }, [tData])
  // Віконце переміщення працює лише коли виділено рівно одне слово
  useEffect(() => {
    if (wordMoveOpen && selectedIds.length !== 1) setWordMoveOpen(false)
  }, [selectedIds, wordMoveOpen])
  //
  useEffect(() => {
    setTData(data || [])
    setLevel1(dataLevel1 || [])
    setLevel2(dataLevel2 || [])
    // setOpenLevel1([]) // ← закриті за замовчуванням
    // setOpenLevel2([]) // ← закриті за замовчуванням
  }, [data, dataLevel2, dataLevel1])

  // Після переміщення і оновлення даних прокручуємо до активної теми
  useEffect(() => {
    if (!scrollToActiveRef.current || activeTopicId == null) return
    scrollToActiveRef.current = false
    const row = tableContainerRef.current?.querySelector(`tr[data-topic-id="${activeTopicId}"]`)
    if (row) row.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [level1])

  useEffect(() => {
    if (!scrollToActiveSectionRef.current || activeSectionId == null) return
    scrollToActiveSectionRef.current = false
    const row = tableContainerRef.current?.querySelector(`tr[data-section-id="${activeSectionId}"]`)
    if (row) row.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [level2])

  // Прокрутка до слова, яке щойно перемістили
  useEffect(() => {
    if (scrollToWordRef.current == null) return
    const id = scrollToWordRef.current
    scrollToWordRef.current = null
    const row = tableContainerRef.current?.querySelector(`tr[data-id="${id}"]`)
    if (row) row.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [tData])

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
  const clearHighlights = () => {
    setActiveTopicId(null)
    setActiveSectionId(null)
    setActiveGroup(null)
  }
  const toggleSelect = (id) => {
    clearHighlights()
    // Поки відкрите віконце переміщення, виділення перемикається на одне слово
    if (wordMoveOpen) {
      const w = tData.find((x) => x.id === id)
      const wasSelected = selectedIds.includes(id)
      setSelectedIds(wasSelected ? [] : [id])
      setActiveGroup(w && !wasSelected ? { topicId: w[level1Id], key: keyOf(w) } : null)
      setWordMoveError("")
      return
    }
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

  const toggleSelectTopic = (id) => {
     clearHighlights()
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
    clearHighlights()
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

  // ── Переміщення слова (групи group_key) вгору/вниз у межах теми ──
  const keyOf = (w) => w.group_key || String(w.id)

  const getWordMoveInfo = (word) => {
    const topicWords = tData
      .filter((w) => w[level1Id] === word[level1Id])
      .sort((a, b) => (a.pn ?? 0) - (b.pn ?? 0) || a.id - b.id)
    const groups = [...new Set(topicWords.map(keyOf))]
    const idx = groups.indexOf(keyOf(word))
    return { topicWords, groups, idx }
  }

  const moveWord = async (dir) => {
    if (!onSavePn || selectedIds.length !== 1) return
    const word = tData.find((w) => w.id === selectedIds[0])
    if (!word) return
    setWordMoveError("")
    const { topicWords, groups, idx } = getWordMoveInfo(word)
    const j = idx + dir
    if (idx < 0 || j < 0 || j >= groups.length) return

    const ng = [...groups]
    ;[ng[idx], ng[j]] = [ng[j], ng[idx]]

    const byKey = new Map()
    for (const w of topicWords) {
      const k = keyOf(w)
      if (!byKey.has(k)) byKey.set(k, [])
      byKey.get(k).push(w)
    }

    let pn = 1
    const newPn = new Map()
    const changed = []
    for (const k of ng) {
      for (const w of byKey.get(k)) {
        newPn.set(w.id, pn)
        if (w.pn !== pn) changed.push({ id: w.id, pn })
        pn++
      }
    }

    const prev = tData
    const next = tData
      .map((w) => (newPn.has(w.id) ? { ...w, pn: newPn.get(w.id) } : w))
      .sort((a, b) => (a.pn ?? 0) - (b.pn ?? 0) || a.id - b.id)

    setTData(next)
    setActiveGroup({ topicId: word[level1Id], key: keyOf(word) })
    scrollToWordRef.current = word.id
    try {
      await onSavePn(changed)
    } catch (e) {
      scrollToWordRef.current = null
      setTData(prev)
      setWordMoveError("Помилка збереження порядку: " + (e.message || ""))
    }
  }

  // ── Переміщення теми вгору/вниз у межах свого розділу ──
  const menuSiblings =
    menuModal?.type === "topic"
      ? level1.filter((t) => t[level2Id] === menuModal.item[level2Id])
      : menuModal?.type === "section"
        ? level2
        : []
  const menuIdx = menuSiblings.findIndex((t) => t.id === menuModal?.item.id)

  const moveTopic = async (topic, dir) => {
    if (!onMoveTopic) return
    const siblings = level1.filter((t) => t[level2Id] === topic[level2Id])
    const i = siblings.findIndex((t) => t.id === topic.id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= siblings.length) return
    const arr = [...siblings]
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    setMoveError("")
    setActiveTopicId(topic.id)
    scrollToActiveRef.current = true
    try {
      await onMoveTopic(arr.map((t, k) => ({ id: t.id, pn: k + 1 })))
    } catch (e) {
      scrollToActiveRef.current = false
      setMoveError(e.message || "Помилка збереження порядку")
    }
  }

  const moveSection = async (section, dir) => {
    if (!onMoveSection) return
    const i = level2.findIndex((s) => s.id === section.id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= level2.length) return
    const arr = [...level2]
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    setMoveError("")
    setActiveSectionId(section.id)
    scrollToActiveSectionRef.current = true
    try {
      await onMoveSection(arr.map((s, k) => ({ id: s.id, pn: k + 1 })))
    } catch (e) {
      scrollToActiveSectionRef.current = false
      setMoveError(e.message || "Помилка збереження порядку")
    }
  }

  // ── Рендер групи level1 ───────────────────────────────────────────────────
  const renderTopic = (topic, topicWords) => {
    const topicWordIds = topicWords.map((w) => w.id)
    const selectedCount = topicWordIds.filter((id) => selectedIds.includes(id)).length
    const notTranslatedCount = topicWords.filter((w) => !w.word?.trim() || !w.translation?.trim()).length
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
          data-topic-id={topic.id}
          onClick={() => toggleLevel1(topic.id)}
          className="bg-tabTr1Bg dark:bg-tabTr1BgD cursor-pointer hover:bg-tabTr1BgHov"
          style={
            activeTopicId === topic.id
              ? { background: "rgba(245,158,11,0.55)", outline: "3px solid #f59e0b", outlineOffset: "-3px" }
              : undefined
          }
        >
          <td colSpan={showOwnerMark ? columns.length + 2 : columns.length} className="p-2 font-semibold">
            <div
              className="flex text-tabTr1On dark:text-tabTr1OnD hover:text-tabTr1OnHov items-center gap-2"
              style={{ userSelect: "none", cursor: "pointer" }}
            >
              {/* ☰ меню теми */}
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTopicId(topic.id)
                  setActiveSectionId(null)
                  setMoveError("")
                  setMenuModal({ type: "topic", item: topic })
                }}
                style={{ cursor: "pointer", fontSize: 16 }}
                title="Дії з темами"
              >
                ☰
              </span>
              {/* <span>{topicWords.length > 0 ? (openLevel1.includes(topic.id) ? " 🔽" : " ▶️") : ""}</span> */}
              <span>{topicWords.length > 0 ? (openLevel1.includes(topic.id) ? " ▼" : " ⮞") : ""}</span>
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSelectTopic(topic.id)
                }}
              >
                {topicWords.length > 1 ? (
                  <>
                    {checkbox} (📋{topicWords.length}
                    {selectedCount > 0 ? ` ✔️${selectedCount}` : ""}
                    {notTranslatedCount > 0 ? ` ❗${notTranslatedCount}` : ""})
                  </>
                ) : (
                  "  "
                )}
              </span>
              <span>
                {level1Head}: {topic.name}
              </span>
              {/* <span>{topicWords.length > 0 ? (openLevel1.includes(topic.id) ? " 🔽" : " ▶️") : ""}</span> */}
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
              isActive={!!activeGroup && activeGroup.topicId === item[level1Id] && activeGroup.key === keyOf(item)}
            />
          ))}
      </React.Fragment>
    )
  }

  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0)

  // функція, що збирає відмічені слова в порядку, як вони показані на екрані (секція → тема → pn)
  const getSelectedOrdered = () => {
    const sel = new Set(selectedIds)
    const result = []
    const pushTopic = (topic) => {
      tData
        .filter((w) => w[level1Id] === topic.id && sel.has(w.id))
        .sort((a, b) => (a.pn ?? 0) - (b.pn ?? 0))
        .forEach((w) => result.push(w))
    }
    if (level2?.length) {
      level2.forEach((sec) => level1.filter((t) => t[level2Id] === sec.id).forEach(pushTopic))
    } else if (level1?.length) {
      level1.forEach(pushTopic)
    } else {
      tData.filter((w) => sel.has(w.id)).forEach((w) => result.push(w))
    }
    return result
  }

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    // <main className="p-1 max-w-4xl mx-auto">
    <main className="p-1 max-w-7xl mx-auto">
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
            // const isOwner =
            //   user && selectedWord && (String(selectedWord.user_id) === String(user.id) || user.role === "admin")
            const isOwner = isOwnerOrAdmin(selectedWord)
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
                {onSavePn && (
                  <button
                    onClick={() => {
                      const w = tData.find((x) => x.id === selectedIds[0])
                      if (!w) return
                      setActiveGroup({ topicId: w[level1Id], key: keyOf(w) })
                      setWordMoveError("")
                      setWordMoveOpen(true)
                    }}
                    className="bg-btBg hover:opacity-70 text-white px-2 py-0.5 rounded-full font-medium"
                  >
                    🔀 Перемістити
                  </button>
                )}
              </>
            )
          })()}

        {/* БАГАТО ВИДІЛЕНИХ — видалити тільки свої (або всі якщо адмін) */}
        {onDelete &&
          selectedIds.length > 1 &&
          (() => {
            // const deletable = tData.filter(
            //   (w) => selectedIds.includes(w.id) && (String(w.user_id) === String(user?.id) || user?.role === "admin"),
            // )
            const deletable = tData.filter((w) => selectedIds.includes(w.id) && isOwnerOrAdmin(w))
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
        {/* Кнопка Слухати*/}
        {onPlay && selectedIds.length > 0 && (
          <button
            onClick={() => onPlay(getSelectedOrdered())}
            className="bg-btBg hover:opacity-70 text-white px-2 py-0.5 rounded-full font-medium"
          >
            ▶️ Слухати
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
            // background: message.includes("Помилка") ? "#fee2e2" : "#dcfce7",
            background: message.includes("Помилка") ? "#fee2e2" : "#f59e0b",
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
          //   className=" text-xs sm:text-sm lg:text-sm font-body"
        >
          <thead className="bg-tabThBg dark:bg-tabThBgD text-tabThOn dark:text-tabThOnD sticky top-0 z-10">
            <tr>
              {showOwnerMark && <th className="w-[30px] border border-tabThBorder dark:border-tabThBorderD p-1">☑️</th>}
              {showOwnerMark && <th className="w-[30px] border border-tabThBorder dark:border-tabThBorderD p-1">👤</th>}
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  style={{ width: col.width }}
                  className="border border-tabThBorder dark:border-tabThBorderD p-1"
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
                      data-section-id={section.id}
                      onClick={() => toggleLevel2(section.id)}
                      className="bg-tabTr2Bg dark:bg-tabTr2BgD cursor-pointer hover:bg-tabTr2BgHov "
                      style={
                        activeSectionId === section.id
                          ? { background: "rgba(245,158,11,0.55)", outline: "3px solid #f59e0b", outlineOffset: "-3px" }
                          : undefined
                      }
                    >
                      <td
                        colSpan={showOwnerMark ? columns.length + 2 : columns.length}
                        className="text-tabTr2On dark:text-tabTr2OnD hover:text-tabTr2OnHov p-2 font-bold"
                      >
                        <div className="flex items-center gap-2" style={{ userSelect: "none" }}>
                          {/* ☰ меню секції */}
                          <span
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveSectionId(section.id)
                              setActiveTopicId(null)
                              setMoveError("")
                              setMenuModal({ type: "section", item: section })
                            }}
                            style={{ cursor: "pointer", fontSize: 16 }}
                            title="Дії з секціями"
                          >
                            ☰
                          </span>
                          <span>
                            {sectionLevel1.length > 0 ? (openLevel2.includes(section.id) ? "🔽" : " ▶️") : ""}
                          </span>
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
                          <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                            {(() => {
                              const sel = countSelectedTopicsInSection(section.id)
                              return `(${sectionLevel1.length}${sel > 0 ? ` ✔️${sel}` : ""})`
                            })()}
                          </span>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                            {(() => {
                              const sectionWords = tData.filter((w) => sectionLevel1.some((t) => t.id === w[level1Id]))
                              const notFilled = sectionWords.filter(
                                (w) => !w.word?.trim() && !w.translate?.trim(),
                              ).length
                              const selected = sectionWords.filter((w) => selectedIds.includes(w.id)).length
                              return `(📋${sectionWords.length}${selected > 0 ? ` ✔️${selected}` : ""}${notFilled > 0 ? ` ❗${notFilled}` : ""})`
                            })()}
                          </span>
                          {section.is_private && <span title="Приватна">🔒</span>}
                          <span>
                            {level2Head}: {section.name}
                          </span>

                          {/* <span>
                            {sectionLevel1.length > 0 ? (openLevel2.includes(section.id) ? "🔽" : " ▶️") : ""}
                          </span> */}
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

      <MenuModal
        menuModal={menuModal}
        onClose={() => setMenuModal(null)}
        level1Head={level1Head}
        level2Head={level2Head}
        user={user}
        onMoveUp={
          !user || !menuModal
            ? null
            : menuModal.type === "topic" && onMoveTopic
              ? () => moveTopic(menuModal.item, -1)
              : menuModal.type === "section" && onMoveSection
                ? () => moveSection(menuModal.item, -1)
                : null
        }
        onMoveDown={
          !user || !menuModal
            ? null
            : menuModal.type === "topic" && onMoveTopic
              ? () => moveTopic(menuModal.item, 1)
              : menuModal.type === "section" && onMoveSection
                ? () => moveSection(menuModal.item, 1)
                : null
        }
        positionText={menuModal && menuIdx >= 0 ? `Позиція ${menuIdx + 1} з ${menuSiblings.length}` : ""}
        moveError={moveError}
        canMoveUp={menuIdx > 0}
        canMoveDown={menuIdx >= 0 && menuIdx < menuSiblings.length - 1}
        onAdd={
          menuModal
            ? menuModal.type === "section"
              ? onAddSection
                ? () => onAddSection()
                : null
              : onAddTopic // 👈 для теми — додати тему в секцію
                ? () => onAddTopic({ section_id: menuModal.item.id })
                : null
            : null
        }
        onEdit={
          menuModal
            ? menuModal.type === "section"
              ? onEditSection
                ? () => onEditSection(menuModal.item)
                : null
              : onEditTopic
                ? () => onEditTopic(menuModal.item)
                : null
            : null
        }
        onDelete={
          menuModal
            ? menuModal.type === "section"
              ? onDeleteSections
                ? () => onDeleteSections([menuModal.item])
                : null
              : onDeleteTopics
                ? () => onDeleteTopics([menuModal.item])
                : null
            : null
        }
      />
      {wordMoveOpen &&
        (() => {
          const mw = selectedIds.length === 1 ? tData.find((w) => w.id === selectedIds[0]) : null
          if (!mw) return null
          const { groups, idx } = getWordMoveInfo(mw)
          return (
            <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none">
              <div className="pointer-events-auto bg-white dark:bg-gray-800 rounded-t-xl shadow-2xl border-t-2 border-amber-400 p-4 w-full max-w-md flex flex-col gap-2">
                <p className="font-semibold text-sm text-center truncate">{mw.word || mw.translation}</p>
                <p className="text-center text-xs opacity-70">
                  Позиція {idx + 1} з {groups.length}
                </p>
                {wordMoveError && <p className="text-center text-xs text-red-600">{wordMoveError}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={() => moveWord(-1)}
                    disabled={idx <= 0}
                    className="flex-1 px-4 py-2 rounded-lg bg-btBg text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-70"
                  >
                    ⬆️ Вище
                  </button>
                  <button
                    onClick={() => moveWord(1)}
                    disabled={idx < 0 || idx >= groups.length - 1}
                    className="flex-1 px-4 py-2 rounded-lg bg-btBg text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-70"
                  >
                    ⬇️ Нижче
                  </button>
                </div>
                <button
                  onClick={() => setWordMoveOpen(false)}
                  className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Закрити
                </button>
              </div>
            </div>
          )
        })()}
      <ViewModal viewModal={viewModal} onClose={() => setViewModal(null)} />
    </main>
  )
}
