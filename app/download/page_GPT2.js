// app/download/page.js
"use client"
import { incrementStat } from "@/app/actions/statsActions"

export default function DownloadButton() {
  const handleClick = (e) => {
    e.preventDefault()

    // Спочатку запускаємо завантаження файлу
    window.location.href = "https://github.com/didoshakra/rwords/releases/download/v1.0.1/rwords.apk"

    // Потім асинхронно оновлюємо статистику, помилки ігноруємо
    incrementStat("app_downloads").catch(() => {
      // Можна тут логувати помилку, але це необов'язково
    })
  }

  return (
    <a
      href="https://github.com/didoshakra/rwords/releases/download/v1.0.1/rwords.apk"
      onClick={handleClick}
      className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      ⬇️ Завантажити APK
    </a>
  )
}
