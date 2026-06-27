// app/api/translator/translate/route.js
// Приймає { text, from?, to? } у форматі BCP-47 (напр. 'uk-UA', 'en-GB')
// Повертає { translation }

export async function POST(req) {
  try {
    const { text, from = "uk-UA", to = "en-GB" } = await req.json()

    if (!text?.trim()) {
      return Response.json({ error: "Текст відсутній" }, { status: 400 })
    }

    // DeepL source_lang: тільки мова без регіону, верхній регістр ('uk-UA' → 'UK')
    const sourceLang = from.split("-")[0].toUpperCase()

    // DeepL target_lang: з регіоном, верхній регістр ('en-GB' → 'EN-GB')
    const targetLang = to.replace(
      /^([a-zA-Z]+)-([a-zA-Z]+)$/,
      (_, lang, region) => `${lang.toUpperCase()}-${region.toUpperCase()}`,
    )
    console.log("DeepL params:", { sourceLang, targetLang, text })
    const res = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: [text],
        source_lang: sourceLang, // 'UK'
        target_lang: targetLang, // 'EN-GB'
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`DeepL помилка: ${res.status} ${err}`)
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
