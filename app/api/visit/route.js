// app/api/visit/route.js
import { incrementVisits } from "@/app/actions/statsActions"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route" // імпорт authOptions з твого NextAuth

export async function POST() {
  try {
    // отримуємо сесію користувача
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // збільшуємо відвідування (гості + користувачі)
    await incrementVisits(userId)

    return new Response("OK", { status: 200 })
  } catch (err) {
    console.error("Error in /api/visit:", err)
    return new Response("Error", { status: 500 })
  }
}
