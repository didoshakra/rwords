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
      <main className="px-4 py-8 max-w-3xl mx-auto text-gray-900 dark:text-gray-100 font-sans">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          👋 Вітаємо на RWords — спільноті для вивчення іноземних слів
        </h1>

        <p className="text-base sm:text-lg md:text-xl mb-6 leading-relaxed">
          Сайт <strong>RWords</strong> — це платформа для людей, які вивчають мови за допомогою мобільного застосунку{" "}
          <Link
            href="/about_rwords"
            className="inline-flex justify-center items-center gap-2 italic font-semibold text-blue-900 hover:underline align-middle"
          >
            <Image src="/images/home/RW_know_64.png" alt="RWords" width={24} height={24} priority={true} />
            RWords.
          </Link>{" "}
          Вона створена для того, щоб мати можливість самостійно готувати контент, групувати його по темах і
          завантажувати безпосередньо з застосунку. Ми прагнемо зробити вивчення мов більш доступним і цікавим для всіх!
        </p>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2">🧠 Тут ви можете:</h2>
        <ul className="list-disc pl-6 mb-6 space-y-1 text-base sm:text-lg">
          {/* <p className="text-base sm:text-lg md:text-xl mb-6 leading-relaxed"> */}
          <li className="leading-relaxed">
            📱 Завантажити мобільний застосунок {" "}
            <Link
              href="/about_rwords"
              className="inline-flex justify-center items-center gap-2 italic font-semibold text-blue-900 hover:underline align-middle"
            >
              <Image src="/images/home/RW_know_64.png" alt="RWords" width={24} height={24} priority={true} />
              RWords.
            </Link>{" "}
            для Android
          </li>
          {/* <li className="inline-flex justify-center items-center gap-2">
            <span>
              📱 Завантажити мобільний застосунок <strong>RWords</strong>
            </span>
            <Image
              src="/images/home/RW_know_64.png"
              alt="RWords"
              width={24}
              height={24}
              className="shrink-0 mt-1"
              priority={true}
            />
            <span>для Android</span>
          </li> */}
          {/* <li className="flex items-start gap-2">
            <span className="flex-1 leading-snug">
              📱 Завантажити мобільний застосунок <strong>RWords</strong>
            </span>
            <Image
              src="/images/home/RW_know_64.png"
              alt="RWords"
              width={24}
              height={24}
              className="shrink-0 mt-1"
              priority={true}
            />
            <span className="flex-1 leading-snug">для Android</span>
          </li> */}
          <li>📋 Знайти готові списки слів, створювати власні та обмінюватись ними з іншими користувачами</li>
          <li>📝 Ділитись досвідом вивчення слів у блозі</li>
          <li>💡 Давати пропозиції по розвитку сайту та застосунку</li>
          <li>💬 Коментувати записи в блозі</li>
          <li>🗂 Імпортувати слова зі списків на сайті</li>
          <li>🌐 Зробити автоматичний переклад на будь-яку мову</li>
          <li>🔁 Слухати слова → переклад → оцінка (в розробці)</li>
        </ul>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2">🎯 Навіщо цей сайт?</h2>
        <ul className="list-disc pl-6 mb-6 space-y-1 text-base sm:text-lg">
          <li>
            Ділитись списками слів за темами: <em>подорожі, побут, робота, культура</em>
          </li>
          <li>Знаходити та завантажувати готові списки для свого рівня і мови</li>
          <li>Обговорювати все у блозі, залишати коментарі</li>
        </ul>

        <section className="bg-blue-50 text-center py-10 px-6 rounded-md">
          {user ? (
            <>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Дякуємо, що з нами!</h3>
              <p className="mb-6 text-gray-700 text-base sm:text-lg">
                Ви вже зареєстровані. Тепер ви можете користуватись усіма можливостями сайту.
              </p>
              <Link
                href="/download"
                className="flex gap-2 justify-center items-center bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition text-base sm:text-lg"
              >
                <Image src="/images/home/RW_know_64.png" alt="RWords" width={24} height={24} priority={true} />
                Завантажити застосунок RWords ⬇️
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Готові почати?</h3>
              <p className="mb-6 text-gray-700 text-base sm:text-lg">
                Зареєструйтесь, щоб завантажити застосунок RWords, створювати словники, публікувати дописи та
                коментувати записи.
              </p>
              <Link
                href="/auth"
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition text-base sm:text-lg"
              >
                Увійти або зареєструватись
              </Link>
            </>
          )}
        </section>

        <blockquote className="mt-8 italic border-l-4 border-gray-300 pl-4 text-gray-700 dark:text-gray-400 text-base sm:text-lg">
          Сайт RWords — це про навчання разом. Ми вивчаємо. Ми ділимось. Ми ростемо.
        </blockquote>
      </main>

      <section className="px-6 py-10 text-center max-w-3xl mx-auto">
        <h2 className="flex gap-2 justify-center items-center text-xl sm:text-2xl md:text-3xl font-bold mb-4">
          <Image src="/images/home/RW_know_64.png" alt="RWords" width={24} height={24} priority={true} />
          Що таке застосунок RWords?
        </h2>
        <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed">
          <strong>RWords</strong> — мобільний застосунок для Android для вивчення іноземних слів та виразів. Ви оцінюєте
          знання, формуєте списки та слухаєте слова у циклічному режимі.
        </p>
        <Link href="/about_rwords" className="italic font-semibold text-blue-900 hover:underline text-base sm:text-lg">
          Більше про RWords.
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-10 max-w-6xl mx-auto">
        {[
          { title: "📚 Словники", desc: "Переглядай, створюй або імпортуй списки слів із файлів формату .csv." },
          { title: "🧠 Теми та групи", desc: "Об'єднуй слова за темами й групами для ефективного вивчення." },
          {
            title: "📝 Статті",
            desc: "Читай поради, інструкції, історії інших користувачів і ділись власним досвідом.",
          },
          {
            title: "🗂️ Профілі для завантаження",
            desc: "Формуй профілі для завантаження, обираючи теми для вивчення.",
          },
          { title: "📥 Завантаження тем", desc: "Завантажуй готові теми для вивчення безпосередньо з застосунку." },
          {
            title: "📱 Застосунок RWords",
            desc: "Встанови мобільний застосунок RWords для перевірки знань та голосового керування.",
          },
        ].map((item, i) => (
          <div key={i} className="bg-white shadow-md p-5 rounded-md border hover:shadow-lg transition">
            <h3 className="text-lg sm:text-xl md:text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm sm:text-base">{item.desc}</p>
          </div>
        ))}
      </section>
    </>
  )
}

export default LandingInfo
