// /sections/page.jsx
"use client"

import React, { useEffect, useState, useTransition } from "react"
import { getSections, createSection, updateSection, deleteSection } from "@/app/actions/words/sectionActions"
import { useAuth } from "@/app/context/AuthContext"

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

export default function SectionsPage() {
  const { user } = useAuth()
  const [sections, setSections] = useState([])
  const [message, setMessage] = useState("")
  const [modal, setModal] = useState(null) // null | 'add' | { type: 'edit', section }
  const [name, setName] = useState("")
  const [img, setImg] = useState("")
  const [pn, setPn] = useState(0)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = () => {
    getSections()
      .then(setSections)
      .catch((err) => setMessage("Помилка: " + err.message))
  }

  const openAddModal = () => {
    setName("")
    setImg("")
    setPn(0)
    setModal("add")
    setMessage("")
  }

  const openEditModal = (section) => {
    setName(section.name)
    setImg(section.img)
    setPn(section.pn)
    setModal({ type: "edit", section })
    setMessage("")
  }

  const closeModal = () => {
    setModal(null)
    setName("")
    setImg("")
    setPn(0)
    setMessage("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return setMessage("Введіть назву")
    startTransition(async () => {
      try {
        if (!user) throw new Error("Потрібна авторизація")
        if (modal?.type === "edit") {
          await updateSection(modal.section.id, { name, img, pn }, user)
          setMessage("Секцію оновлено")
        } else {
          await createSection({ name, img, pn }, user.id)
          setMessage("Секцію додано")
        }
        closeModal()
        loadSections()
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  const handleDelete = (section) => {
    if (!confirm("Ви впевнені, що хочете видалити цю секцію?")) return
    startTransition(async () => {
      try {
        await deleteSection(section.id, user)
        setMessage("Секцію видалено")
        loadSections()
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  const isOwnerOrAdmin = (s) => user && (user.id === s.user_id || user.role === "admin")

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Секції</h1>

      {user && (
        <button onClick={openAddModal} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">
          ➕ Додати секцію
        </button>
      )}

      {message && <p className="mb-4 text-green-700 font-medium">{message}</p>}

      <table className="w-full border border-gray-300 bg-white shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Порядок</th>
            <th className="p-2 border">Назва</th>
            <th className="p-2 border">Зображення</th>
            <th className="p-2 border">Дії</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="p-2 border">{s.id}</td>
              <td className="p-2 border">{s.pn}</td>
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border">{s.img}</td>
              <td className="p-2 border">
                {isOwnerOrAdmin(s) && (
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(s)} className="text-blue-600 hover:underline text-sm">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(s)} className="text-red-600 hover:underline text-sm">
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
        <h2 className="text-lg font-semibold mb-4">{modal?.type === "edit" ? "Редагувати секцію" : "Додати секцію"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Назва"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Зображення"
            value={img}
            onChange={(e) => setImg(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Порядок"
            value={pn}
            onChange={(e) => setPn(Number(e.target.value))}
            className="border p-2 rounded"
          />
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
