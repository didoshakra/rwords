// app/gallery/[id]/page.jsx
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { getPictureById } from "@/app/actions/pictures/picturesActions"

export default async function PicturePage({ params }) {
  const resolvedParams = await params
  const { id } = resolvedParams

  if (!id) throw new Error("ID картинки не передано")

  const picture = await getPictureById(id)

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
      {/* Займає весь екран */}
      <Image
        src={picture.url}
        alt={picture.pictures_name || "Picture"}
        fill
        style={{ objectFit: "contain" }}
        priority
      />

      {/* Назва картинки */}
      <h2 className="absolute top-4 left-4 text-white text-xl bg-black/50 p-2 rounded">{picture.pictures_name}</h2>

      {/* Кнопка назад */}
      <Link
        href="/gallery"
        className="absolute top-4 right-4 text-white bg-black/50 px-3 py-1 rounded hover:bg-black/70"
      >
        Назад
      </Link>
    </main>
  )
}
