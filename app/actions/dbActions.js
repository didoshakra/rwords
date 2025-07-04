// app/actions/dbActions.js
"use server"

import { sql } from "@/lib/dbConfig"

export async function initTables() {
  // users
  await sql`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    avatar TEXT DEFAULT '',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );`
  // 👇 Сід для створення адміна
  const adminEmail = "admin@example.com"
  const adminPass = "admin123"
  const hash = await bcrypt.hash(adminPass, 10)
  await sql`
    INSERT INTO users (email, password_hash, name, role, is_active, email_verified)
    VALUES (${adminEmail}, ${hash}, 'Admin', 'admin', true, true)
    ON CONFLICT (email) DO NOTHING;`
  console.log(`✅ Admin user seeded: ${adminEmail} / ${adminPass}`)

  // sections
  await sql`
    CREATE TABLE IF NOT EXISTS sections (
      id SERIAL PRIMARY KEY,
      pn INTEGER DEFAULT 0,
      name TEXT NOT NULL,
      img TEXT DEFAULT 'other',
      user_id INTEGER NOT NULL,
      CONSTRAINT fk_user_section FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );`

  // додати запис "інше" у sections
  const userId = 1 // для демо, бо ще нема авторизації
  await sql`
    INSERT INTO sections (pn, name, img, user_id)
    VALUES (0, 'інше', 'other', ${userId})
    ON CONFLICT DO NOTHING;`

  // topics
  await sql`
    CREATE TABLE IF NOT EXISTS topics (
      id SERIAL PRIMARY KEY,
      pn INTEGER DEFAULT 0,
      name TEXT NOT NULL,
      img TEXT DEFAULT 'other',
      section_id INTEGER DEFAULT 1,
      user_id INTEGER NOT NULL,
      CONSTRAINT fk_section FOREIGN KEY(section_id) REFERENCES sections(id) ON DELETE CASCADE,
      CONSTRAINT fk_user_topic FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );`
  // додати запис "інше" у topics
  await sql`
  INSERT INTO topics (pn, name, img, section_id, user_id)
  VALUES (0, 'інше', 'other', 1, ${userId})
  ON CONFLICT DO NOTHING;
`

  // words
  await sql`
    CREATE TABLE IF NOT EXISTS words (
      id SERIAL PRIMARY KEY,
      pn INTEGER DEFAULT 0,
      topic_id INTEGER DEFAULT 1,
      word TEXT NOT NULL,
      translation TEXT DEFAULT '',
      know BOOLEAN DEFAULT false,
      img TEXT DEFAULT '',
      user_id INTEGER NOT NULL,
      CONSTRAINT fk_topic FOREIGN KEY(topic_id) REFERENCES topics(id) ON DELETE CASCADE,
      CONSTRAINT fk_user_word FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );`

  // posts (блог)
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT fk_user_post FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );`

  // comments (блог)
  await sql`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT fk_post_comment FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE,
      CONSTRAINT fk_user_comment FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );`
}

export async function resetTables() {
  // Потрібно видаляти таблиці у зворотньому порядку через FK залежності
  await sql`DROP TABLE IF EXISTS comments;`
  await sql`DROP TABLE IF EXISTS posts;`
  await sql`DROP TABLE IF EXISTS words;`
  await sql`DROP TABLE IF EXISTS topics;`
  await sql`DROP TABLE IF EXISTS sections;`
  await sql`DROP TABLE IF EXISTS users;`

  await initTables()
}
// Перевірка підключення
export async function сheckСonnection() {
  try {
    const result = await sql`SELECT NOW()`
    return { time: result[0].now }
  } catch (err) {
    console.error("❌ DB Error:", err)
    throw new Error("Database connection failed: " + err.message)
  }
}
