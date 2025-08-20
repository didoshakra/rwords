// app/actions/statsActions.js
// нова перссональна і загальна статистика
"use server"

import { sql } from "@/lib/dbConfig"

// ----------------------------
// Кількість відвідувань
// ----------------------------
export async function incrementVisits(userId) {
  await sql`
    UPDATE site_stats
    SET visits = visits + 1,
        updated_at = NOW()
    WHERE id = 1
  `

  if (userId) {
    await sql`
      INSERT INTO user_stats (user_id, visits)
      VALUES (${userId}, 1)
      ON CONFLICT (user_id)
      DO UPDATE SET
        visits = user_stats.visits + 1,
        updated_at = NOW()
    `
  }
}

// ----------------------------
// Завантаження додатку
// ----------------------------
export async function incrementAppDownloads(userId) {
  await sql`
    UPDATE site_stats
    SET app_downloads = app_downloads + 1,
        updated_at = NOW()
    WHERE id = 1
  `

  if (userId) {
    await sql`
      INSERT INTO user_stats (user_id, app_downloads)
      VALUES (${userId}, 1)
      ON CONFLICT (user_id)
      DO UPDATE SET
        app_downloads = user_stats.app_downloads + 1,
        updated_at = NOW()
    `
  }
}

// ----------------------------
// Завантаження слів
// ----------------------------
export async function incrementWordDownloads(userId) {
  await sql`
    UPDATE site_stats
    SET word_downloads = word_downloads + 1,
        updated_at = NOW()
    WHERE id = 1
  `

  if (userId) {
    await sql`
      INSERT INTO user_stats (user_id, word_downloads)
      VALUES (${userId}, 1)
      ON CONFLICT (user_id)
      DO UPDATE SET
        word_downloads = user_stats.word_downloads + 1,
        updated_at = NOW()
    `
  }
}

// ----------------------------
// Отримання статистики (для адміна)
export async function getStats() {
  const siteStats = await sql`
    SELECT visits, app_downloads, word_downloads
    FROM site_stats
    WHERE id = 1
    LIMIT 1
  `

  const usersStats = await sql`
    SELECT u.id, u.email, u.name,
           COALESCE(us.visits,0) AS visits,
           COALESCE(us.app_downloads,0) AS app_downloads,
           COALESCE(us.word_downloads,0) AS word_downloads
    FROM users u
    LEFT JOIN user_stats us ON u.id = us.user_id
    ORDER BY u.id
  `

  return {
    site: siteStats[0] || { visits: 0, app_downloads: 0, word_downloads: 0 },
    users: usersStats || [],
  }
}
// export async function getStats() {
//   const siteStats = await sql`
//     SELECT visits, app_downloads, word_downloads
//     FROM site_stats
//     WHERE id = 1
//     LIMIT 1
//   `

//   return siteStats[0] || { visits: 0, app_downloads: 0, word_downloads: 0 }
// }
// ----------------------------
// export async function getStats() {
//   const siteStats = await sql`
//     SELECT visits, app_downloads, word_downloads
//     FROM site_stats
//     WHERE id = 1
//     LIMIT 1
//   `

//   const usersStats = await sql`
//     SELECT u.id, u.email, u.name,
//            COALESCE(us.visits,0) AS visits,
//            COALESCE(us.app_downloads,0) AS app_downloads,
//            COALESCE(us.word_downloads,0) AS word_downloads
//     FROM users u
//     LEFT JOIN user_stats us ON u.id = us.user_id
//     ORDER BY u.id
//   `

//   return {
//     site: siteStats[0] || { visits: 0, app_downloads: 0, word_downloads: 0 },
//     users: usersStats,
//   }
// }
