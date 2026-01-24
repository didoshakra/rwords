//CL/ app/admin/page.jsx
//Створення/перестворення  таюлиць БД
// Без прогресу бару

"use client"

import React, { useState, useTransition } from "react"
import { initTables, resetTables, checkConnection, createRLSPolicies } from "@/app/actions/dbActions"
import { clearCloudinaryAndDB } from "@/app/actions/cloudinaryActions"

export default function AdminPage() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [error, setError] = useState(null)

  const handleAction = async (actionFn, defaultMsg) => {
    setMessage("")
    setError(null)

    startTransition(async () => {
      try {
        const msg = await actionFn()
        setMessage(msg || defaultMsg)
      } catch (e) {
        console.error("❌ Помилка:", e)
        setError("Помилка: " + (e.message || "невідома"))
      }
    })
  }

  return (
    <main className="p-8 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Адмін панель</h1>

      <div className="flex gap-4">
        {/*Перевірка підключення до БД PG  */}
        <button
          onClick={() =>
            handleAction(async () => {
              const res = await checkConnection()
              console.log("Перевірка:", res)
            }, "✅ Перевірка підключення до БД пройшла успішно!")
          }
          disabled={isPending}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {isPending ? "⏳ Обробка...." : "Перевірка підключення до БД PG"}
        </button>

        {/* Створити таблиці */}
        <button
          onClick={() => handleAction(initTables, "✅ Таблиці створено успішно!")}
          disabled={isPending}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isPending ? "⏳ Обробка..." : "Створити таблиці (тільки нестворені)"}
        </button>

        {/* Перестворити таблиці */}
        <button
          onClick={() => handleAction(resetTables, "✅ Таблиці перестворено успішно!")}
          disabled={isPending}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {isPending ? "⏳ Обробка..." : "Перестворити таблиці (вилученням всіх таблиць)"}
        </button>

        {/* Створення політик доступу */}
        <button
          onClick={() => handleAction(createRLSPolicies, "✅ Політика доступу створена успішно!")}
          disabled={isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "⏳ Створення..." : "Створити політики RLS/Тільки для supabase.com"}
        </button>

        {/* Очистити Cloudinary */}
        <button
          onClick={() =>
            handleAction(
              async () => {
                const result = await clearCloudinaryAndDB()
                return result.message
              },
              "", // message будемо ставити з сервера
            )
          }
          disabled={isPending}
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {isPending ? "⏳ Очищення Cloudinary та БД..." : "Очистити Cloudinary + БД"}
        </button>
      </div>

      {message && <p className="text-green-700 font-medium">{message}</p>}
      {error && <p className="text-red-600 font-medium">{error}</p>}
    </main>
  )
}
