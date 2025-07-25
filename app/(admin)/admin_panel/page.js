// app/admin_panel/page.js
// import AdminStatsPanel from "@/components/AdminStatsPanel"
import AdminStatsPanel from "@/app/components/AdminStatsPanel"
import { getStats } from "@/app/actions/statsActions"

export default async function AdminPage() {
  const stats = await getStats()

  return (
    <div className="p-4">
      <AdminStatsPanel initialStats={stats} />
    </div>
  )
}
