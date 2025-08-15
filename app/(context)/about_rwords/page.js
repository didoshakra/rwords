// about_rwords/page.js
// about_rwords/page.js
"use client"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"

export default function HowItWorks() {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <main className="px-4 py-8 max-w-4xl mx-auto text-hText dark:text-hTextD">
      <h1 className="inline-flex gap-2 justify-center items-center text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
        <Image src="/images/home/RW_know_64.png" alt="RWords" width={24} height={24} priority />
        Що таке RWords?
      </h1>

      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">
          RWords — мобільний застосунок для Android для вивчення іноземних слів та фраз. Ви оцінюєте свої знання,
          формуєте списки та слухаєте слова циклічно.
        </h2>
      </section>

      <section className="mb-6 text-center py-10 px-6 bg-blue-50 rounded">
        {user ? (
          <Link
            href="/download"
            className="flex gap-2 justify-center items-center bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition text-base md:text-lg"
          >
            <Image src="/images/home/RW_know_64.png" alt="RWords" width={24} height={24} priority />
            До завантаження застосунку ⬇️
          </Link>
        ) : (
          <>
            <p className="mb-6 text-gray-700 text-base md:text-lg">
              Зареєструйтесь, щоб завантажити застосунок RWords, створювати власні словники, публікувати дописи та
              коментувати записи.
            </p>
            <Link
              href="/auth"
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition text-base md:text-lg"
            >
              Увійти або зареєструватись
            </Link>
          </>
        )}
      </section>

      <h1 className="text-3xl font-bold mb-4 text-center">📖 Як працює застосунок RWords</h1>

      {/* Головна ідея */}
      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">🧠 Головна ідея застосунку</h2>
        <p className="mb-2">
          <strong>RWords</strong> дозволяє оцінювати знання голосом або кнопками <strong>Знаю / Не знаю</strong>,
          формуючи персоналізовані списки.
        </p>
        <p>
          Для початку створіть базу даних у налаштуваннях: <strong>Слова</strong>, <strong>Теми</strong>,{" "}
          <strong>Групи тем</strong>. Також доступний імпорт CSV та автоматичний переклад.
        </p>
      </section>

      {/* Елементи інтерфейсу */}
      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">🧩 Елементи інтерфейсу</h2>
        <h3 className="text-lg md:text-xl font-bold mt-2">🔝 Верхня панель</h3>
        <ul className="list-disc pl-5">
          <li>🔙 Стрілка — назад</li>
          <li>🌙 Перемикач теми</li>
          <li>❓ Підказка</li>
          <li>📋 Доступ до довідників: додавання, редагування, CSV-імпорт</li>
        </ul>

        <h3 className="text-lg md:text-xl font-bold mt-2">🔻 Нижня панель</h3>
        <p>Основні іконки навігації в додатку.</p>
      </section>

      {/* Основні екрани */}
      <section className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">🧭 Основні екрани</h2>

        {/* Початковий екран */}
        <div className="mt-8">
          <h4 className="font-semibold text-center mb-2">Початковий екран застосунку</h4>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img src="/rwords_screens/home.jpg" alt="Home" className="w-full md:w-1/2 mx-auto my-4 rounded shadow" />
            <div className="text-lg">
              <h3 className="font-bold mb-1">🔝 Верхня панель</h3>
              <ul className="list-disc pl-10 mb-4">
                <li>🌙 Перемикач теми</li>
                <li>❓ Загальний опис додатку</li>
              </ul>
              <h3 className="font-bold mb-1">🔻 Нижня панель</h3>
              <ul className="list-disc pl-10">
                <li>🏠 Головна</li>
                <li>📖 Слова</li>
                <li>⚙️ Налаштування</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Слова */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center mb-2">🗣️ Слова</h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div className="text-lg">
              <h3 className="font-bold mb-1">🔝 Верхня панель</h3>
              <ul className="list-disc pl-10 mb-4">
                <li>🔙 Вихід на попередній екран</li>
                <li>🎙️ Голосові команди</li>
                <li>⚙️ Налаштування: вибір тем та режимів прослуховування</li>
                <li>❓ Підказка</li>
              </ul>
              <h3 className="font-bold mb-1">🔝 Нижче</h3>
              <ul className="list-disc pl-10 mb-4">
                <li>Напис &quot;Не слухаю&quot;, якщо мікрофон виключений</li>
                <li>Мікрофон посередині, пульсує при включенні</li>
                <li>Справа — розпізнані програмні команди</li>
              </ul>
              <h3 className="font-bold mb-1">🔝 Основні налаштування</h3>
              <ul className="list-disc pl-10">
                <li>🎯 Вибрано слів</li>
                <li>🎯 Вибрані теми</li>
                <li>🎯 Вибрані знання</li>
              </ul>
            </div>
            <img src="/rwords_screens/words.jpg" alt="Words" className="w-full md:w-1/2 mx-auto my-4 rounded shadow" />
          </div>
        </div>

        {/* Налаштування відтворення */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center mb-2">⚙️ Налаштування прослуховування</h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/words_settings.jpg"
              alt="Settings"
              className="w-full md:w-1/2 mx-auto my-4 rounded shadow"
            />
            <div className="text-lg">
              <ul className="list-disc pl-10 mb-4">
                <li>⏱️ Затримка голосу для правильного відображення команд</li>
                <li>🔊 Вираз для озвучки кінця списку</li>
                <li>🔁 Вираз для озвучки початку списку</li>
                <li>🎛️ Всі кнопки в словах відображаються</li>
                <li>🗣️ Мова оригіналу</li>
                <li>🌐 Мова перекладу</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Голосові команди */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center mb-2">🎙️ Налаштування голосових команд</h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/voices_commands.jpg"
              alt="Voice Commands"
              className="w-full md:w-1/2 mx-auto my-4 rounded shadow sm:order-2"
            />
            <div className="text-lg sm:order-1">
              <ul className="list-disc pl-10 mb-4">
                <li>🗣️ Додавання/видалення голосових команд для кнопок</li>
                <li>🗣️ Можна додавати команди голосом</li>
                <li>🗣️ Налаштувати під свій тембр</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Список слів-кнопки */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center mb-2">📋 Список слів-кнопки</h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/words_list_buttons.jpg"
              alt="Words List Buttons"
              className="w-full md:w-1/2 mx-auto my-4 rounded shadow"
            />
            <div className="text-lg">
              <ul className="list-disc pl-10 mb-4">
                <li>1-й рядок — група тем</li>
                <li>2-й рядок — тема</li>
                <li>Слова/фрази на мові оригіналу</li>
                <li>Кнопки: Додати, Імпортувати, Перекласти</li>
                <li>Редагувати або видаляти слова</li>
                <li>Імпорт CSV</li>
                <li>Переклад на інші мови</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Список слів-переміщення */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center mb-2">📋🔀 Список слів-переміщення</h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/words_list.jpg"
              alt="Words List Move"
              className="w-full md:w-1/2 mx-auto my-4 rounded shadow sm:order-2"
            />
            <div className="text-lg">
              <ul className="list-disc pl-10 sm:order-1">
                <li>🎧 Відмітити слово → натиснути &quot;Перемістити&quot; → стрілки ↑/↓ → Готово</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Колірні схеми */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center mb-2">🎨 Налаштування колірних схем</h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/сolors_settings.jpg"
              alt="Colors Settings"
              className="w-full md:w-1/2 mx-auto my-4 rounded shadow"
            />
            <div className="text-lg">
              <ul className="list-disc pl-10">
                <li>🌈 Вибір колірної схеми</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <blockquote className="mt-6 italic border-l-4 border-hBg pl-4">
        RWords — інструмент, який адаптується під вас. Ви керуєте процесом вивчення: що слухати, як оцінювати, коли
        повторювати.
      </blockquote>
    </main>
  )
}
