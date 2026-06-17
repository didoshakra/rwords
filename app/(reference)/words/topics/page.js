// topics/page.jsx
"use client"

import React, { useEffect, useState, useTransition } from "react"
import {
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  deleteTopics,
  checkTopicRelations,
} from "@/app/actions/words/topicActions"
import { getSections } from "@/app/actions/words/sectionActions" // Передбачається, що є ця функція для завантаження секцій
// import { useAuth } from "@/app/context/AuthContext"
import { useSession } from "next-auth/react"
import TableView from "@/app/components/tables/TableView"

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

//Для TableView
const columns = [
  { label: "Тема", accessor: "name", type: "text", width: 400 },
//   {
//     label: "№п",
//     accessor: "pn",
//     type: "integer",
//     width: 50,
//     styleCell: { alignItems: "center" },
//     //   styleCellText: {color: 'green'},
//     markIfOwner: true, // 🚀 нове поле
//   },

//   {
//     label: "Tid",
//     accessor: "id",
//     type: "integer",
//     width: 40,
//     styleCell: { alignItems: "center" },
//   },
]

export default function TopicsPage() {
  //   const { isFromApp } = useAuth()
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
  const [actionsOk, setActionsOk] = useState(false) //Для успішноговиконання акцій(delete)

  useEffect(() => {
    loadTopics()
    loadSections()
    // console.log("topics/Topics=", topics)
    // console.log("topics/Sections=", sections)
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
    console.log("topics/handleDelete/t=", t)
    if (!confirm(`Ви впевнені, що хочете видалити ${t.length} тем?`)) return

    startTransition(async () => {
      try {
        // await deleteTopic(t.id, user)
        await deleteSelectedTopics(t) // ✅ вже масив
        setMessage("Видалено")
        loadTopics()
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }
  const handleThemeDownload = (t) => {
    console.log("topics/handleDelete/t=", t)
    if (!confirm(`Ви впевнені, що хочете завантажити ${t.length} тем?`)) return

    // startTransition(async () => {
    //   try {
    //     // await deleteTopic(t.id, user)
    //     await deleteSelectedTopics(t) // ✅ вже масив
    //     setMessage("Видалено")
    //     loadTopics()
    //   } catch (err) {
    //     setMessage("Помилка: " + err.message)
    //   }
    // })
  }

  const deleteSelectedTopics = async (selectedTopics) => {
    console.log("topics/deleteSelectedTopics/selectedTopics=", JSON.stringify(selectedTopics, null, 2))

    if (!user) {
      alert("Потрібна авторизація, щоб видаляти топіки")
      return
    }

    // 1️⃣ Фільтруємо свої топіки
    const ownTopics = selectedTopics.filter((t) => user.role === "admin" || t.user_id === user.id)
    const ownIds = ownTopics.map((t) => t.id)
    const othersCount = selectedTopics.length - ownTopics.length

    if (ownIds.length === 0) {
      alert("Усі вибрані топіки належать іншим користувачам. Видаляти нічого.")
      return
    }

    if (othersCount > 0) {
      const confirmed = confirm(`У виборі є ${othersCount} чужих топіків. Видалити лише ваші (${ownIds.length})?`)
      if (!confirmed) return
    }

    // 2️⃣ Перевіряємо наявність зв’язків
    try {
      const topicsWithRelations = await checkTopicRelations(ownIds)
      if (topicsWithRelations.length > 0) {
        const countWithRelations = topicsWithRelations.length
        const countWithoutRelations = ownIds.length - countWithRelations

        if (confirm(`⚠️ ${countWithRelations} топіків мають пов'язані записи. Видалити всі (${ownIds.length})?`)) {
          // нічого не змінюємо — видаляємо всі
        } else if (
          countWithoutRelations > 0 &&
          confirm(`Видалити тільки ті, що без зв'язків (${countWithoutRelations})?`)
        ) {
          // фільтруємо тільки без зв’язків
          ownIds.splice(0, ownIds.length, ...ownIds.filter((id) => !topicsWithRelations.includes(id)))
        } else {
          // користувач відмінив видалення
          return
        }
      }
    } catch (err) {
      setMessage("Помилка при перевірці зв'язків: " + err.message)
      return
    }

    // 3️⃣ Остаточне підтвердження
    const confirmed = confirm(`Видалити ${ownIds.length} топіків?`)
    if (!confirmed) return

    // 4️⃣ Видалення
    try {
      await deleteTopics(ownIds, user.id, user.role)
      setMessage(`🗑️ Видалено ${ownIds.length} топіків`)
      setActionsOk(true)
      loadTopics()
    } catch (err) {
      setMessage("Помилка при видаленні: " + err.message)
    }
  }

  //   const isOwnerOrAdmin = (row) => user && (user.role === "admin" || user.id === row.user_id)

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <TableView
        data={topics}
        dataLevel1={sections}
        level1Id="section_id"
        columns={columns}
        title={"Теми"}
        level0Head="Тема"
        level1Head="Група тем"
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={handleDelete} // передаємо лише id
        // onThemeDownload={isFromApp ? handleThemeDownload : undefined}
        sortField={"pn"} //поле для порядку
        isPending={isPending} //ДЛя блокування кнопки імпорт покийде імпорт
        message={message} //Для повідомлення
        setMessage={setMessage} //Для повідомлення
        actionsOk={actionsOk} //
        setActionsOk={setActionsOk}
      />

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
