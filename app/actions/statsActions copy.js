// app/actions/statsActions.js
//стара-загальна статистика
"use server"

import { sql } from "@/lib/dbConfig"

export async function getStats() {
  const result = await sql`SELECT * FROM site_stats WHERE id = 1 LIMIT 1`
  return result[0]
}


export async function incrementVisits() {
  await sql`
    UPDATE site_stats
    SET visits = visits + 1,
        updated_at = NOW()
    WHERE id = 1
  `
}

export async function incrementAppDownloads() {
  await sql`
    UPDATE site_stats
    SET app_downloads = app_downloads + 1,
        updated_at = NOW()
    WHERE id = 1
  `
}

export async function incrementWordDownloads() {
  await sql`
    UPDATE site_stats
    SET word_downloads = word_downloads + 1,
        updated_at = NOW()
    WHERE id = 1
  `
}
