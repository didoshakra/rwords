// app/api/visit/route.js
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { incrementVisits } from "@/app/actions/statsActions"

export async function POST() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  await incrementVisits(userId)
  return new Response("OK")
}