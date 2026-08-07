// app/api/dialogue/free/route.js
// Вільний діалог з AI — без прив'язки до уроку/слів/рівня.
// Приймає: { history: [{role, content}], userMessage }
// Повертає: { reply }

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "llama-3.3-70b-versatile"

function buildSystemPrompt() {
  return `Ти — дружній співрозмовник для практики англійської розмовної мови.

Правила:
- Відповідай ЗАВЖДИ англійською, природно, як у звичайній розмові.
- Якщо учень зробив граматичну чи лексичну помилку — м'яко і коротко вплети виправлення прямо в свою відповідь, без окремого рядка чи формального "Correction:". Наприклад: "Oh, you mean you *went* to the cinema — nice! What did you watch?"
- Не читай лекцій з граматики, не пояснюй правила довго — просто природно покажи правильний варіант і продовжуй розмову.
- Завжди закінчуй репліку природним продовженням: питанням або коментарем, щоб розмова тривала.
- Тримай відповідь короткою: 2-4 речення.
- Тема розмови вільна — підтримуй те, що пропонує учень, або пропонуй легкі теми (хобі, подорожі, їжа, плани на день), якщо учень мовчить.

Без зайвих пояснень, без списків, без лапок навколо репліки.`
}

export async function POST(req) {
  try {
    const { history, userMessage } = await req.json()

    const systemPrompt = buildSystemPrompt()

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []),
      {
        role: "user",
        content: userMessage?.trim()
          ? userMessage
          : "(Почни розмову. Привітайся і постав легке питання для знайомства.)",
      },
    ]

    const res = await fetch(GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.8,
        max_tokens: 150,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Groq помилка: ${res.status} ${err}`)
    }

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content?.trim() || ""

    return Response.json({ reply })
  } catch (err) {
    console.error("dialogue/free error:", err.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
