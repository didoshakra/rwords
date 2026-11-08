//CL/ app/admin/page.jsx
//Створення/перестворення  таюлиць БД
// з прогрес баром

"use client"

import React, { useState, useTransition } from "react"
import { initTables, resetTables, checkConnection, createRLSPolicies } from "@/app/actions/dbActions"
import { clearCloudinaryAndDB } from "@/app/actions/cloudinary/clearCloudinaryAndDB"
import { initTables, resetTables, resetAllTables, checkConnection, createRLSPolicies } from "@/app/actions/dbActions"


export default function AdminPage() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [error, setError] = useState(null)
  const [cloudProgress, setCloudProgress] = useState(null) // новий стан

  const handleAction = async (actionFn, successText) => {
    setMessage("")
    setError(null)

    startTransition(async () => {
      try {
        const res = await actionFn(setCloudProgress)

        if (res?.message) {
          setMessage(res.message)
        } else if (successText) {
          setMessage(successText)
        } else {
          setMessage("✅ Дія виконана")
        }

        setCloudProgress(null)
      } catch (e) {
        console.error("❌ Помилка:", e)
        const msg = e?.message || JSON.stringify(e) || "Невідома помилка"
        setError("Помилка: " + msg)
        setCloudProgress(null)
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
          onClick={() => {
            if (
              !confirm(
                "⚠️ Буде видалено всі слова, теми, секції, картинки, пости й статистику. Користувачі й адмін залишаться. Продовжити?",
              )
            )
              return
            handleAction(resetTables, "✅ Таблиці перестворено успішно!")
          }}
          disabled={isPending}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {isPending ? "⏳ Обробка..." : "Перестворити таблиці (вилученням всіх таблиць)"}
        </button>

        {/* Повне скидання разом з користувачами */}
        <button
          onClick={() => {
            if (
              !confirm(
                "⚠️ УВАГА! Буде видалено ВСЕ, разом з користувачами й адміном. Потім адміна треба буде створити вручну. Продовжити?",
              )
            )
              return
            if (!confirm("Точно? Дію неможливо скасувати.")) return
            handleAction(resetAllTables, "✅ Повне скидання виконано")
          }}
          disabled={isPending}
          className="px-6 py-2 bg-red-800 text-white rounded hover:bg-red-900 disabled:opacity-50"
        >
          {isPending ? "⏳ Обробка..." : "Повне скидання (разом з користувачами)"}
        </button>

        {/* Створення політик доступу */}
        <button
          onClick={() => handleAction(createRLSPolicies, "✅ Політика доступу створена успішно!")}
          disabled={isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "⏳ Створення..." : "Створити політики RLS/Тільки для supabase.com"}
        </button>

        {/* Очистити Cloudinary + БД */}
        <button
          onClick={() => {
            const confirmed = confirm(
              "⚠️ Увага! Це видалить ВСІ файли з Cloudinary та ВСІ записи в таблиці pictures. Дію неможливо скасувати. Продовжити?",
            )
            if (!confirmed) return

            handleAction(clearCloudinaryAndDB, "")
          }}
          disabled={isPending}
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {isPending
            ? cloudProgress !== null
              ? `⏳ Видалено ${cloudProgress} файлів з Cloudinary...`
              : "⏳ Очищення Cloudinary та БД..."
            : "Очистити Cloudinary + БД"}
        </button>
      </div>

      {message && <p className="text-green-700 font-medium whitespace-pre-line">{message}</p>}
      {error && <p className="text-red-600 font-medium">{error}</p>}
    </main>
  )
}
