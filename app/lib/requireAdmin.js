// lib/requireAdmin.js
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { sql } from "@/app/lib/dbConfig"

// Суворо: лише адмін
export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "admin") {
    throw new Error("Доступ лише для адміністратора")
  }
}

// М'яко (для initTables): дозволено, якщо адміна ще немає або таблиці users ще немає
export async function requireAdminOrBootstrap() {
  try {
    const rows = await sql`SELECT 1 FROM users WHERE role = 'admin' LIMIT 1`
    if (rows.length === 0) return
  } catch (e) {
    if (e?.code === "42P01") return // таблиці users ще не існує
    throw e
  }
  await requireAdmin()
}
