// / components/AdminStatsPanel.js
"use client"

import { useEffect, useState } from "react"
import { getStats } from "@/app/actions/statsActions" // імпортуємо action напряму

export default function AdminStatsPanel() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getStats() // напряму викликаємо server action
        setStats(data)
      } catch (error) {
        console.error("Помилка при завантаженні статистики", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) return <p>Завантаження...</p>
  if (!stats) return <p>Не вдалося завантажити статистику</p>

  return (
    <div className="p-4 max-w-md border rounded shadow bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-4">📊 Статистика сайту</h2>
      <p>Відвідувань: {stats.visits}</p>
      <p>Завантажень додатку: {stats.app_downloads}</p>
      <p>Завантажень слів: {stats.word_downloads}</p>
    </div>
  )
}
