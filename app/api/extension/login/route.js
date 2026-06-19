// app/api/extension/login/route.js — розширення шле сюди email+пароль, отримує токен у відповідь:
//(підтягує мови разом з токеном):
import { NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import { sql } from "@/lib/dbConfig"
import { createTokenForUser } from "@/lib/apiToken"
import { getUserSettings } from "@/lib/userSettings"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Введіть email і пароль" }, { status: 400 })
    }

    const [user] = await sql`SELECT * FROM users WHERE email = ${email}`

    if (!user) {
      return NextResponse.json({ error: "Користувача не знайдено" }, { status: 401 })
    }

    if (!user.password_hash) {
      return NextResponse.json(
        { error: "Цей акаунт зареєстрований через Google/GitHub/Facebook. Встановіть пароль у налаштуваннях сайту." },
        { status: 401 },
      )
    }

    const valid = await bcryptjs.compare(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: "Неправильний пароль" }, { status: 401 })
    }

    const token = await createTokenForUser(user.id, "Browser Extension")
    const settings = await getUserSettings(user.id)

    return NextResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
      settings: { fromLang: settings.from_lang, toLang: settings.to_lang },
    })
  } catch (err) {
    console.error("Extension login error:", err)
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 })
  }
}