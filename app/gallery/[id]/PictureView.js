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
      <main className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
        <p className="text-lg mb-4">Картинка не знайдена</p>
        <Link href="/gallery" className="text-blue-500 underline">
          Повернутися в галерею
        </Link>
      </main>
    )
  }

  return (
    <main className="relative w-screen h-screen bg-black">
      <Image
        src={picture.url}
        alt={picture.pictures_name || "Picture"}
        fill
        style={{ objectFit: "contain" }}
        priority
      />
      <h2 className="absolute top-4 left-4 text-white text-xl bg-black/50 p-2 rounded">{picture.pictures_name}</h2>
      <Link
        href="/gallery"
        className="absolute top-4 right-4 text-white bg-black/50 px-3 py-1 rounded hover:bg-black/70"
      >
        Назад
      </Link>
    </main>
  )
}
