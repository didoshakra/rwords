// about_rwords/page.js
"use client"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"


// function ScreenBlock({ title, img, children }) {
//   return (
//     <section className="space-y-4 text-xs sm:text-sm lg:text-base mb-6">
//       <h3 className="text-h3Text text-lg sm:text-xl lg:text-2xl font-bold text-center mb-2">{title}</h3>
//       <div className="grid md:grid-cols-2 gap-4 items-center">
//         {img && <img src={img} alt={title} className="w-full md:w-1/2 mx-auto my-4 rounded shadow" />}
//         <div className="text-sm sm:text-base lg:text-lg">{children}</div>
//       </div>
//     </section>
//   )
// }
function ScreenBlock({ title, img, children }) {
  return (
    <section className="space-y-4 text-xs sm:text-sm lg:text-base mb-6">
      <h3 className="text-h3Text text-lg sm:text-xl lg:text-2xl font-bold text-center mb-2">{title}</h3>
      <div className={`grid gap-4 items-center ${img ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
        {img && <img src={img} alt={title} className="w-full md:w-1/2 mx-auto my-4 rounded shadow" />}
        <div className="text-sm sm:text-base lg:text-lg">{children}</div>
      </div>
    </section>
  )
}

export default function RWordsPage({ user }) {
  return (
    <main className="px-4 py-8 max-w-4xl mx-auto text-pText dark:text-pTextD">
      {/* Головний заголовок */}
      <h1 className="inline-flex items-center justify-center gap-2 text-h1Text text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
        <Image src="/images/home/RW_know_64.png" alt="RWords" width={24} height={24} priority />
        Що таке RWords?
      </h1>

      {/* Опис застосунку */}
      <section className="mb-6">
        <h2 className="text-h2Text text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 text-center">
          📖 RWords — мобільний застосунок на Android для вивчення іноземних слів і фраз.
        </h2>
        <p className="text-base sm:text-lg lg:text-xl font-semibold mb-2">
          У застосунку ви можете прослуховувати слова, вирази та речення з перекладом на вибрану мову зі вбудованих
          списків або додавати власні слова й теми — як безпосередньо в застосунку, так і через сайт за допомогою
          імпорту. Під час прослуховування оцінюєте свої знання кнопками чи голосом «Знаю» / «Не знаю». Це формує
          персональні списки: слова, позначені як «Знаю», можна виключати з подальшого відтворення.
        </p>
      </section>

      {/* Секція кнопок */}
      <section className="bg-pBg1 text-sm sm:text-base lg:text-lg mb-6 text-center py-10 px-6 rounded">
        {user ? (
          <Link
            href="/download"
            className="flex items-center justify-center gap-2 bg-pBg text-pText dark:text-pTextD px-6 py-3 rounded hover:bg-pBgHov transition"
          >
            <Image src="/images/home/RW_know_64.png" alt="RWords" width={24} height={24} priority />
            До завантаження застосунку ⬇️
          </Link>
        ) : (
          <>
            <p className="mb-6">
              Зареєструйтесь, щоб завантажити RWords, створювати словники, публікувати дописи та коментувати записи.
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

      {/* Як працює */}
      <h2 className="text-h2Text text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 text-center">
        📖 Як працює застосунок RWords
      </h2>

      <ScreenBlock title="🧠 Головна ідея застосунку">
        <p>
          <strong>RWords</strong> дозволяє оцінювати знання голосом або кнопками <strong>Знаю / Не знаю</strong>,
          формуючи персоналізовані списки.
        </p>
        <p>
          Створіть базу даних у налаштуваннях: <strong>Слова</strong>, <strong>Теми</strong>, <strong>Групи тем</strong>
          . Доступний імпорт CSV та автоматичний переклад.
        </p>
      </ScreenBlock>

      <ScreenBlock title="🧭 Навігаційні екрани">
        <ul className="list-disc pl-10 space-y-2">
          <li>
            <strong>🏠 Home</strong> — титульний екран
          </li>
          <li>
            <strong>🎧 Слухати</strong> — головний екран, де можна:
            <ul className="list-disc pl-6">
              <li>налаштовувати голосові команди та параметри циклічного відтворення</li>
              <li>обирати початок прослуховування або продовження</li>
              <li>оцінювати знання кнопками або голосом</li>
            </ul>
          </li>
          <li>
            <strong>🌐 wwwRWords</strong> — перехід на сайт для нових списків слів
          </li>
          <li>
            <strong>☰ Меню</strong> — налаштування, колірні теми, оновлення додатку
          </li>
        </ul>
      </ScreenBlock>

      <ScreenBlock title="🧭 Основні екрани">
        <ScreenBlock title="Початковий екран застосунку" img="/rwords_screens/scr_home.jpg">
          <h4 className="font-semibold mb-1">🔝 Верхня панель</h4>
          <ul className="list-disc pl-10 mb-4">
            <li>🌙 Перемикач теми</li>
            <li>❓ Загальний опис додатку</li>
          </ul>
          <h4 className="font-bold mb-1">🔻 Нижня панель</h4>
          <ul className="list-disc pl-10">
            <li>🏠 Головна</li>
            <li>🎧 Слухати</li>
            <li>🌐 wwwRWords</li>
            <li>☰ Меню</li>
          </ul>
        </ScreenBlock>

        <ScreenBlock title="🗣️ Слова/Налаштування і інформація" img="/rwords_screens/scr_wordsInfo.jpg">
          <h4 className="font-bold mb-1">🔝 Верхня панель</h4>
          <ul className="list-disc pl-10 mb-4">
            <li>❓ Підказка</li>
          </ul>
          <h4 className="font-bold mb-1">🔻 Нижче</h4>
          <ul className="list-disc pl-10 mb-4">
            <li>Напис «Голос» або «Не слухаю», якщо мікрофон виключений</li>
            <li>Мікрофон посередині, пульсує при включенні</li>
            <li>Справа — розпізнані програмні команди</li>
          </ul>
          <h4 className="font-bold mb-1">⚙️ Основні налаштування і інформація</h4>
          <ul className="list-disc pl-10">
            <li>🎙️ Голосові команди</li>
            <li>⚙️ Вибір тем та режимів прослуховування</li>
            <li>🎯 Вибрано слів</li>
            <li>🔻 Вибрані теми</li>
            <li>🔻 Вибрані знання</li>
            <li>▶️ Кнопки «↺ З початку» / «▶️ Продовжити»</li>
          </ul>
        </ScreenBlock>

        <ScreenBlock title="🗣️ Слова/Прослуховування" img="/rwords_screens/scr_wordsPlay.jpg">
          <h4 className="font-bold mb-1">🔝 Нижче</h4>
          <ul className="list-disc pl-10 mb-4">
            <li>Напис «Не слухаю», якщо мікрофон виключений</li>
            <li>Мікрофон посередині, пульсує при включенні</li>
            <li>Справа — розпізнані програмні команди</li>
          </ul>
          <h4 className="font-bold mb-1">🔝 Основні налаштування</h4>
          <ul className="list-disc pl-10">
            <li>🎯 Вибрано слів</li>
            <li>🎯 Вибрані теми</li>
            <li>🎯 Вибрані знання</li>
          </ul>
        </ScreenBlock>
      </ScreenBlock>
    </main>
  )
}