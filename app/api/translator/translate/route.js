// app/api/translator/translate/route.js
// Приймає { text, from, to }, повертає { translation }
import { NextResponse } from "next/server"
import { translateText } from "@/app/actions/words/wordActions"

export async function POST(request) {
  try {
    const { text, from, to } = await request.json()

    if (!text || !from || !to) {
      return NextResponse.json({ error: "Потрібні text, from, to" }, { status: 400 })
    }

    const translation = await translateText(text, from, to)

    return NextResponse.json({ translation })
  } catch (err) {
    console.error("translator/translate error:", err)
    return NextResponse.json({ error: err.message || "Помилка перекладу" }, { status: 500 })
  }
}
