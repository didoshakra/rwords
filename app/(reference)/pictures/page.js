// pictures/page.js
//До multiple upload додано preview картинки та автопідстановку title
"use client"

import React, { useEffect, useState, useTransition, useRef } from "react"

import { useSession } from "next-auth/react"
import TableView from "@/app/components/tables/TableView"
import CustomDialog from "@/app/components/dialogs/CustomDialog"
import { useAuth } from "@/app/context/AuthContext" //Чи вхід з додатку
import { getSections } from "@/app/actions/pictures/picturesSectionActions"
import { getTopics } from "@/app/actions/pictures/picturesTopicActions"
import { getPictures, createPicture, updatePicture, deletePictures } from "@/app/actions/pictures/picturesActions"
import { createPictureFromFile } from "@/app/actions/pictures/picturesActions"

function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 min-w-[320px] max-h-[90vh] overflow-y-auto relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

//Для TableView
const columns = [
  //   {
  //     label: "№п",
  //     accessor: "pn",
  //     type: "integer",
  //     width: 50,
  //     styleCell: { alignItems: "center" },
  //     markIfOwner: true, // 🚀 нове поле
  //   },
  //   {
  //     label: "Зн",
  //     accessor: "know",
  //     type: "boolean",
  //     type: "know",
  //     width: 50,
  //     styleCell: { alignItems: "center" },
  //     styleCellText: { color: "red" },
  //   },
  {
    label: "Назва картини",
    accessor: "pictures_name",
    type: "text",
    width: 250,
    // styleCellText: { fontWeight: 600 },
  },
  {
    label: "Title", //внутрішня назва (для адмінки)
    accessor: "title",
    type: "text",
    width: 250,
    // styleCellText: { fontWeight: 600 },
  },

  {
    label: "Назва файлу",
    accessor: "file_name",
    type: "text",
    width: 250,
    // styleCellText: { fontWeight: 600 },
  },
  { label: "url", accessor: "url", type: "text", width: 250 },
  // Формат -- webp / jpg / png
  { label: "Формат файлу", accessor: "format", type: "text", width: 250 },
  {
    label: "Ширина",
    accessor: "width",
    type: "integer",
    width: 50,
    styleCell: { alignItems: "center" },
  },
  {
    label: "Висота",
    accessor: "height",
    type: "integer",
    width: 50,
    styleCell: { alignItems: "center" },
  },
  {
    label: "Хмара (bytes)",
    accessor: "bytes",
    type: "integer",
    width: 50,
    styleCell: { alignItems: "center" },
  },
  {
    label: "Оригінал (bytes)",
    accessor: "original_bytes",
    type: "integer",
    width: 50,
    styleCell: { alignItems: "center" },
  },
  //   {
  //     label: "№t",
  //     accessor: "topic_pn",
  //     type: "integer",
  //     width: 50,
  //     styleCell: { alignItems: "center" },
  //   },

  //   {
  //     label: "id",
  //     accessor: "id",
  //     type: "integer",
  //     width: 60,
  //     styleCell: { alignItems: "center" },
  //     //   styleCellText: {color: 'green'},
  //   },
  //   {
  //     label: "Tid",
  //     accessor: "topic_id",
  //     type: "integer",
  //     width: 40,
  //     styleCell: { alignItems: "center" },
  //   },
]
const normalizeName = (name = "") => name.toLowerCase().replace(/\.[^/.]+$/, "")

export default function PicturesPage() {
  // prors
  const { isFromApp } = useAuth() //Чи вхід з додатку
  const { data: session, status } = useSession()
  const user = session?.user
  const [sections, setSections] = useState([])
  const [topics, setTopics] = useState([])
  const [pictures, setPictures] = useState([])

  const [modal, setModal] = useState(null) // null | {type, picture}
  const [id, setId] = useState(null)
  const [section_id, setSectionId] = useState("")
  const [topic_id, setTopicId] = useState("")
  const [pn, setPn] = useState("")
  const [pictures_name, setPicturesName] = useState("")
  const [title, setTitle] = useState("")
  const [file_name, setFileName] = useState("")
  const [url, setUrl] = useState("")
  const [format, setFormat] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [bytes, setBytes] = useState("")
  //   const [know, setKnow] = useState(false)
  const [message, setMessage] = useState("") //Для повідомлення
  const [isPending, startTransition] = useTransition() // isPending	Показати loader / disabled//
  // Стани для перекладу (useState та useRef)
  //   const [translate, setTranslate] = useState(false)
  //   const stopRequested = useRef(false)
  //   const translatedCountRef = useRef(0)
  const [actionsOk, setActionsOk] = useState(false) //Для успішноговиконання акцій(delete)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogConfig, setDialogConfig] = useState({})
  //   стани для preview картинки і автопідстановка title
  const [selectedFiles, setSelectedFiles] = useState([]) //для preview + progress.
  const [isUploading, setIsUploading] = useState(false) //ЗАГАЛЬНИЙ LOADER

  useEffect(() => {
    loadPictures()
    loadTopics()
    loadSections()
  }, [])

  //   Автопідстановка title і pictures_name при виборі одного файлу
  useEffect(() => {
    if (selectedFiles.length === 1) {
      setTitle(selectedFiles[0].title || "")
      setPicturesName(selectedFiles[0].pictures_name || "")
    }

    if (selectedFiles.length !== 1) {
      setTitle("")
      setPicturesName("")
    }
  }, [selectedFiles])

  const loadPictures = () => {
    getPictures()
      .then(setPictures)
      .catch((err) => setMessage("Помилка: " + err.message))
  }

  const loadTopics = () => {
    getTopics()
      .then(setTopics)
      .catch(() => setTopics([]))
  }
  const loadSections = () => {
    getSections()
      .then(setSections)
      .catch(() => setSections([]))
  }

  const getHeightSuggestions = (w) => {
    if (!w) return []
    const width = Number(w)
    return [
      Math.round((width * 9) / 16), // 16:9
      Math.round(width), // 1:1
      Math.round((width * 3) / 4), // 4:3
      Math.round((width * 2) / 3), // 3:2
    ].filter((h, i, arr) => arr.indexOf(h) === i && h > 0) // видалюємо дублікати
  }

  const openAddModal = () => {
    console.log("🔴 openAddModal з PICTURES")
    setId(null)
    setSectionId("")
    setTopicId("")
    setPn("0")
    setPicturesName("")
    setTitle("")
    setFileName("")
    setUrl("")
    setFormat("")
    setWidth("")
    setHeight("")
    setBytes("")
    setModal({ type: "add" })
    setMessage("")
  }

  const openEditModal = (w) => {
    setId(w.id)
    // Знаходимо section_id з topic
    const topic = topics.find((t) => t.id === w.topic_id)
    setSectionId(topic?.pictures_sections_id?.toString() || "")
    setTopicId(w.topic_id.toString())
    setPn(w.pn.toString())
    setPicturesName(w.pictures_name || "")
    setTitle(w.title || "")
    setFileName(w.file_name || "")
    setUrl(w.url || "")
    setFormat(w.format || "")
    setWidth(w.width || "")
    setHeight(w.height || "")
    setBytes(w.bytes || "")
    setModal({ type: "edit", picture: w })
    setMessage("")
  }

  const closeModal = () => {
    setModal(null)
    setId(null)
    setSectionId("")
    setTopicId("")
    setPicturesName("")
    setTitle("")
    setFileName("")
    setUrl("")
    setFormat("")
    setWidth("")
    setHeight("")
    setBytes("")
    setMessage("")
    selectedFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl))
    setSelectedFiles([])
  }


const handleSubmit = async (e) => {
  e.preventDefault()
  if (!user) return setMessage("Потрібна авторизація")
  if (!section_id) return setMessage("Оберіть автора")
  if (!topic_id) return setMessage("Оберіть тему")

  setIsUploading(true)
  setMessage("")

  const data = {
    pictures_name: pictures_name.trim(),
    title: title.trim(),
    topic_id: Number(topic_id),
    pn: pn ? Number(pn) : 0,
    file: selectedFiles.length === 1 ? selectedFiles[0].file : null, // для додавання файлу
  }

  startTransition(async () => {
    try {
      if (modal?.type === "edit") {
        await updatePicture(id, data, user?.id, user?.role)
        setMessage("запис оновлена")
      } else {
        // Додавання одного або кількох файлів
        for (const item of selectedFiles) {
          await createPictureFromFile({
            file: item.file,
            pictures_name: item.pictures_name.trim(),
            title: item.title?.trim() || item.pictures_name.trim(),
            topic_id: Number(topic_id),
            user_id: user.id,
          })
        }
        setMessage(`Завантажено ${selectedFiles.length} файлів`)
      }

      closeModal()
      loadPictures()
    } catch (err) {
      setMessage("Помилка: " + err.message)
    } finally {
      setIsUploading(false)
      setSelectedFiles([])
    }
  })
}


  const handleDelete = (pictures) => {
    setDialogConfig({
      type: "delete",
      title: "Підтвердження видалення",
      message: `Ви впевнені, що хочете видалити ${pictures.length} записів?`,
      buttons: [
        { label: "Видалити", className: "bg-red-600 text-white" },
        { label: "Відмінити", className: "bg-gray-200" },
      ],
      picturesToDelete: pictures, // додатково, якщо треба передати дані
    })
    setDialogOpen(true)
  }

  const updatePNs = (updatedPictures) => {
    const newPictures = updatedPictures.map((w, i) => ({
      ...w,
      pn: i + 1, // оновлюємо pn
    }))
    setPictures(newPictures)
    setIsOrderChanged(true) // ⚠️ встановлюємо прапорець змін
  }

  //   const isOwnerOrAdmin = (w) => user && (user.role === "admin" || user.id === w.user_id)

  //   -------------------------------------------

  //функція для видалення вибраних слів
  const deleteSelected = async (selectedPictures) => {
    // console.log("pictures/deleteSelected0/selectedPictures=", selectedPictures)
    console.log("pictures/deleteSelected0/selectedPictures=", JSON.stringify(selectedPictures, null, 2))
    if (!user) {
      alert("Потрібна авторизація, щоб видаляти записи")
      return
    }
    console.log("pictures/deleteSelected1")

    // Визначаємо, які записи належать користувачу
    const ownPictures = selectedPictures.filter((w) => user.role === "admin" || w.user_id === user.id)
    const ownIds = ownPictures.map((w) => w.id)
    const othersCount = selectedPictures.length - ownPictures.length
    console.log("pictures/deleteSelected2")
    if (ownIds.length === 0) {
      // Нема своїх слів для видалення
      alert("Усі вибрані записи належать іншим користувачам. Видаляти нічого.")
      return
    }
    console.log("pictures/deleteSelected2")

    if (othersCount > 0) {
      const confirmed = confirm(
        `У виборі є ${othersCount} чужих записів. Видалити лише ваші (${ownIds.length})? Натисніть OK, щоб видалити свої, або Відмінити.`,
      )
      if (!confirmed) return
    }

    console.log("pictures/deleteSelected2")
    try {
      console.log("pictures/deleteSelected3/deletePictures")
      await deletePictures(ownIds, user?.id, user?.role)
      setMessage(`🗑️ Видалено ${ownIds.length} записів`)
      //   clearSelection()
      setActionsOk(true)
      loadPictures()
    } catch (err) {
      setMessage("Помилка при видаленні: " + err.message)
    }
  }

  //функція для обробки результату діалогу
  const handleDialogResult = (index) => {
    setDialogOpen(false)
    if (dialogConfig.type === "delete") {
      if (index === 0) {
        // Видалити
        startTransition(async () => {
          try {
            await deleteSelected(dialogConfig.picturesToDelete)
            setMessage(`🗑️ Видалено ${dialogConfig.picturesToDelete.length} записів`)
            loadPictures()
          } catch (err) {
            setMessage("Помилка: " + err.message)
          }
        })
      }
      // index === 1 — Відмінити
    }
    // Додавай інші типи діалогів за потреби
  }
  return (
    <main className="p-1 max-w-4xl mx-auto">
      {/* {topics.length > 0 && sections.length > 0 && ( */}
      <TableView
        data={pictures}
        dataLevel1={topics}
        dataLevel2={sections}
        level1Id="topic_id"
        level2Id="pictures_sections_id"
        columns={columns}
        title={"Каталог медіа"}
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={handleDelete} // передаємо лише id
        level0Head="Каталог медіа"
        level1Head="Тема"
        level2Head="Автор"
        sortField={"pn"} //поле для порядку
        isPending={isPending} //ДЛя блокування кнопки
        message={message} //Для повідомлення
        setMessage={setMessage} //Для повідомлення
        actionsOk={actionsOk} //
        setActionsOk={setActionsOk}
      />

      {/* Вікно діалогу */}
      <Modal open={!!modal} onClose={closeModal}>
        <h2 className="text-lg font-semibold mb-4">{modal?.type === "edit" ? "Редагувати заппис" : "Додати запис"}</h2>
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
            <label htmlFor="section_id" className="block font-medium mb-1">
              Автор
            </label>
            <select
              id="section_id"
              value={section_id}
              onChange={(e) => {
                setSectionId(e.target.value)
                setTopicId("") // Скидаємо топік при зміні автора
              }}
              className="border p-2 rounded"
              required
            >
              <option value="">Оберіть автора</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="topic_id" className="block font-medium mb-1">
              Тема
            </label>
            <select
              id="topic_id"
              value={topic_id}
              onChange={(e) => setTopicId(e.target.value)}
              className="border p-2 rounded"
              required
              disabled={!section_id}
            >
              <option value="">Оберіть тему</option>
              {section_id &&
                topics
                  .filter((t) => t.pictures_sections_id?.toString() === section_id)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
            </select>
          </div>
          {/* Завантаження файлу картини */}
          {/* Вибір файлів з мультизавантаженням */}

          <div>
            <label className="block font-medium mb-1">Файли зображень</label>
            <input
              type="file"
              //   accept="image/*"
              accept="image/*,video/*"
              multiple
              className="border p-2 rounded w-full"
              onClick={(e) => {
                e.target.value = null // очищаємо input, щоб можна було вибрати ті самі файли знову
              }}
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                if (files.length === 0) return

                const newItems = []
                const skipped = []

                files.forEach((file) => {
                  const cleanName = normalizeName(file.name)

                  // шукаємо дублікати по всій БД
                  const duplicate = pictures.find((p) => normalizeName(p.file_name) === cleanName)

                  if (duplicate) {
                    skipped.push(
                      `${duplicate.topic_name || "Без теми"} / ${duplicate.pictures_name} / ${duplicate.file_name}`,
                    )
                    return
                  }

                  newItems.push({
                    file,
                    previewUrl: URL.createObjectURL(file),
                    pictures_name: cleanName,
                    title: cleanName,
                  })
                })

                if (skipped.length > 0) {
                  alert(`Ці файли вже є в БД і пропущені:\n${skipped.join("\n")}`)
                }

                // оновлюємо стан відкидючи знайдені дублікати в БД
                setSelectedFiles((prev) => {
                  prev.forEach((p) => URL.revokeObjectURL(p.previewUrl))
                  return newItems
                })

                // single-file автопідстановка
                if (selectedFiles.length === 1 && files.length === 1) {
                  setTitle(newItems[0].title)
                  setPicturesName(newItems[0].pictures_name)
                } else {
                  setTitle("")
                  setPicturesName("")
                }
              }}
            />
            {/* // Туповідомлення виводиться(не видно) */}
            Оригінальних файлів: {selectedFiles.length}
            {selectedFiles.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                {selectedFiles.map((item, i) => (
                  <div key={i} className="border rounded p-2 flex flex-col gap-2 relative">
                    <button
                      type="button"
                      onClick={() => {
                        const ok = confirm(`Видалити файл "${item.file.name}"?`)
                        if (!ok) return
                        // Оновлюємо стан, видаляючи вибраний файл
                        setSelectedFiles((prev) => {
                          URL.revokeObjectURL(item.previewUrl)
                          return prev.filter((_, idx) => idx !== i)
                        })
                      }}
                      className="absolute top-1 right-1 text-red-600 text-sm hover:text-red-800"
                    >
                      ✕
                    </button>

                    {/* <img src={item.previewUrl} alt="preview" className="h-32 object-contain mx-auto" /> */}
                    {item.file.type.startsWith("video/") ? (
                      <video src={item.previewUrl} className="h-32 object-contain mx-auto" controls />
                    ) : (
                      <img src={item.previewUrl} alt="preview" className="h-32 object-contain mx-auto" />
                    )}
                    <input
                      type="text"
                      value={item.pictures_name}
                      onChange={(e) => {
                        const value = e.target.value
                        setSelectedFiles((prev) =>
                          prev.map((f, idx) => (idx === i ? { ...f, pictures_name: value, title: value } : f)),
                        )
                      }}
                      className="border rounded p-1 text-xs"
                      placeholder="Назва картини"
                    />
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Зображення буде оптимізоване та конвертоване в WebP</p>
          </div>

          {(selectedFiles.length === 1 || modal?.type === "edit") && (
            <div>
              <label htmlFor="title" className="block font-medium mb-1">
                Тітл картини
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 rounded"
                required
              />
            </div>
          )}

          {(selectedFiles.length === 1 || modal?.type === "edit") && (
            <div>
              <label htmlFor="pictures_name" className="block font-medium mb-1">
                Назва картини
              </label>
              <input
                type="text"
                id="pictures_name"
                value={pictures_name}
                onChange={(e) => setPicturesName(e.target.value)}
                className="border p-2 rounded"
                required
              />
            </div>
          )}
          {/* //   Повідомлення про завантаження */}
          {isUploading && (
            <div className="text-sm text-blue-600 font-medium">⏳ Завантажується {selectedFiles.length} файлів…</div>
          )}
          {/*  */}
          <div className="flex gap-4 mt-2">
            <button
              type="submit"
              disabled={isUploading || (selectedFiles.length === 0 && modal?.type !== "edit")}
              className={`px-4 py-2 rounded transition-colors ${
                isUploading || (selectedFiles.length === 0 && modal?.type !== "edit")
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {modal?.type === "edit" ? "Оновити" : "Додати"}
            </button>
            <button type="button" onClick={closeModal} className="border px-4 py-2 rounded">
              Відмінити
            </button>
          </div>
        </form>
      </Modal>
      <CustomDialog
        open={dialogOpen}
        title={dialogConfig.title}
        message={dialogConfig.message}
        buttons={dialogConfig.buttons}
        onResult={handleDialogResult}
        onClose={() => setDialogOpen(false)}
      />
    </main>
  )
}
