//Запуск на порт 3002 yarn  dev -p 3002
//===============================================
Застосунок RWords.apk href="https://github.com/didoshakra/rwords/releases/download/v1.0.1/rwords.apk"
Як подивитися список релізів і файлів на GitHub: https://github.com/didoshakra/rwords/releases

*********************************
//--	202507хх Зробив ф-ціонал для RWords
	- Перейшов на Neon(serverBD)
	- Добавив вхід(input) через соц мережі

//--	20250813- Добавл скачування слів з мобільного
//--	20250824- Контрастний напис на картинках у Home     textShadow:
                "-2px -2px 4px rgba(0,0,0,0.8), 2px -2px 4px rgba(0,0,0,0.8), -2px 2px 4px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,0.8)",
//--	20250825- Заборона зміни шрифтів браузерами Chrome i Safari///WebView і Chrome показуватимуть однаковий розмір
        app/globals.css:
            @layer base {
                html {
                    -webkit-text-size-adjust: 100%;
                }
            }

//--	20251010- SEO
1. Увімкнути індексацію сайту
piblic/robots.txt є:
Sitemap: https://rwords.vercel.app/sitemap.xml

2.Створи piblic/sitemap.xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://rwords.vercel.app/</loc></url>
  <url><loc>https://rwords.vercel.app/about_rwords</loc></url>
  <url><loc>https://rwords.vercel.app/about</loc></url>
  <url><loc>https://rwords.vercel.app/words</loc></url>
  <url><loc>https://rwords.vercel.app/listen</loc></url>
  <url><loc>https://rwords.vercel.app/blog</loc></url>
  <url><loc>https://rwords.vercel.app/feedback</loc></url>
</urlset>

🧩 3. Додай мета-теги для SEO і соцмереж/Варіант 1 (сучасний, App Router — Next.js 13+)
У папці app/page.js (для головної) або app/about/page.js тощо — просто додай об’єкт metadata угорі файлу.

export const metadata = {
  title: "RWords — вивчай англійські слова голосом",
  description:
    "RWords — безкоштовний застосунок для вивчення англійських слів із голосовим керуванням, перекладом і вправами.",
  alternates: {
    canonical: "https://rwords.vercel.app/",
  },
  openGraph: {
    title: "RWords — вивчай англійські слова голосом",
    description:
      "Вчи англійські слова легко! Слухай, повторюй і тренуй вимову в RWords.",
    url: "https://rwords.vercel.app/",
    siteName: "RWords",
    locale: "uk_UA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RWords — вивчай англійські слова голосом",
    description:
      "RWords — застосунок для вивчення англійських слів із голосовим керуванням.",
  },
}

🌐 4. Додай сайт у Google Search Console

Зайди на https://search.google.com/search-console
Вибери Domain або URL prefix → введи https://rwords.vercel.app
Підтвердь володіння (Vercel це робить автоматично через DNS)

📈 5. Оптимізуй контент
??? Додай заголовки H1, H2, зрозумілі тексти з ключовими словами типу “вивчення англійських слів”, “тренування словникового запасу”.

Створи короткий опис на головній, у блозі, на сторінці про застосунок.
*************************************************************
//--	20260117- Доробив:
        меню  "Галерея"
        довідники Групи тем картин"/Теми картин/Картини

//--	20260119- Зробити завантаження 1 зображення:
-з формb/через Server Action (App Router)/з обробкою (resize + WebP)
-upload у Cloudinary
-запис у pictures (PostgreSQL)
1.npm install sharp cloudinary
2.Налаштування Cloudinary
    config:/lib/cloudinary.js
    .env.local
3️⃣ Server Action: upload + optimize + DB
    /app/actions/pictures/uploadPictureAction.js
4️⃣ Мінімальні зміни у формі (frontend)/У твоєму Modal тимчасово:Додаємо input

////--	20260125-#  Додаємо картинки в хмару/Cloudinary ***********************************
НЕ грузиться png: бо Server Actions у Next.js за замовчуванням мають ліміт 1MB.
Потрібно збільшити serverActions.bodySizeLimit.
Відкрий:
next.config.js

///--- 20260503 Автогенерпціє відео із тексту (shorts)   --------------------------
    npm install google-auth-library