// LandingInfo.jsx
"use client"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"

const LandingInfo = () => {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <>
      <main className="px-4 py-6 max-w-3xl mx-auto text-pOn dark:text-pOnD font-body text-sm sm:text-base lg:text-lg">
        <section className="bg-kBg dark:bg-kBgD text-kOn dark:text-kOnD text-center py-4 px-4 rounded-md">
          {/* {user ? ( */}
          <>
            {/* <h3 className="text-h1On text-base sm:text-lg lg:text-xl font-medium mb-3">Дякуємо, що з нами!</h3> */}
            {/* <p className="mb-5 font-medium">
                Ви вже зареєстровані. Тепер ви можете користуватись усіма можливостями сайту.
              </p> */}
            <Link
              href="/download"
              // className="flex gap-2 justify-center items-center bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
              className="flex gap-2 justify-center items-center bg-btBg text-btOn px-2 py-2 rounded hover:bg-btBgHov transition"
            >
              <Image src="/images/home/RW_know_64.png" alt="RWords" width={20} height={20} priority />
              До завантаження застосунку ⬇️
            </Link>
          </>
          {/* ) : (
            <>
              <h3 className="text-h1On text-base sm:text-lg lg:text-xl font-bold mb-3">Готові почати?</h3>
              <p className="mb-5 text-pOn  dark:text-pOnD font-semibold">
                Зареєструйтесь, щоб завантажити застосунок RWords.
              </p>
              <Link
                href="/auth"
                className="font-semiboldinline-block bg-btBg text-btOn hover:bg-btBgHov px-5 py-2 rounded transition text-sm sm:text-base lg:text-lg"
              >
                Увійти або зареєструватись
              </Link>
            </>
          )} */}
        </section>
        <h1 className="text-h1On font-heading text-xl sm:text-2xl lg:text-3xl font-bold my-6 mb-3">
          👋 Вітаємо на RWords
        </h1>
        <p className="leading-relaxed">
          Сайт <strong>RWords</strong> — це спроба створити платформу для людей, які вивчають мови за допомогою
          мобільного застосунку{" "}
          <Link
            href="/about_rwords"
            className="inline-flex justify-center items-center gap-2 italic font-semibold text-linkOn dark:text-linkOnD hover:underline align-middle"
          >
            <Image src="/images/home/RW_know_64.png" alt="RWords" width={20} height={20} priority />
            RWords.
          </Link>{" "}
          Вона створена для того, щоб мати можливість самостійно готувати контент(списки слів, виразів, речень),
          групувати його по темах і завантажувати безпосередньо з застосунку. Ми прагнемо зробити вивчення мов більш
          доступним і цікавим для всіх!
        </p>

        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 text-h2On">🎯 Навіщо цей сайт?</h2>
        <ul className="list-disc pl-5 mb-5 space-y-1">
          <li>
            💬 Ділитись списками слів за темами: <em>подорожі, побут, робота, культура</em>
          </li>
          <li>📥 Знаходити та завантажувати готові списки для свого рівня і мови</li>
          <li>🧠 Обговорювати все у блозі, залишати коментарі</li>
        </ul>

        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 text-h2On">🧠 Тут ви можете:</h2>
        <ul className="list-disc pl-5 mb-5 space-y-1 ">
          <li className="leading-relaxed">
            📱 Завантажити мобільний застосунок{" "}
            <Link
              href="/about_rwords"
              className="inline-flex justify-center items-center gap-2 italic font-semibold text-linkOn dark:text-linkOnD hover:underline"
            >
              <Image src="/images/home/RW_know_64.png" alt="RWords" width={20} height={20} priority />
              RWords
            </Link>{" "}
            для Android
          </li>
          <li>📋 Знайти готові списки слів, створювати власні та обмінюватись ними з іншими користувачами</li>
          <li>📝 Ділитись досвідом вивчення слів у блозі</li>
          <li>💡 Давати пропозиції по розвитку сайту та застосунку</li>
          <li>💬 Коментувати записи в блозі</li>
          <li>🗂 Додавати свої слова та вирази, прямо додаючи їх в довідники, а також імпортувати з файлів .csv</li>
          <li>🌐 Перекладати слова автоматично на будь-яку мову</li>
          {/* <li>🔁 Слухати слова безпосередньо на сайті(не в додатку)  → переклад → оцінка (поки в розробці)</li> */}
        </ul>

        <blockquote className="mt-6 italic border-l-4 border-gray-300 pl-4 ">
          {/* <blockquote className="mt-6 italic border-l-4 border-gray-300 pl-4 text-gray-700 dark:text-gray-300 font-medium"> */}
          Сайт RWords — це про навчання разом. Ми вивчаємо. Ми ділимось. Ми ростемо.
        </blockquote>
      </main>

      <section className=" px-4 py-8 text-pOn dark:text-pOnD text-center max-w-3xl mx-auto">
        <h2 className="text-h2On flex gap-2 justify-center items-center text-lg sm:text-xl lg:text-2xl font-heading font-bold mb-3">
          <Image src="/images/home/RW_know_64.png" alt="RWords" width={20} height={20} priority />
          Що таке RWords?
        </h2>
        <p className="mb-5">
          <strong>RWords</strong> — мобільний застосунок для Android для вивчення іноземних слів та виразів. Ви оцінюєте
          знання, формуєте списки та слухаєте слова у циклічному режимі.
        </p>
        <Link
          href="/about_rwords"
          className="italic font-semibold text-linkOn hover:underline text-sm sm:text-base lg:text-lg"
        >
          Більше про RWords.
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-8 max-w-6xl mx-auto">
        {[
          {
            id: "app",
            title: "📱 Застосунок RWords",
            desc: "Встанови мобільний застосунок RWords для перевірки знань і голосового керування.",
          },
          {
            id: "dict",
            title: "📚 Словники",
            desc: "Переглядай, створюй або імпортуй списки слів із файлів формату .csv.",
          },
          {
            id: "topics",
            title: "🧠 Теми та групи",
            desc: "Об'єднуй слова за темами й групами для ефективного вивчення.",
          },
          {
            id: "articles",
            title: "📝 Статті",
            desc: "Читай поради, інструкції, історії інших користувачів і ділись власним досвідом.",
          },
          { id: "profiles", title: "🗂️ Формуй профілі", desc: "Формуй профілі, обираючи теми для вивчення." },
          { id: "downloads", title: "📥 Завантаження тем", desc: "Завантажуй готові теми безпосередньо в застосунок." },
        ].map((item) => (
          <div
            key={item.id}
            // className="bg-white dark:bg-gray-900 shadow-md p-4 rounded-md border hover:shadow-lg transition"
            className="bg-k1Bg dark:bg-k1BgD shadow-md p-4 rounded-md border hover:shadow-lg transition"
          >
            <h3 className="text-h1On text-sm sm:text-base lg:text-lg font-semibold mb-1">{item.title}</h3>
            <p className="text-k1On d">{item.desc}</p>
          </div>
        ))}
      </section>
    </>
  )
}

export default LandingInfo
