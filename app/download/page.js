// app/download/page.js
"use client"

import { incrementAppDownloads } from "@/app/actions/statsActions"
import { useSession } from "next-auth/react"
import Image from "next/image"

export default function DownloadButton() {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const handleClick = (e) => {
    e.preventDefault()

    // Спочатку запускаємо завантаження файлу
    window.location.href = "https://github.com/didoshakra/rwords/releases/download/v1.0.2/rwords.apk"

    // Передаємо userId в server action
    incrementAppDownloads(userId).catch((err) => {
      console.error("Помилка при збільшенні статистики:", err)
    })
  }

  return (
    <main className="flex flex-col text-pText dark:text-pTextD max-w-3xl items-center mx-auto p-6 bg-bodyBg dark:bg-bodyBgD min-h-screen">
      <h1 className="flex flex-col items-center text-lg sm:text-2xl lg:text-3xl font-bold mb-4 gap-2">
        <Image src="/images/home/RW_know_64.png" alt="RWords" width={64} height={64} priority={true} />
      </h1>

      <a
        href="https://github.com/didoshakra/rwords/releases/download/v1.1.2/rwords.apk"
        onClick={handleClick}
        className="items-center inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          textDecoration: "none",
          fontSize: "16px",
        }}
      >
        ⬇️ Завантажити RWords.apk
      </a>

      <div className="mt-4 p-4 bg-pBg1 text-pText dark:text-pTextD bg-yellow-50 border-l-4 border-yellow-400 rounded text-sm sm:text-base text-gray-800 dark:text-gray-200">
        <p className="text-h1Text font-semibold">📥 Після завантаження APK:</p>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>🔔 Подивіться у шторці повідомлень та натисніть «Відкрити».</li>
          <li>
            📂 Якщо не бачите повідомлення — знайдіть файл <strong>RWords.apk</strong> у папці «Завантаження».
          </li>
          <li>✅ Підтвердьте дозвіл на встановлення з цього джерела, якщо Android попросить.</li>
          <li>🚀 Насолоджуйтесь використанням додатку RWords!</li>
        </ol>
        <p className="mt-2 italic text-h2Text dark:text-text-h2TextD">
          Порада: ця інструкція допоможе уникнути плутанини при встановленні з браузера.
        </p>
      </div>
    </main>
  )
}
