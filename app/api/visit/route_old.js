// app/api/visit/route.js (або .ts, якщо TypeScript)
import { incrementVisits } from "@/app/actions/statsActions"

export async function POST() {
  await incrementVisits()
  return new Response("OK") 
}
