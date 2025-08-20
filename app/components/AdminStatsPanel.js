// / components/AdminStatsPanel.js
"use client"
import { useEffect, useState } from "react"
import { getStats } from "@/app/actions/statsActions"

export default function AdminStatsPanel() {
  const [stats, setStats] = useState({ site: { visits: 0, app_downloads: 0, word_downloads: 0 }, users: [] })
  const [loading, setLoading] = useState(true)
  const [expandedRow, setExpandedRow] = useState(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getStats()
        setStats(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const toggleExpand = (row) => setExpandedRow(expandedRow === row ? null : row)

  const renderUserList = (metric) => {
    if (expandedRow !== metric) return null
    return (
      <ul className="mt-2 ml-4 list-disc">
        {stats.users.map((u) => (
          <li key={u.id}>
            {u.name || u.email}: {u[metric]}
          </li>
        ))}
      </ul>
    )
  }

  if (loading) return <p>Завантаження...</p>

  return (
    <div className="p-4 max-w-md border rounded shadow bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-4">📊 Статистика сайту</h2>

      <div
        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded"
        onClick={() => toggleExpand("visits")}
      >
        Відвідувань: {stats.site.visits}
        {renderUserList("visits")}
      </div>

      <div
        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded"
        onClick={() => toggleExpand("app_downloads")}
      >
        Завантажень додатку: {stats.site.app_downloads}
        {renderUserList("app_downloads")}
      </div>

      <div
        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded"
        onClick={() => toggleExpand("word_downloads")}
      >
        Завантажень слів: {stats.site.word_downloads}
        {renderUserList("word_downloads")}
      </div>
    </div>
  )
}


