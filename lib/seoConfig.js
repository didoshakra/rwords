// lib/seoConfig.js

export const defaultMetadata = {
  metadataBase: new URL("https://rwords.vercel.app"),
  title: "RWords — Вивчення іноземних (англійських) слів",
  description:
    "Онлайн-платформа для вивчення іноземних(англійських) слів з можливість формування списків на основі оцінки знань. Оцінюй свої знання за допомогою голосових команд. Викидай із вивчення слова, які вже вивчені.",
  keywords: [
    "англійська",
    "іноземна",
    "вивчення слів",
    "вивчення іноземних слів",
    "переклад на 20 мов",
    "переклад",
    "озвучення",
    "англійська онлайн",
    "іноземна онлайн",
    "управління голосом",
  ],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "https://rwords.vercel.app",
    siteName: "RWords",
    title: "RWords — Вивчення іноземних (англійських) слів",
    description:
      "Сервіс для ефективного вивчення іноземних (англійських) слів  з можливістю викидати із вивчення слова, які вже вивчені на основі оцінки знань за допомогою голосових команд.",
    images: [
      {
        url: "https://rwords.vercel.app/og-default.png",
        width: 1200,
        height: 630,
        alt: "RWords App Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RWords — Вивчай англійські слова з озвученням",
    description: "Слухай, повторюй і запам’ятовуй англійські слова разом із RWords.",
    images: ["https://rwords.vercel.app/og-default.png"],
  },
}
