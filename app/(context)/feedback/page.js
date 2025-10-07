// /feedback/page.js
"use client"

import React, { useEffect, useState, useTransition } from "react"
import { getFeedback, createFeedback } from "@/app/actions/feedbackActions"
import { useSession } from "next-auth/react"
import { defaultMetadata } from "@/lib/seoConfig"

export const metadata = {
  ...defaultMetadata,
  title: "Відгуки, зауваженняі пропозиції користувачів",
  description:
    "Що кажуть користувачі RWords про навчання англійської. Залиш свій відгук. Дай нам знати, що покращити, або виправити",
  openGraph: {
    ...defaultMetadata.openGraph,
    url: "https://rwords.vercel.app/feedback",
    title: "Зауваженняі пропозиції користувачів",
    description: "Що кажуть користувачі RWords про навчання англійської. Залиш свій відгук. Зауваження, пропозиції.",
    images: [
      {
        url: "https://rwords.vercel.app/og-default.png",
        width: 1200,
        height: 630,
        alt: "RWords Author Page",
      },
    ],
  },
}

export default function FeedbackPage() {
  const { data: session } = useSession()
  const user = session?.user
  const [items, setItems] = useState([])
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()

  const [type, setType] = useState("Пропозиція")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const loadFeedback = () => {
    getFeedback()
      .then(setItems)
      .catch((err) => setMessage("Помилка при завантаженні: " + err.message))
  }

  useEffect(() => {
    loadFeedback()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setMessage("Заповніть тему та опис")
      return
    }
    setMessage("")
    startTransition(async () => {
      try {
        await createFeedback(user?.id || null, type, title, content)
        setMessage("Відгук надіслано!")
        setTitle("")
        setContent("")
        loadFeedback()
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  return (
    <main className="max-w-3xl mx-auto p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Зворотній зв’язок</h1>

      {message && <p className="mb-4 text-green-700 font-medium">{message}</p>}

      {user ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-8">
          <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded">
            <option>Пропозиція</option>
            <option>Помилка</option>
            <option>Інше</option>
          </select>
          <input
            type="text"
            placeholder="Тема"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Опис"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 rounded"
            rows={5}
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:opacity-80"
          >
            {isPending ? "Надсилаємо..." : "Надіслати"}
          </button>
        </form>
      ) : (
        <p className="mb-6 text-gray-600">Щоб залишити відгук, увійдіть у свій акаунт.</p>
      )}

      <h2 className="text-xl font-semibold mb-4">Всі відгуки:</h2>
      {items.length === 0 && <p>Немає відгуків</p>}

      <ul className="space-y-4">
        {items.map((fb) => (
          <li key={fb.id} className="border p-3 rounded shadow-sm">
            <p className="text-sm text-gray-500">
              {fb.user_name ? fb.user_name + " • " : ""}[{fb.type}] {new Date(fb.created_at).toLocaleString()}
            </p>
            <h3 className="font-semibold">{fb.title}</h3>
            <p>{fb.message}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
