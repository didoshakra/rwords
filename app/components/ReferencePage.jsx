//GPT/ Reference Crud Pages.jsx
// Створюємо універсальну компоненту ReferencePage.jsx
// Вона буде використовуватись у файлах: sections/page.jsx, topics/page.jsx, words/page.jsx

"use client"

import React, { useEffect, useState, useTransition } from "react"
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"
// import { useAuth } from "@/app/context/AuthContext"
import { useSession } from "next-auth/react"

// Модальне вікно
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

export default function ReferencePage({ title, fetchFn, createFn, updateFn, deleteFn, initialForm, columnsDef }) {
//   const { user } = useAuth()
   const { data: session, status } = useSession()
   const user = session?.user
  const [data, setData] = useState([])
  const [form, setForm] = useState(initialForm)
  const [modalOpen, setModalOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () =>
    fetchFn()
      .then(setData)
      .catch((err) => setMessage("Помилка: " + err.message))

  const isOwnerOrAdmin = (row) => {
    if (!user) return false
    return user.role === "admin" || user.id === row.user_id
  }

  const handleEdit = (row) => {
    if (!isOwnerOrAdmin(row)) return
    setForm(row)
    setModalOpen(true)
    setMessage("")
  }

  const handleDelete = (row) => {
    if (!isOwnerOrAdmin(row)) {
      setMessage("Недостатньо прав для видалення")
      return
    }

    if (!confirm("Ви впевнені, що хочете видалити цей запис?")) return
    startTransition(async () => {
      try {
        await deleteFn(row.id, user)
        setMessage("Запис видалено")
        loadData()
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!user?.id) {
      setMessage("Потрібна авторизація")
      return
    }

    startTransition(async () => {
      try {
        if (form.id) {
          await updateFn(form.id, form, user)
          setMessage("Запис оновлено")
        } else {
          await createFn(form, user.id)
          setMessage("Запис створено")
        }
        setForm(initialForm)
        setModalOpen(false)
        loadData()
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  const table = useReactTable({
    data,
    columns: [
      ...columnsDef,
      {
        id: "actions",
        header: "Дії",
        cell: ({ row }) =>
          user &&
          isOwnerOrAdmin(row.original) && (
            <div className="flex gap-2">
              <button onClick={() => handleEdit(row.original)} className="text-blue-600 hover:underline text-sm">
                ✏️
              </button>
              <button onClick={() => handleDelete(row.original)} className="text-red-600 hover:underline text-sm">
                🗑️
              </button>
            </div>
          ),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      {user && (
        <button
          onClick={() => {
            setForm(initialForm)
            setModalOpen(true)
            setMessage("")
          }}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Додати
        </button>
      )}

      {message && <p className="mb-4 text-green-700">{message}</p>}

      <table className="min-w-full border border-gray-300 bg-white shadow-sm rounded overflow-hidden">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th key={header.id} className="p-2 border text-left text-sm font-semibold">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 border text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Модалка */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-lg font-semibold mb-4">{form.id ? "Редагувати" : "Додати"} запис</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {Object.keys(initialForm).map((key) =>
            key !== "id" ? (
              key === "know" ? (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form[key] ?? false}
                    onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                  />
                  Знає
                </label>
              ) : (
                <input
                  key={key}
                  type={key === "pn" || key.endsWith("_id") ? "number" : "text"}
                  placeholder={key}
                  value={form[key] ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [key]: key === "pn" || key.endsWith("_id") ? Number(e.target.value) : e.target.value,
                    })
                  }
                  className="border p-2 rounded"
                />
              )
            ) : null
          )}
          <div className="flex gap-4 mt-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {form.id ? "Оновити" : "Додати"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(initialForm)
                setModalOpen(false)
              }}
              className="border px-4 py-2 rounded"
            >
              Відмінити
            </button>
          </div>
        </form>
      </Modal>
    </main>
  )
}
