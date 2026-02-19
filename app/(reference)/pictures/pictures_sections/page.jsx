// /pictures/pictures_sections/page.jsx
"use client"

import React, { useEffect, useState, useTransition } from "react"
import {
  getSections,
  createSection,
  updateSection,
  deleteSection,
  deleteSections,
} from "@/app/actions/pictures/picturesSectionActions"
// import { useAuth } from "@/app/context/AuthContext"
import TableView from "@/app/components/tables/TableView"
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

export default function SectionsPage() {
  const { data: session, status } = useSession()
  const user = session?.user
  const [pictureSections, setPictureSections] = useState([])
  const [message, setMessage] = useState("")
  const [modal, setModal] = useState(null) // null | 'add' | { type: 'edit', section }
  const [name, setName] = useState("")
  const [pn, setPn] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [actionsOk, setActionsOk] = useState(false) //Для успішноговиконання акцій(delete)

  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = () => {
    getSections()
      .then(setPictureSections)
      .catch((err) => setMessage("Помилка: " + err.message))
  }

  const openAddModal = () => {
    setName("")
    setPn(0)
    setModal("add")
    setMessage("")
  }

  const openEditModal = (section) => {
    setName(section.name)
    setPn(section.pn)
    setModal({ type: "edit", section })
    setMessage("")
  }

  const closeModal = () => {
    setModal(null)
    setName("")
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
          await updateSection(modal.section.id, { name, pn }, user)
          setMessage("Секцію оновлено")
        } else {
          await createSection({ name, pn }, user.id)
          setMessage("Секцію додано")
        }
        closeModal()
        loadSections()
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  const handleDelete = (t) => {
    console.log("topics/handleDelete/t=", t)
    if (!confirm(`Ви впевнені, що хочете видалити ${t.length} секцій?`)) return

    startTransition(async () => {
      try {
        // t — це масив секцій, треба передати масив id
        const ids = t.map((s) => s.id)
        await deleteSections(ids, user.id, user.role)
        setMessage("Видалено")
        loadSections()
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  //Для TableView
  const columns = [
    {
      label: "№п",
      accessor: "pn",
      type: "integer",
      width: 50,
      styleCell: { alignItems: "center" },
      //   styleCellText: {color: 'green'},
      markIfOwner: true, // 🚀 нове поле
    },
    { label: "Автори", accessor: "name", type: "text", width: 250 },
    {
      label: "Sid",
      accessor: "id",
      type: "integer",
      width: 40,
      styleCell: { alignItems: "center" },
    },
  ]
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <TableView
        data={pictureSections}
        columns={columns}
        title={"Автори"}
        level0Head="Автори"
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={handleDelete} // передаємо обєкти
        sortField={"pn"} //поле для порядку
        isPending={isPending} //ДЛя блокування кнопки імпорт покийде імпорт
        message={message} //Для повідомлення
        setMessage={setMessage} //Для повідомлення
        actionsOk={actionsOk} //
        setActionsOk={setActionsOk}
      />

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
