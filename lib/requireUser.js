// lib/requireUser.js
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Користувач із серверної сесії. Без входу кидає помилку.
export async function requireUser() {
  const session = await getServerSession(authOptions)
  const user = session?.user
  if (!user?.id) throw new Error("Користувач не авторизований")
  return user
}

// Користувач або null (для гостей)
export async function getOptionalUser() {
  const session = await getServerSession(authOptions)
  return session?.user?.id ? session.user : null
}
