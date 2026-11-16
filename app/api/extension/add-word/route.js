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

    // Речення: від 5 слів і закінчується на . ! ? … (можливо з лапкою). Решту вважаємо словом чи фразою.
    const raw = word.trim()
    const wordCount = raw.split(/\s+/).length
    const looksLikeSentence = wordCount >= 5 && /[.!?…]["'”’)\]]*$/.test(raw)

    // Для слів і фраз прибираємо пунктуацію по краях ("word," → "word"); для речень лишаємо як є
    const foreign = looksLikeSentence ? raw : raw.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")
    if (!foreign) {
      return NextResponse.json({ error: "Потрібні word і translation" }, { status: 400 })
    }

    // getOrCreateInboxTopic повертає { topicId, sectionName, topicName }
    const { topicId } = await getOrCreateInboxTopic(auth.userId, auth.userName, topicTitle)

    // addWordFromReader(foreignText, nativeTranslation, topicId, userId, force)
    // тобто: word = іноземне слово (з виділення на сторінці), translation = переклад рідною
    const result = await addWordFromReader(
      foreign,
      translation,
      topicId,
      auth.userId,
      force,
      looksLikeSentence ? "sentence" : null,
    )

    return NextResponse.json(result)
  } catch (err) {
    console.error("Extension add-word error:", err)
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 })
  }
}
