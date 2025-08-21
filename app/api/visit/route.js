// app/api/visit/route.js
// user
import { incrementVisits } from "@/app/actions/statsActions"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route" // тут бере authOptions

export async function POST() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id || null

  await incrementVisits(userId)

  return new Response("OK")
}
