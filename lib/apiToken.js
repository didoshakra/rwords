// lib/apiToken.js — хелпери для генерації/перевірки токена:
import crypto from "crypto"
import { sql } from "@/lib/dbConfig"

export function generateRawToken() {
  return "wt_" + crypto.randomBytes(32).toString("hex")
}

export function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex")
}

export async function createTokenForUser(userId, name = "Browser Extension") {
  const rawToken = generateRawToken()
  const tokenHash = hashToken(rawToken)
  await sql`
    INSERT INTO api_tokens (user_id, token_hash, name)
    VALUES (${userId}, ${tokenHash}, ${name})
  `
  return rawToken // показуємо юзеру тільки зараз, в БД лежить лише хеш
}

export async function getUserFromToken(rawToken) {
  if (!rawToken) return null
  const tokenHash = hashToken(rawToken)
  const [row] = await sql`
    SELECT at.user_id, u.name, u.email
    FROM api_tokens at
    JOIN users u ON u.id = at.user_id
    WHERE at.token_hash = ${tokenHash}
  `
  if (!row) return null

  sql`UPDATE api_tokens SET last_used_at = NOW() WHERE token_hash = ${tokenHash}`.catch(() => {})

  return { userId: row.user_id, userName: row.name, email: row.email }
}

export function getBearerToken(request) {
  const authHeader = request.headers.get("authorization") || ""
  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  return match ? match[1] : null
}