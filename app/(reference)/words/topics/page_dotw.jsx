// topics/page.jsx
"use client"

import React, { useEffect, useState, useTransition } from "react"
import { getTopics, createTopic, updateTopic, deleteTopic } from "@/app/actions/words/topicActions"
import { getSections } from "@/app/actions/words/sectionActions" // Передбачається, що є ця функція для завантаження секцій
// import { useAuth } from "@/app/context/AuthContext"
import { useSession } from "next-auth/react"

function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 min-w-[320px] relative shadow-xl">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl">
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

export default function TopicsPage() {
  //   const { user } = useAuth()
  const { data: session, status } = useSession()
  const user = session?.user
  const [topics, setTopics] = useState([])
  const [sections, setSections] = useState([])
  const [modal, setModal] = useState(null) // null | {type, topic}
  const [id, setId] = useState(null)
  const [name, setName] = useState("")
  const [section_id, setSectionId] = useState("")
  const [pn, setPn] = useState("")
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    loadTopics()
    loadSections()
  }, [])

  const loadTopics = () => {
    getTopics()
      .then(setTopics)
      .catch((err) => setMessage("Помилка: " + err.message))
  }

  const loadSections = () => {
    getSections()
      .then(setSections)
      .catch(() => setSections([]))
  }

  const openAddModal = () => {
    setId(null)
    setName("")
    setPn("")
    setSectionId("")
    setModal({ type: "add" })
    setMessage("")
  }

  const openEditModal = (t) => {
    setId(t.id)
    setName(t.name)
    setPn(t.pn)
    setSectionId(t.section_id.toString())
    setModal({ type: "edit", topic: t })
    setMessage("")
  }

  const closeModal = () => {
    setModal(null)
    setId(null)
    setName("")
    setPn("")
    setSectionId("")
    setMessage("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!user) return setMessage("Потрібна авторизація")
    if (!name.trim()) return setMessage("Введіть назву")
    if (section_id === "") return setMessage("Оберіть секцію")
    if (pn === "") return setMessage("Введіть порядок")

    const data = {
      name: name.trim(),
      pn: Number(pn),
      section_id: Number(section_id),
    }

    startTransition(async () => {
      try {
        if (modal?.type === "edit") {
          await updateTopic(id, data, user)
          setMessage("Топік оновлено")
        } else {
          await createTopic(data, user.id)
          setMessage("Топік створено")
        }
        closeModal()
        loadTopics()
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  const handleDelete = (t) => {
    if (!confirm("Ви впевнені, що хочете видалити?")) return
    startTransition(async () => {
      try {
        await deleteTopic(t.id, user)
        setMessage("Видалено")
        loadTopics()
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  const isOwnerOrAdmin = (row) => user && (user.role === "admin" || user.id === row.user_id)

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Топіки</h1>

      {user && (
        <button onClick={openAddModal} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">
          ➕ Додати топік
        </button>
      )}

      {message && <p className="mb-4 text-green-700 font-medium">{message}</p>}

      <table className="w-full border border-gray-300 bg-white shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Назва</th>
            <th className="p-2 border">Порядок</th>
            <th className="p-2 border">Секція</th>
            <th className="p-2 border">Дії</th>
          </tr>
        </thead>
        <tbody>
          {topics.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="p-2 border">{t.id}</td>
              <td className="p-2 border">{t.name}</td>
              <td className="p-2 border">{t.pn}</td>
              <td className="p-2 border">{sections.find((s) => s.id === t.section_id)?.name || t.section_id}</td>
              <td className="p-2 border">
                {isOwnerOrAdmin(t) && (
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(t)} className="text-blue-600 hover:underline text-sm">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(t)} className="text-red-600 hover:underline text-sm">
                      🗑️
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={!!modal} onClose={closeModal}>
        <h2 className="text-lg font-semibold mb-4">{modal?.type === "edit" ? "Редагувати топік" : "Додати топік"}</h2>
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
            <label htmlFor="name" className="block font-medium mb-1">
              Назва
            </label>
            <input
              id="name"
              type="text"
              placeholder="Назва"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              required
            />
          </div>
          <div>
            <label htmlFor="section_id" className="block font-medium mb-1">
              Секція
            </label>
            <select
              id="section_id"
              value={section_id}
              onChange={(e) => setSectionId(e.target.value)}
              className="border p-2 rounded"
              required
            >
              <option value="">Оберіть секцію</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
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
