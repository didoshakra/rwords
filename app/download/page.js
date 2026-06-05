// app/download/page.js — Завантаження застосунку RWords
"use client"

import { useState, useRef } from "react"
import { incrementAppDownloads } from "@/app/actions/statsActions"
import { useSession } from "next-auth/react"
import Image from "next/image"

export default function DownloadButton() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [downloading, setDownloading] = useState(false)
  const timerRef = useRef(null)

  const closeOverlay = (handler) => {
    setDownloading(false)
    document.removeEventListener("visibilitychange", handler)
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  const handleClick = (e) => {
    e.preventDefault()
    setDownloading(true)

    window.location.href = "https://github.com/didoshakra/rwords/releases/latest/download/rwords.apk"

    // Коли браузер показав діалог "встановити" — сторінка йде у фон,
    // а коли користувач повертається — прибираємо оверлей
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        closeOverlay(handleVisibility)
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)

    // Запасний варіант: прибрати через 3 хв якщо нічого не сталось
    timerRef.current = setTimeout(() => closeOverlay(handleVisibility), 2 * 60 * 1000)

    incrementAppDownloads(userId).catch((err) => {
      console.error("Помилка при збільшенні статистики:", err)
    })
  }

  return (
    <main className="flex flex-col text-pOn dark:text-pOnD max-w-3xl items-center mx-auto p-6 bg-pBg dark:bg-pBgD min-h-screen">
      <h1 className="flex flex-col items-center text-lg sm:text-2xl lg:text-3xl font-bold mb-4 gap-2">
        <Image src="/images/home/RW_know_64.png" alt="RWords" width={64} height={64} priority={true} />
      </h1>

      <a
        href="https://github.com/didoshakra/rwords/releases/latest/download/rwords.apk"
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

      <div className="mt-4 p-4 bg-kBg text-pOn dark:text-pOnD bg-yellow-50 border-l-4 border-yellow-400 rounded text-sm sm:text-base text-gray-800 dark:text-gray-200">
        <p className="text-h1On font-semibold">📥 Після завантаження APK:</p>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>🔔 Подивіться у шторці повідомлень та натисніть «Відкрити».</li>
          <li>
            📂 Якщо не бачите повідомлення — знайдіть файл <strong>RWords.apk</strong> у папці «Завантаження».
          </li>
          <li>✅ Підтвердьте дозвіл на встановлення з цього джерела, якщо Android попросить.</li>
          <li>🚀 Насолоджуйтесь використанням додатку RWords!</li>
        </ol>
        <p className="mt-2 italic text-h2On dark:text-text-h2OnD">
          Порада: ця інструкція допоможе уникнути плутанини при встановленні з браузера.
        </p>
      </div>

      {/* Оверлей під час завантаження */}
      {downloading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              maxWidth: "320px",
              margin: "0 1rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                border: "4px solid #e5e7eb",
                borderTopColor: "#2563eb",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <p style={{ fontWeight: 600, fontSize: 16, color: "#111", margin: 0 }}>⬇️ Завантаження RWords...</p>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
              Може тривати до 2 хвилин
              <br />
              Не закривайте сторінку
            </p>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  )
}
