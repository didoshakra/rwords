// / components/AdminStatsPanel.js
"use client"
import { useEffect, useState } from "react"
import { getStats } from "@/app/actions/statsActions"
import { useSession } from "next-auth/react"

export default function AdminStatsPanel() {
  const { data: session } = useSession()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState("")

  useEffect(() => {
    if (!session?.user?.role || session.user.role !== "admin") return
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
  }, [session])

  const toggleExpand = (key) => setExpanded(expanded === key ? "" : key)

  if (loading) return <p>Завантаження...</p>
  if (!stats) return <p>Не вдалося завантажити статистику</p>
  if (!session?.user?.role || session.user.role !== "admin") return <p>Доступ заборонено</p>

  return (
    <div className="p-4 max-w-md border rounded shadow bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-4">📊 Статистика сайту</h2>

      {/* Відвідування */}
      <div
        onClick={() => toggleExpand("visits")}
        className="cursor-pointer mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded"
      >
        Відвідувань: {stats.site.visits}
        {expanded === "visits" && (
          <ul className="mt-2 ml-4 list-disc">
            {stats.users.map((u) => (
              <li key={u.id}>
                {u.name || u.email}: {u.visits}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Завантаження додатку */}
      <div
        onClick={() => toggleExpand("app_downloads")}
        className="cursor-pointer mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded"
      >
        Завантажень додатку: {stats.site.app_downloads}
        {expanded === "app_downloads" && (
          <ul className="mt-2 ml-4 list-disc">
            {stats.users.map((u) => (
              <li key={u.id}>
                {u.name || u.email}: {u.app_downloads}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Завантаження слів */}
      <div
        onClick={() => toggleExpand("word_downloads")}
        className="cursor-pointer mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded"
      >
        Завантажень слів: {stats.site.word_downloads}
        {expanded === "word_downloads" && (
          <ul className="mt-2 ml-4 list-disc">
            {stats.users.map((u) => (
              <li key={u.id}>
                {u.name || u.email}: {u.word_downloads}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
