// /components/AdminStatsPanel.js
"use client"
import { useEffect, useState } from "react"
import { getStats } from "@/app/actions/statsActions"
import { useSession } from "next-auth/react"

export default function AdminStatsPanel() {
  const { data: session } = useSession()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({}) // зберігаємо стан розкриття по ключах

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

  const toggleExpand = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))

  const sumAdminAction = (field) =>
    stats?.users.filter((u) => u.role === "admin").reduce((sum, u) => sum + (u[field] || 0), 0)

  if (loading) return <p>Завантаження...</p>
  if (!stats) return <p>Не вдалося завантажити статистику</p>
  if (!session?.user?.role || session.user.role !== "admin") return <p>Доступ заборонено</p>

  const renderBlock = (key, label, siteField, userField, lastField) => (
    <div onClick={() => toggleExpand(key)} className="cursor-pointer mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
      {label}: {stats.site[siteField]} ({sumAdminAction(userField)})
      {expanded[key] && (
        <ul className="mt-2 ml-4 list-disc">
          {stats.users.map((u) => (
            <li key={u.id}>
              {u.name || u.email}: {u[userField]} — останнє: {u[lastField] || "-"}
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  return (
    <div className="p-4 max-w-md border rounded shadow bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-4">📊 Статистика сайту</h2>

      {renderBlock("visits", "Відвідувань", "visits", "visits", "last_visit_at")}
      {renderBlock("app_downloads", "Завантажень додатку", "app_downloads", "app_downloads", "last_app_download_at")}
      {renderBlock("word_downloads", "Завантажень слів", "word_downloads", "word_downloads", "last_word_download_at")}
    </div>
  )
}
