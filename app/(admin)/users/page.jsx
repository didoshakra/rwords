// CL/app/(admin)/admin/users/page.jsx
"use client"

import React, { useEffect, useState, useTransition } from "react"
import { getUsers, createUser, updateUser, deleteUser } from "@/app/actions/userActions"
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"

function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          aria-label="Закрити"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

export default function UsersPage() {
  const [data, setData] = useState([])
  const [form, setForm] = useState({ id: null, name: "", email: "", profile: "" })
  const [modalOpen, setModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")

  const loadUsers = () =>
    getUsers()
      .then((users) => setData(users))
      .catch(console.error)

  useEffect(() => {
    loadUsers()
  }, [])

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Ім’я" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "profile", header: "Профіль" },
    { accessorKey: "created_at", header: "Створено" },
    {
      id: "actions",
      header: "Дії",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setForm(row.original)
              setModalOpen(true)
            }}
            className="text-blue-600 hover:underline text-sm"
          >
            ✏️
          </button>
          <button onClick={() => handleDelete(row.original.id)} className="text-red-600 hover:underline text-sm">
            🗑️
          </button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage("")

    startTransition(async () => {
      try {
        if (form.id) {
          await updateUser(form.id, form.name, form.email, form.profile)
          setMessage("Користувача оновлено")
        } else {
          await createUser(form.name, form.email, form.profile)
          setMessage("Користувача створено")
        }
        setForm({ id: null, name: "", email: "", profile: "" })
        setModalOpen(false)
        await loadUsers()
      } catch (err) {
        console.error(err)
        setMessage("Помилка: " + err.message)
      }
    })
  }

  const handleDelete = (id) => {
    if (!confirm("Ви впевнені, що хочете видалити цього користувача?")) return

    startTransition(async () => {
      try {
        await deleteUser(id)
        setMessage("Користувача видалено")
        await loadUsers()
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Користувачі</h1>

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => {
            setForm({ id: null, name: "", email: "", profile: "" })
            setModalOpen(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Додати
        </button>
      </div>

      <table className="min-w-full border border-gray-300 shadow-sm rounded overflow-hidden">
        <thead className="bg-gray-100 text-sm">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th key={header.id} className="p-2 border text-left">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="text-sm">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 border">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {message && <p className="mt-4 text-green-700 text-center">{message}</p>}

      {/* 🔽 Модальне вікно */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">{form.id ? "Редагувати" : "Новий користувач"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Ім’я"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Профіль"
            value={form.profile}
            onChange={(e) => setForm({ ...form, profile: e.target.value })}
            className="border p-2 rounded"
          />
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {form.id ? "Оновити" : "Додати"}
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded border border-gray-400"
            >
              Скасувати
            </button>
          </div>
        </form>
      </Modal>
    </main>
  )
}
