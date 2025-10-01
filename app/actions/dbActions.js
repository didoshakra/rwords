// app/actions/dbActions.js
"use server"

import { sql } from "@/lib/dbConfig"
import bcrypt from "bcrypt" // ⬅⬅⬅ ось це додаємо

export async function initTables() {
  // --- НОВА таблиця статистики ---
  await sql`
      CREATE TABLE IF NOT EXISTS site_stats (
        id SERIAL PRIMARY KEY,
        visits INTEGER DEFAULT 0,
        app_downloads INTEGER DEFAULT 0,
        word_downloads INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `
  // Якщо треба, можна вставити початковий рядок із нулями
  await sql`
      INSERT INTO site_stats (id, visits, app_downloads, word_downloads)
      VALUES (1, 0, 0, 0)
      ON CONFLICT (id) DO NOTHING;
    `

  // users
  await sql`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    avatar TEXT DEFAULT '',
    provider TEXT DEFAULT 'credentials', -- 👈 ДОДАНО provider
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );`

  // user_stats
  await sql`
  CREATE TABLE IF NOT EXISTS user_stats (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  visits INTEGER DEFAULT 0,
  app_downloads INTEGER DEFAULT 0,
  word_downloads INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);`

  // 👇 Сід для створення адміна
  const adminEmail = "admin@example.com"
  const adminPass = "admin123"
  const hash = await bcrypt.hash(adminPass, 10)
  await sql`
  INSERT INTO users (email, password_hash, name, role, provider, is_active, email_verified)
  VALUES (${adminEmail}, ${hash}, 'Admin', 'admin', 'credentials', true, true)
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
  // feedback
  await sql`
    CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`
}

export async function resetTables() {
  // Потрібно видаляти таблиці у зворотньому порядку через FK залежності
  await sql`DROP TABLE IF EXISTS site_stats;` // Спочатку нову статистику (якщо є)
  await sql`DROP TABLE IF EXISTS comments;`
  await sql`DROP TABLE IF EXISTS posts;`
  await sql`DROP TABLE IF EXISTS words;`
  await sql`DROP TABLE IF EXISTS topics;`
  await sql`DROP TABLE IF EXISTS sections;`
  await sql`DROP TABLE IF EXISTS users;`

  await initTables()
}
// Перевірка підключення
export async function checkConnection() {
  try {
    const result = await sql`SELECT NOW()`
    return { time: result[0].now }
  } catch (err) {
    console.error("❌ DB Error:", err)
    throw new Error("Database connection failed: " + err.message)
  }
}
// Створення політик доступу / Вмикає RLS для всіх таблиць;
// Створює політики для кожної операції (SELECT, INSERT, UPDATE, DELETE) відповідно до твоїх правил:
// Для users — доступ лише адміну;
// Для інших таблиць:SELECT — всі;INSERT — тільки зареєстровані (перевірка auth.uid() IS NOT NULL);
// UPDATE, DELETE — тільки власник (user_id = auth.uid()).
export async function createRLSPolicies() {
  // Увімкнути RLS на таблицях
  await sql`ALTER TABLE users ENABLE ROW LEVEL SECURITY;`
  await sql`ALTER TABLE sections ENABLE ROW LEVEL SECURITY;`
  await sql`ALTER TABLE topics ENABLE ROW LEVEL SECURITY;`
  await sql`ALTER TABLE words ENABLE ROW LEVEL SECURITY;`
  await sql`ALTER TABLE posts ENABLE ROW LEVEL SECURITY;`
  await sql`ALTER TABLE comments ENABLE ROW LEVEL SECURITY;`

  // --- USERS ---
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Admins can select users'
        ) THEN
          CREATE POLICY "Admins can select users"
          ON users FOR SELECT
          USING (role = 'admin');
        END IF;
      END $$;
    `
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update users'
        ) THEN
          CREATE POLICY "Admins can update users"
          ON users FOR UPDATE
          USING (role = 'admin');
        END IF;
      END $$;
    `
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Admins only delete users'
        ) THEN
          CREATE POLICY "Admins only delete users"
          ON users FOR DELETE
          USING (role = 'admin');
        END IF;
      END $$;
    `

  // --- SECTIONS ---
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'All can select sections'
        ) THEN
          CREATE POLICY "All can select sections"
          ON sections FOR SELECT
          USING (true);
        END IF;
      END $$;
    `
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Only authenticated can insert sections'
        ) THEN
          CREATE POLICY "Only authenticated can insert sections"
          ON sections FOR INSERT
          WITH CHECK (auth.uid() IS NOT NULL);
        END IF;
      END $$;
    `
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Only owner can update sections'
        ) THEN
          CREATE POLICY "Only owner can update sections"
          ON sections FOR UPDATE
          USING (user_id = auth.uid());
        END IF;
      END $$;
    `
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Only owner can delete sections'
        ) THEN
          CREATE POLICY "Only owner can delete sections"
          ON sections FOR DELETE
          USING (user_id = auth.uid());
        END IF;
      END $$;
    `

  // --- TOPICS ---
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'All can select topics'
        ) THEN
          CREATE POLICY "All can select topics"
          ON topics FOR SELECT
          USING (true);
        END IF;
      END $$;
    `
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Only authenticated can insert topics'
        ) THEN
          CREATE POLICY "Only authenticated can insert topics"
          ON topics FOR INSERT
          WITH CHECK (auth.uid() IS NOT NULL);
        END IF;
      END $$;
    `
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Only owner can update topics'
        ) THEN
          CREATE POLICY "Only owner can update topics"
          ON topics FOR UPDATE
          USING (user_id = auth.uid());
        END IF;
      END $$;
    `
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Only owner can delete topics'
        ) THEN
          CREATE POLICY "Only owner can delete topics"
          ON topics FOR DELETE
          USING (user_id = auth.uid());
        END IF;
      END $$;
    `

  // --- WORDS ---
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'All can select words'
        ) THEN
          CREATE POLICY "All can select words"
          ON words FOR SELECT
          USING (true);
        END IF;
      END $$;
    `
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Only authenticated can insert words'
        ) THEN
          CREATE POLICY "Only authenticated can insert words"
          ON words FOR INSERT
          WITH CHECK (auth.uid() IS NOT NULL);
        END IF;
      END $$;
    `
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Only owner can update words'
        ) THEN
          CREATE POLICY "Only owner can update words"
          ON words FOR UPDATE
          USING (user_id = auth.uid());
        END IF;
      END $$;
    `
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Only owner can delete words'
        ) THEN
          CREATE POLICY "Only owner can delete words"
          ON words FOR DELETE
          USING (user_id = auth.uid());
        END IF;
      END $$;
    `

  // --- POSTS ---
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'All can select posts'
        ) THEN
          CREATE POLICY "All can select posts"
          ON posts FOR SELECT
          USING (true);
        END IF;
      END $$;
    `
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Only authenticated can insert posts'
        ) THEN
          CREATE POLICY "Only authenticated can insert posts"
          ON posts FOR INSERT
          WITH CHECK (auth.uid() IS NOT NULL);
        END IF;
      END $$;
    `
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Only owner can update posts'
        ) THEN
          CREATE POLICY "Only owner can update posts"
          ON posts FOR UPDATE
          USING (user_id = auth.uid());
        END IF;
      END $$;
    `
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Only owner can delete posts'
        ) THEN
          CREATE POLICY "Only owner can delete posts"
          ON posts FOR DELETE
          USING (user_id = auth.uid());
        END IF;
      END $$;
    `

  // --- COMMENTS ---
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'All can select comments'
        ) THEN
          CREATE POLICY "All can select comments"
          ON comments FOR SELECT
          USING (true);
        END IF;
      END $$;
    `
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Only authenticated can insert comments'
        ) THEN
          CREATE POLICY "Only authenticated can insert comments"
          ON comments FOR INSERT
          WITH CHECK (auth.uid() IS NOT NULL);
        END IF;
      END $$;
    `
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Only owner can update comments'
        ) THEN
          CREATE POLICY "Only owner can update comments"
          ON comments FOR UPDATE
          USING (user_id = auth.uid());
        END IF;
      END $$;
    `
  await sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Only owner can delete comments'
        ) THEN
          CREATE POLICY "Only owner can delete comments"
          ON comments FOR DELETE
          USING (user_id = auth.uid());
        END IF;
      END $$;
    `

  console.log("✅ Політики RLS встановлені.")
}
