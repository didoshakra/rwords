import { NextResponse } from "next/server"
import { getUserFromToken, getBearerToken } from "@/lib/apiToken"
import { getOrCreateInboxTopic, addWordFromReader } from "@/app/actions/words/wordActions"

export async function POST(request) {
  try {
    const token = getBearerToken(request)
    const auth = await getUserFromToken(token)

    if (!auth) {
      return NextResponse.json({ error: "Невалідний або відсутній токен" }, { status: 401 })
    }

    const { word, translation, pageTitle, force } = await request.json()

    if (!word || !translation) {
      return NextResponse.json({ error: "Потрібні word і translation" }, { status: 400 })
    }

    const topicTitle = pageTitle?.trim() || "Без назви"

    // getOrCreateInboxTopic повертає { topicId, sectionName, topicName }
    const { topicId } = await getOrCreateInboxTopic(auth.userId, auth.userName, topicTitle)

    // addWordFromReader(foreignText, nativeTranslation, topicId, userId, force)
    // тобто: word = іноземне слово (з виділення на сторінці), translation = переклад рідною
    const result = await addWordFromReader(word, translation, topicId, auth.userId, force)

    return NextResponse.json(result)
  } catch (err) {
    console.error("Extension add-word error:", err)
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 })
  }
}
