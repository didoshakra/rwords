// app/actions/authActions.js
"use server"

import bcrypt from "bcrypt"
import { sql } from "@/lib/dbConfig"

// --- Реєстрація ---
export async function registerUser(name, email, password) {
  const existing = await sql`SELECT id FROM users WHERE email = ${email}`
  if (existing.length > 0) {
    throw new Error("Користувач з таким email вже існує")
  }

  const password_hash = await bcrypt.hash(password, 10)

  const result = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${password_hash})
        RETURNING id, name, email, role
    `
  return result[0] // Повертаємо об'єкт нового користувача
}


// --- Логін ---
export async function loginUser(email, password) {
  // Шукаємо користувача
  const users = await sql`
    SELECT * FROM users WHERE email = ${email}
  `
  if (users.length === 0) {
    throw new Error("Невірний email або пароль")
  }

  const user = users[0]

  // Порівнюємо пароль
  const validPassword = await bcrypt.compare(password, user.password_hash)
  if (!validPassword) {
    throw new Error("Невірний email або пароль")
  }

  // Тут можеш повернути дані користувача чи токен
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}
