//CL/ app/admin/page.jsx
//Створення/перестворення  таюлиць БД
"use client"

import React, { useState, useTransition } from "react"
import { initTables, resetTables, сheckСonnection, createRLSPolicies } from "@/app/actions/dbActions"

export default function AdminPage() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [error, setError] = useState(null)

  const handleAction = async (actionFn, successText) => {
    setMessage("")
    setError(null)

    startTransition(async () => {
      try {
        await actionFn()
        setMessage(successText)
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
              const res = await сheckСonnection()
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
          {isPending ? "⏳ Обробка..." : "Створити таблиці"}
        </button>
        {/* Перестворити таблиці */}
        <button
          onClick={() => handleAction(resetTables, "✅ Таблиці перестворено успішно!")}
          disabled={isPending}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {isPending ? "⏳ Обробка..." : "Перестворити таблиці"}
        </button>

        {/* Створення політик доступу */}
        <button
          onClick={() => handleAction(createRLSPolicies, "✅ Політика доступу створена успішно!")}
          disabled={isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "⏳ Створення..." : "Створити політики RLS"}
        </button>
      </div>

      {message && <p className="text-green-700 font-medium">{message}</p>}
      {error && <p className="text-red-600 font-medium">{error}</p>}
    </main>
  )
}
