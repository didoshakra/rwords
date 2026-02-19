// app/gallery/page.jsx
"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { getPictures } from "@/app/actions/pictures/picturesActions"
import { getSections } from "@/app/actions/pictures/picturesSectionActions"
import { getTopics } from "@/app/actions/pictures/picturesTopicActions"

export default function GalleryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

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

  // Зчитування фільтрів з URL при завантаженні та при зміні даних
  useEffect(() => {
    if (sections.length === 0 || topics.length === 0) return

    const sectionParam = searchParams.get("section")
    const topicParam = searchParams.get("topic")

    if (sectionParam && sections.some((s) => s.id.toString() === sectionParam)) {
      setSelectedSection(sectionParam)
    }
    if (topicParam && topics.some((t) => t.id.toString() === topicParam)) {
      setSelectedTopic(topicParam)
    }
  }, [searchParams, sections, topics])

  // Оновлення URL при зміні фільтрів
  const updateURL = (section, topic) => {
    const params = new URLSearchParams()
    if (section) params.set("section", section)
    if (topic) params.set("topic", topic)

    const queryString = params.toString()
    const newUrl = queryString ? `/gallery?${queryString}` : "/gallery"
    router.push(newUrl, { scroll: false })
  }

  // Фільтровані картинки
  const filteredPictures = pictures.filter((pic) => {
    const matchSection = selectedSection
      ? topics.find((t) => t.id === pic.topic_id)?.pictures_sections_id?.toString() === selectedSection
      : true
    const matchTopic = selectedTopic ? pic.topic_id.toString() === selectedTopic : true
    return matchSection && matchTopic
  })

  const sortedPictures = [...filteredPictures].sort((a, b) => {
    const topicA = topics.find((t) => t.id === a.topic_id)
    const topicB = topics.find((t) => t.id === b.topic_id)

    if (topicA.pictures_sections_id !== topicB.pictures_sections_id) {
      return topicA.pictures_sections_id - topicB.pictures_sections_id
    }

    return a.topic_id - b.topic_id
  })

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl mb-4font-bold text-h1On dark:text-h1OnD mb-4">Галерея картин</h1>
      {/* Фільтри */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium text-h3On dark:text-h3OnD">Художники </label>
          <select
            value={selectedSection}
            onChange={(e) => {
              const newSection = e.target.value
              setSelectedSection(newSection)
              setSelectedTopic("") // скидаємо топік при зміні секції
              updateURL(newSection, "")
            }}
            className="border p-2 rounded"
          >
            <option value="">Усі художники</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-h3On dark:text-h3OnD">Теми</label>
          <select
            value={selectedTopic}
            onChange={(e) => {
              const newTopic = e.target.value
              setSelectedTopic(newTopic)
              updateURL(selectedSection, newTopic)
            }}
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
          {sortedPictures.map((pic, index) => {
            const topic = topics.find((t) => t.id === pic.topic_id)
            const section = sections.find((s) => s.id === topic?.pictures_sections_id)

            const prevPic = sortedPictures[index - 1]
            const prevTopic = prevPic ? topics.find((t) => t.id === prevPic.topic_id) : null

            const isNewSection = !prevTopic || prevTopic.pictures_sections_id !== topic.pictures_sections_id

            const isNewTopic = !prevTopic || prevTopic.id !== topic.id

            return (
              <React.Fragment key={pic.id}>
                {/* Заголовок секції */}
                {isNewSection && (
                  <h2 className="col-span-full text-2xl text-h2On dark:text-h2OnD font-bold mt-8 mb-2">
                    {section?.name}
                  </h2>
                )}

                {/* Заголовок теми */}
                {isNewTopic && (
                  <h3 className="col-span-full text-lg font-semibold text-h3On dark:text-h3OnD mb-4">{topic?.name}</h3>
                )}

                {/* Картинка */}
                <Link href={`/gallery/${pic.id}`}>
                  <div className="border rounded overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition">
                    {/* <img src={pic.url} alt={pic.pictures_name} className="w-full h-48 object-cover" /> */}
                    {pic.media_type === "video" ? (
                      <video src={pic.url} className="w-full h-48 object-cover" muted autoPlay loop playsInline />
                    ) : (
                      <img src={pic.url} alt={pic.pictures_name} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-2 text-sm">
                      <div className="font-medium">{pic.pictures_name}</div>
                    </div>
                  </div>
                </Link>
              </React.Fragment>
            )
          })}
        </div>
      )}
    </main>
  )
}
