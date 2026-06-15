// app/api/user-words/route.js

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/auth/authOptions"
import { sql } from "@/lib/dbConfig"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return Response.json([])
  }

  const words = await sql`
    SELECT word FROM words
    WHERE user_id = ${session.user.id}
  `
  return Response.json(words)
}
