// app/api/extension/translate/route.js — для попапу розширення, щоб показати переклад одразу після виділення (до натискання "Додати"):
import { NextResponse } from "next/server"
import { getUserFromToken, getBearerToken } from "@/lib/apiToken"
import { translateText } from "@/app/actions/words/wordActions"

export async function POST(request) {
  try {
    const token = getBearerToken(request)
    const auth = await getUserFromToken(token)

    if (!auth) {
      return NextResponse.json({ error: "Невалідний або відсутній токен" }, { status: 401 })
    }

    const { text, fromLanguage, toLanguage } = await request.json()

    if (!text || !fromLanguage || !toLanguage) {
      return NextResponse.json({ error: "Потрібні text, fromLanguage, toLanguage" }, { status: 400 })
    }

    const translated = await translateText(text, fromLanguage, toLanguage)

    return NextResponse.json({ translation: translated })
  } catch (err) {
    console.error("Extension translate error:", err)
    return NextResponse.json({ error: "Помилка перекладу" }, { status: 500 })
  }
}