// app / api / translator / translate / route.js//приймає { text }, відправляє на DeepL (DEEPL_API_KEY з вашого .env), повертає { translation }. Все через вашу існуючу авторизацію.

// app/api/translator/translate/route.js

export async function POST(req) {
  try {
    const { text } = await req.json()

    if (!text?.trim()) {
      return Response.json({ error: "Текст відсутній" }, { status: 400 })
    }

    const res = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: [text],
        source_lang: "UK",
        target_lang: "EN",
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("DeepL error:", err)
      throw new Error(`DeepL помилка: ${res.status}`)
    }

    const data = await res.json()
    const translation = data.translations?.[0]?.text
    if (!translation) throw new Error("DeepL не повернув переклад")

    return Response.json({ translation })

  } catch (err) {
    console.error("translator/translate error:", err.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}