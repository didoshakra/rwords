// app/download/page.js
"use client"
import { incrementAppDownloads} from "@/app/actions/statsActions"
import Image from "next/image"

export default function DownloadButton() {
  const handleClick = (e) => {
    e.preventDefault()

    // Спочатку запускаємо завантаження файлу
    window.location.href = "https://github.com/didoshakra/rwords/releases/download/v1.0.2/rwords.apk"
    incrementAppDownloads().catch(() => {
      // Можна тут логувати помилку, але це необов'язково
    })

  }

  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px" }}>
      <h1 className="flex flex-col items-center text-lg sm:text-2xl lg:text-3xl font-bold mb-4 gap-2">
        <Image src="/images/home/RW_know_64.png" alt="RWords" width={64} height={64} priority={true} />
        {/* Завантаження RWords */}
      </h1>

      <a
        href="https://github.com/didoshakra/rwords/releases/download/v1.0.2/rwords.apk"
        onClick={handleClick}
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

    </main>
  )
}
