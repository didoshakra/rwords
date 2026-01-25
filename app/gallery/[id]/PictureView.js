// app/gallery/[id]/PictureView.jsx
"use client" // Тільки тут useEffect, ESC, клієнтська логіка
import React, { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PictureView({ picture }) {
  const router = useRouter()

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") router.push("/gallery")
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [router])

  if (!picture) {
    return (
      //   <main className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4 overflow-hidden">
      //     <p className="text-lg mb-4">Картинка не знайдена</p>
      //     <Link href="/gallery" className="text-blue-500 underline">
      //       Повернутися в галерею
      //     </Link>
      //   </main>
      <main className="fixed inset-0 bg-black overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={picture.url}
            alt={picture.pictures_name || "Picture"}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
      </main>
    )
  }

  return (
    // <main className="fixed inset-0 bg-black overflow-hidden">
    <main className="fixed inset-0 bg-pBg dark:bg-pBgD overflow-hidden">
      {/* Картинка на весь екран */}
      <Image
        src={picture.url}
        alt={picture.pictures_name || "Picture"}
        fill
        style={{ objectFit: "contain" }}
        priority
      />

      {/* Стрілка назад */}
      <Link
        href="/gallery"
        className="absolute top-4 left-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
        aria-label="Назад"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Link>

      {/* Назва по центру */}
      <h2 className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-lg bg-h2On dark:bg-h2OnD px-4 py-1 rounded">
        {picture.pictures_name}
      </h2>
    </main>
  )
}
