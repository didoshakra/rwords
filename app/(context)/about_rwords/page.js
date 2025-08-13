// about_rwords/page.js
"use client"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"

export default function HowItWorks() {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <main className="px-4 py-6 max-w-4xl mx-auto text-hText dark:text-hTextD">
      {/* Заголовок */}
      <h1 className="flex flex-col sm:flex-row gap-2 justify-center items-center text-[clamp(1.5rem,4vw,2rem)] font-bold mb-4">
        <Image src="/images/home/RW_know_64.png" alt="RWords" width={24} height={24} priority={true} />
        Що таке застосунок RWords1?
      </h1>

      {/* Опис */}
      <section className="mb-6">
        <h2 className="text-[clamp(1rem,3vw,1.5rem)] font-semibold mb-2 leading-relaxed">
          RWords — це мобільний застосунок для Android для вивчення іноземних слів та виразів за допомогою голосових і
          кнопкових команд. Ви самі оцінюєте свої знання, формуєте списки вивчення та слухаєте слова у циклічному
          режимі.
        </h2>
      </section>

      {/* CTA */}
      <section className="mb-6 bg-blue-50 text-center py-6 px-4 rounded">
        {user ? (
          <Link
            href="/download"
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition text-[clamp(0.875rem,2.5vw,1rem)] inline-block"
          >
            ⬇️ Завантажити застосунок RWords
          </Link>
        ) : (
          <>
            <p className="mb-4 text-[clamp(0.875rem,2.5vw,1rem)] text-gray-700 leading-relaxed">
              Зареєструйтесь, щоб завантажити застосунок RWords, створювати власні словники для вивчення слів,
              публікувати дописи та коментувати записи інших користувачів.
            </p>
            <Link
              href="/auth"
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition text-[clamp(0.875rem,2.5vw,1rem)] inline-block"
            >
              Увійти або зареєструватись
            </Link>
          </>
        )}
      </section>

      {/* Як працює */}
      <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-bold mb-4 text-center">📖 Як працює застосунок RWords</h1>

      <section className="mb-6 space-y-6">
        {/* Головна ідея */}
        <div>
          <h2 className="text-[clamp(1.25rem,3vw,1.5rem)] font-semibold mb-2">🧠 Головна ідея застосунку</h2>
          <p className="text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed">
            <strong>RWords</strong> дозволяє під час прослуховування слів чи фраз оцінювати свої знання за допомогою
            голосових або кнопкових команд <strong>Знаю / Не знаю</strong>. Так ви формуєте персоналізовані списки для
            навчання.
          </p>
          <p className="text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed">
            Щоб почати, потрібно створити базу даних у налаштуваннях: <strong>Слова</strong>, <strong>Теми</strong> і{" "}
            <strong>Групи тем</strong>. В налаштуваннях також доступний імпорт слів із CSV та автоматичний переклад.
          </p>
        </div>

        {/* Елементи інтерфейсу */}
        <div>
          <h2 className="text-[clamp(1.25rem,3vw,1.5rem)] font-semibold mb-2">🧩 Елементи інтерфейсу</h2>

          <h3 className="text-[clamp(1.125rem,2.8vw,1.25rem)] font-bold mt-2">🔝 Верхня панель</h3>
          <ul className="list-disc pl-5 text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed">
            <li>🔙 Стрілка — назад</li>
            <li>🌙 Перемикач теми</li>
            <li>❓ Підказка</li>
            <li>📋 Доступ до довідників: додавання, редагування, CSV-імпорт</li>
          </ul>

          <h3 className="text-[clamp(1.125rem,2.8vw,1.25rem)] font-bold mt-2">🔻 Нижня панель</h3>
          <p className="text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed">Основні іконки навігації в додатку.</p>
        </div>

        {/* Основні екрани */}
        <div>
          <h2 className="text-[clamp(1.25rem,3vw,1.5rem)] font-semibold mb-2 text-center">🧭 Основні екрани</h2>

          {/* Приклад адаптивної секції: Home */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2 items-center">
            <img src="/rwords_screens/home.jpg" alt="Титульний екран Home" className="w-full rounded shadow" />
            <div className="space-y-2">
              <h3 className="text-[clamp(1rem,2.5vw,1.125rem)] font-bold">🔝 Верхня панель</h3>
              <ul className="list-disc pl-5 text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed">
                <li>🌙 Перемикач теми</li>
                <li>❓ Загальний опис додатку</li>
              </ul>
              <h3 className="text-[clamp(1rem,2.5vw,1.125rem)] font-bold">🔻 Нижня панель</h3>
              <ul className="list-disc pl-5 text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed">
                <li>🏠 Головна</li>
                <li>📖 Слова</li>
                <li>⚙️ Налаштування</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Блок цитати */}
      <blockquote className="mt-6 italic border-l-4 border-hBg pl-4 text-[clamp(0.875rem,2.5vw,1rem)]">
        RWords — це інструмент, який адаптується під вас. Ви керуєте процесом вивчення: що слухати, як оцінювати, коли
        повторювати.
      </blockquote>
    </main>
  )
}
