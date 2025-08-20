// / components/AdminStatsPanel.js
"use client"

import { useEffect, useState } from "react"
import { getStats } from "@/app/actions/statsActions"

export default function AdminStatsPanel() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({ visits: false, app_downloads: false, word_downloads: false })

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getStats()
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

  const toggle = (field) => setExpanded((prev) => ({ ...prev, [field]: !prev[field] }))

  const renderUsersList = (field) => {
    const totalUsers = stats.users.reduce((sum, u) => sum + u[field], 0)
    const guestCount = stats.site[field] - totalUsers

    return (
      <ul className="ml-4 mt-2 list-disc text-sm">
        {stats.users.map((u) => (
          <li key={u.id}>
            {u.name || u.email} — {u[field]}
          </li>
        ))}
        {guestCount > 0 && <li>Гості — {guestCount}</li>}
      </ul>
    )
  }

  return (
    <div className="p-4 max-w-md border rounded shadow bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-4">📊 Статистика сайту</h2>

      <div className="cursor-pointer" onClick={() => toggle("visits")}>
        Відвідувань: {stats.site.visits} {expanded.visits ? "▲" : "▼"}
      </div>
      {expanded.visits && renderUsersList("visits")}

      <div className="cursor-pointer mt-2" onClick={() => toggle("app_downloads")}>
        Завантажень додатку: {stats.site.app_downloads} {expanded.app_downloads ? "▲" : "▼"}
      </div>
      {expanded.app_downloads && renderUsersList("app_downloads")}

      <div className="cursor-pointer mt-2" onClick={() => toggle("word_downloads")}>
        Завантажень слів: {stats.site.word_downloads} {expanded.word_downloads ? "▲" : "▼"}
      </div>
      {expanded.word_downloads && renderUsersList("word_downloads")}
    </div>
  )
}
