// app/actions/userActions.js
"use server"

import { sql } from "@/lib/dbConfig"

export async function getUsers() {
  return await sql`
      SELECT * FROM users ORDER BY id DESC
    `
}
//   SELECT id, name, email, created_at FROM users ORDER BY id DESC
export async function createUser(name, email) {
  // Просто зберігаємо тестовий hash або якийсь "пустий"
  const defaultHash = "hashed_password"
  await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${defaultHash})
    `
}

export async function updateUser(id, name, email) {
  await sql`
      UPDATE users
      SET name = ${name}, email = ${email}, updated_at = NOW()
      WHERE id = ${id}
    `
}

export async function deleteUser(id) {
  await sql`DELETE FROM users WHERE id = ${id}`
}
