// app/gallery/page.jsx 
"use client"

import React, { useEffect, useState } from "react"
import { getPictures } from "@/app/actions/pictures/picturesActions"
import { getSections } from "@/app/actions/pictures/picturesSectionActions"
import { getTopics } from "@/app/actions/pictures/picturesTopicActions"

export default function GalleryPage() {
  const [pictures, setPictures] = useState([])
  const [sections, setSections] = useState([])
  const [topics, setTopics] = useState([])

  const [selectedSection, setSelectedSection] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [message, setMessage] = useState("Завантаження...")

  // Завантаження даних
  useEffect(() => {
    Promise.all([getPictures(), getSections(), getTopics()])
      .then(([pics, secs, tops]) => {
        setPictures(pics)
        setSections(secs)
        setTopics(tops)
        setMessage("")
      })
      .catch((err) => setMessage("Помилка завантаження: " + err.message))
  }, [])

  // Фільтровані картинки
  const filteredPictures = pictures.filter((pic) => {
    const matchSection = selectedSection
      ? topics.find((t) => t.id === pic.topic_id)?.pictures_sections_id?.toString() === selectedSection
      : true
    const matchTopic = selectedTopic ? pic.topic_id.toString() === selectedTopic : true
    return matchSection && matchTopic
  })

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Галерея картин</h1>

      {/* Фільтри */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium">Секція</label>
          <select
            value={selectedSection}
            onChange={(e) => {
              setSelectedSection(e.target.value)
              setSelectedTopic("") // скидаємо топік при зміні секції
            }}
            className="border p-2 rounded"
          >
            <option value="">Усі секції</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Тема</label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="border p-2 rounded"
            disabled={!selectedSection}
          >
            <option value="">Усі теми</option>
            {topics
              .filter((t) => !selectedSection || t.pictures_sections_id.toString() === selectedSection)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Повідомлення */}
      {message && <div className="text-red-600 mb-4">{message}</div>}

      {/* Галерея */}
      {filteredPictures.length === 0 ? (
        <div className="text-gray-500">Картинок не знайдено</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPictures.map((pic) => {
            const topic = topics.find((t) => t.id === pic.topic_id)
            const section = sections.find((s) => s.id === topic?.pictures_sections_id)
            return (
              <div key={pic.id} className="border rounded overflow-hidden shadow-sm">
                <img src={pic.url} alt={pic.pictures_name} className="w-full h-48 object-cover" />
                <div className="p-2 text-sm">
                  <div className="font-medium">{pic.pictures_name}</div>
                  <div className="text-gray-500 text-xs">
                    {topic?.name || "Без теми"} / {section?.name || "Без секції"}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
