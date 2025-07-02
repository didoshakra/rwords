//CL/blog/BlogPage
"use client"

import React, { useEffect, useState, useTransition } from "react"
import { getPosts, createPost, deletePost, updatePost } from "@/app/actions/blogActions"
import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"

// Проста модалка
function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded shadow-lg p-6 min-w-[320px] relative max-w-md w-full">
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

export default function BlogPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()
  const [modal, setModal] = useState(null) // null | 'add' | {type:'edit', post}

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const loadPosts = () => {
    getPosts()
      .then(setPosts)
      .catch((err) => setMessage("Помилка при завантаженні постів: " + err.message))
  }

  useEffect(() => {
    loadPosts()
  }, [])

  // Відкриття модалки для додавання
  const openAddModal = () => {
    setTitle("")
    setContent("")
    setModal("add")
    setMessage("")
  }

  // Відкриття модалки для редагування
  const openEditModal = (post) => {
    setTitle(post.title)
    setContent(post.content)
    setModal({ type: "edit", post })
    setMessage("")
  }

  // Закриття модалки
  const closeModal = () => {
    setModal(null)
    setTitle("")
    setContent("")
    setMessage("")
  }

  // Додавання/редагування поста
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setMessage("Заповніть заголовок та текст посту")
      return
    }
    setMessage("")
    startTransition(async () => {
      try {
        if (modal && modal.type === "edit") {
          await updatePost(modal.post.id, title, content)
          setMessage("Пост оновлено!")
        } else {
          await createPost(user.id, title, content)
          setMessage("Пост успішно додано!")
        }
        closeModal()
        loadPosts()
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  // Видалення поста
  const handleDelete = (id) => {
    if (!confirm("Ви впевнені, що хочете видалити цей пост?")) return
    startTransition(async () => {
      try {
        await deletePost(id)
        setMessage("Пост видалено!")
        loadPosts()
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  return (
    <main className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Блог</h1>

      <div className="mb-6 flex justify-between items-center">
        <span className="font-semibold text-lg">Пости:</span>
        {user && (
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white px-4 py-2 rounded"
          >
            Додати пост
          </button>
        )}
      </div>

      {message && <p className="mb-4 text-green-700 font-medium">{message}</p>}

      {posts.length === 0 && <p>Наразі немає постів.</p>}

      <ul className="space-y-6">
        {posts.map((post) => (
          <li
            key={post.id}
            className="bg-white rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-300 p-4 flex justify-between items-center"
          >
            <Link href={`/blog/${post.id}`}>
              <span className="text-blue-700 hover:underline cursor-pointer font-semibold text-lg">{post.title}</span>
            </Link>

            {user && (user.id === post.user_id || user.role === "admin") && (
              <div className="flex gap-3">
                <button
                  onClick={() => openEditModal(post)}
                  className="text-blue-600 hover:underline text-sm"
                  type="button"
                >
                  Редагувати
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:underline text-sm"
                  type="button"
                >
                  Видалити
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Модалка для додавання/редагування */}
      <Modal open={modal === "add" || (modal && modal.type === "edit")} onClose={closeModal}>
        <h2 className="text-xl font-bold mb-4">{modal && modal.type === "edit" ? "Редагувати пост" : "Додати пост"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <textarea
            placeholder="Текст посту"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 rounded"
            rows={5}
            required
          />
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white px-4 py-2 rounded"
            >
              {isPending
                ? modal && modal.type === "edit"
                  ? "Оновлюємо..."
                  : "Додаємо..."
                : modal && modal.type === "edit"
                ? "Оновити пост"
                : "Додати пост"}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100 transition-colors duration-150"
            >
              Відмінити
            </button>
          </div>
        </form>
      </Modal>
    </main>
  )
}
