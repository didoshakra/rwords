// app/blog/[id]/page.jsx
//Конкретний пост
"use client"

import { useEffect, useState, useTransition } from "react"
import { useParams } from "next/navigation"
import { getPost, addComment, updateComment, deleteComment } from "@/app/actions/blogActions"
// import { useAuth } from "@/app/context/AuthContext"
import { useSession } from "next-auth/react"

// Проста модалка для редагування коментаря
function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded shadow-lg p-6 min-w-[320px] relative">
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

export default function BlogPostPage() {
//   const { user } = useAuth()
   const { data: session, status } = useSession()
   const user = session?.user
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [content, setContent] = useState("")
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")

  // Для редагування коментаря
  const [editModal, setEditModal] = useState(null) // {id, content} | null
  const [editContent, setEditContent] = useState("")

  useEffect(() => {
    const loadPost = async () => {
      const { post, comments } = await getPost(id)
      setPost(post)
      setComments(comments)
    }
    loadPost()
  }, [id])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim()) return
    if (!user) {
      setMessage("Щоб додати коментар, будь ласка, увійдіть у свій акаунт.")
      return
    }
    setMessage("")
    startTransition(async () => {
      try {
        await addComment(id, user.id, content)
        setContent("")
        await loadPost()
        setMessage("Коментар додано!")
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  // Відкрити модалку редагування
  const openEditModal = (comment) => {
    setEditModal({ id: comment.id })
    setEditContent(comment.content)
  }

  // Закрити модалку редагування
  const closeEditModal = () => {
    setEditModal(null)
    setEditContent("")
  }

  // Зберегти редагований коментар
  const handleEditComment = (e) => {
    e.preventDefault()
    if (!editContent.trim()) return
    setMessage("")
    startTransition(async () => {
      try {
        await updateComment(editModal.id, editContent)
        setMessage("Коментар оновлено!")
        closeEditModal() // <-- закриваємо одразу після успіху
        await loadPost()
      } catch (err) {
        setMessage("Помилка: " + err.message)
        closeEditModal() // <-- закриваємо навіть при помилці (опціонально)
      }
    })
  }
  // Видалити коментар
  const handleDeleteComment = (commentId) => {
    if (!confirm("Видалити цей коментар?")) return
    startTransition(async () => {
      try {
        await deleteComment(commentId)
        setMessage("Коментар видалено!")
        await loadPost()
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  if (!post) return <p>Завантаження...</p>

  return (
    <main className="max-w-3xl mx-auto p-6 text-pText dark:text-pTextD">
      <h1 className="text-h1Text text-xl sm:text-2xl lg:text-3xl  font-bold mb-2">{post.title}</h1>
      <p className="mb-4 text-h2Text">Автор: {post.user_name || "Невідомо"}</p>
      <article className=" mb-8 whitespace-pre-wrap">{post.content}</article>

      <section>
        <h2 className="text-h1Text text-base sm:text-lg lg:text-xl font-semibold mb-2">Коментарі</h2>
        <ul className="mb-4 space-y-2">
          {comments.map((comment) => {
            const canEdit = user && (user.id === comment.user_id || user.role === "admin")
            return (
              <li key={comment.id} className="border p-3 rounded">
                <p className=" text-pTextHov italic">{comment.content}</p>
                <p className="text-sm text-h2Text ">
                  {comment.user_name || "Гість"} — {new Date(comment.created_at).toLocaleString("uk-UA")}
                </p>
                {canEdit && (
                  <div className="flex gap-2 mt-1">
                    <button className="text-blue-600 text-xs" onClick={() => openEditModal(comment)}>
                      Редагувати
                    </button>
                    <button className="text-red-600 text-xs" onClick={() => handleDeleteComment(comment.id)}>
                      Видалити
                    </button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ваш коментар..."
            className="border p-2 rounded"
            rows={3}
            disabled={!user}
          />
          <button disabled={isPending || !user} className="bg-btBg dark:bg-btBgD text-btText dark:text-btTextD px-4 py-2 rounded-full self-start">
            {isPending ? "Надсилання..." : "Додати коментар"}
          </button>
        </form>

        {!user && <p className="mt-2 text-red-600">Щоб додати коментар, будь ласка, увійдіть у свій акаунт.</p>}

        {message && <p className="mt-2 text-green-700">{message}</p>}
      </section>

      {/* Модалка для редагування коментаря */}
      <Modal open={!!editModal} onClose={closeEditModal}>
        <h2 className="text-xl font-bold mb-4">Редагувати коментар</h2>
        <form onSubmit={handleEditComment} className="flex flex-col gap-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="border p-2 rounded"
            rows={3}
            required
          />
          <div className="flex gap-4">
            <button type="submit" disabled={isPending} className="bg-blue-600 text-white px-4 py-2 rounded">
              {isPending ? "Оновлюємо..." : "Оновити"}
            </button>
            <button type="button" onClick={closeEditModal} className="px-4 py-2 rounded border border-gray-400">
              Відмінити
            </button>
          </div>
        </form>
      </Modal>
    </main>
  )
}
