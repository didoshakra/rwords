// components/modals/ImportTextModal.jsx
// Використання в words/page.js:
//
// import ImportTextModal from "@/app/components/modals/ImportTextModal"
//
// Додати стан:
//   const [importTextOpen, setImportTextOpen] = useState(false)
//
// Додати в JSX:
//   <button onClick={() => setImportTextOpen(true)}>📋 Імпорт тексту</button>
//   <ImportTextModal
//     open={importTextOpen}
//     onClose={() => setImportTextOpen(false)}
//     sections={sections}
//     userId={user?.id}
//     onSuccess={() => { loadWords(); loadTopics(); loadSections(); }}
//   />

"use client"

import { useState, useTransition } from "react"
import { importCSV } from "@/app/actions/words/wordActions"

function splitIntoSentences(text) {
  const protected_text = text
    .replace(/\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|vs|etc|i\.e|e\.g)\./gi, "$1<DOT>")
    .replace(/\b([A-Z])\./g, "$1<DOT>")

  const raw = protected_text.split(/(?<=[.!?…])\s+(?=\S)/)

  return raw.map((s) => s.replace(/<DOT>/g, ".").trim()).filter((s) => s.length > 15)
}

function buildCSVText(sectionName, topicName, sentences) {
  return [sectionName.trim(), topicName.trim(), ...sentences.map((s) => `${s};`)].join("\n")
}

export default function ImportTextModal({ open, onClose, sections = [], userId, onSuccess }) {
  const [sectionId, setSectionId] = useState("")
  const [topicName, setTopicName] = useState("")
  const [text, setText] = useState("")
  const [sentences, setSentences] = useState(null)
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()

  if (!open) return null

  const selectedSection = sections.find((s) => s.id?.toString() === sectionId)

  const handleSplit = () => {
    setMessage("")
    if (!sectionId) {
      setMessage("❌ Оберіть секцію")
      return
    }
    if (!topicName.trim()) {
      setMessage("❌ Введіть назву теми")
      return
    }
    if (!text.trim()) {
      setMessage("❌ Вставте текст")
      return
    }

    const result = splitIntoSentences(text)
    if (!result.length) {
      setMessage("❌ Не вдалося розбити на речення")
      return
    }

    setSentences(result)
    setMessage(`✅ Розбито на ${result.length} речень`)
  }

  const handleRemove = (idx) => {
    setSentences((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleImport = () => {
    if (!sentences?.length) return
    if (!selectedSection) return

    const csvText = buildCSVText(selectedSection.name, topicName, sentences)

    startTransition(async () => {
      try {
        const result = await importCSV(csvText, userId)
        setMessage("✅ " + result)
        onSuccess?.()
        // Скидаємо форму після успіху
        setTimeout(() => {
          handleClose()
        }, 1500)
      } catch (err) {
        setMessage("❌ " + (err.message || "Помилка імпорту"))
      }
    })
  }

  const handleClose = () => {
    setSectionId("")
    setTopicName("")
    setText("")
    setSentences(null)
    setMessage("")
    onClose()
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          maxHeight: "92vh",
          overflowY: "auto",
          background: "white",
          borderRadius: "16px 16px 0 0",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>📋 Імпорт тексту</h2>
          <button
            onClick={handleClose}
            style={{ fontSize: 22, background: "none", border: "none", cursor: "pointer", color: "#888" }}
          >
            ✕
          </button>
        </div>

        {/* Секція — випадаючий список */}
        <div>
          <label style={lbl}>Секція</label>
          <select value={sectionId} onChange={(e) => setSectionId(e.target.value)} style={inp}>
            <option value="">— Оберіть секцію —</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Тема — нова назва */}
        <div>
          <label style={lbl}>Тема (нова назва)</label>
          <input
            style={inp}
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            placeholder="Наприклад: BBC News 23.05.2026"
          />
        </div>

        {/* Textarea тексту */}
        <div>
          <label style={lbl}>Текст</label>
          <textarea
            style={{ ...inp, minHeight: 140, resize: "vertical" }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Вставте текст тут..."
          />
        </div>

        {/* Кнопка розбивки */}
        <button style={{ ...btn, background: "#3b82f6", color: "#fff" }} onClick={handleSplit} disabled={isPending}>
          ✂️ Розбити на речення
        </button>

        {/* Повідомлення */}
        {message && <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>{message}</p>}

        {/* Preview речень */}
        {sentences && (
          <>
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                maxHeight: 280,
                overflowY: "auto",
                padding: 8,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {sentences.map((sentence, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 6,
                    padding: "5px 6px",
                    borderRadius: 6,
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <span style={{ fontSize: 11, color: "#9ca3af", minWidth: 22, paddingTop: 2 }}>{idx + 1}</span>
                  <span style={{ flex: 1, fontSize: 13, lineHeight: 1.5, color: "#111827" }}>{sentence}</span>
                  <button
                    onClick={() => handleRemove(idx)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#ef4444",
                      fontSize: 13,
                      padding: "2px 4px",
                      flexShrink: 0,
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Кнопки дій */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                style={{ ...btn, background: "#22c55e", color: "#fff", flex: 1 }}
                onClick={handleImport}
                disabled={isPending || !sentences.length}
              >
                {isPending ? "⏳ Імпортую..." : `⬇ Імпортувати (${sentences.length})`}
              </button>
              <button
                style={{ ...btn, background: "#e5e7eb", color: "#374151" }}
                onClick={handleClose}
                disabled={isPending}
              >
                Відмінити
              </button>
            </div>
          </>
        )}

        {/* Якщо preview ще немає — тільки Відмінити */}
        {!sentences && (
          <button style={{ ...btn, background: "#e5e7eb", color: "#374151" }} onClick={handleClose}>
            Відмінити
          </button>
        )}
      </div>
    </div>
  )
}

const lbl = { display: "block", fontSize: 13, color: "#6b7280", marginBottom: 4 }
const inp = {
  width: "100%",
  padding: "10px 12px",
  fontSize: 14,
  borderRadius: 8,
  border: "1px solid #ccc",
  boxSizing: "border-box",
  outline: "none",
}
const btn = { padding: "11px 16px", fontSize: 14, borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600 }
