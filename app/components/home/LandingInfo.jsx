// LandingInfo.jsx
//Для Home
"use client"
import Link from "next/link"
// import { useAuth } from "@/app/context/AuthContext"
import { useSession } from "next-auth/react"

const LandingInfo = () => {
//   const { user, logout } = useAuth()
  const { data: session, status } = useSession()
  const user = session?.user

  return (
    <>
      <main className="px-4 py-8 max-w-3xl mx-auto text-hText dark:text-hTextD">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          👋 Вітаємо на RWords — спільноті для вивчення іноземних слів
        </h1>

        <p className="text-lg mb-6">
          Сайт <strong> RWords</strong> — це платформа для людей, які вивчають мови за допомогою мобільного застосунку{" "}
          <Link href="/about_rwords" className="italic font-semibold text-blue-900 hover:underline">
            RWords.
          </Link>{" "}
          Вона створена для того, щоб мати можливість самостійно готувати контент(слова, вирази, речення), групувати їх
          по темах і завантажувати безпосередньо з застосунку, для подальшого вивчення. Ми прагнемо зробити вивчення мов
          більш доступним і цікавим для всіх! (і для себе також)
        </p>

        <h2 className="text-2xl font-semibold mb-2">🧠 Тут ви можете:</h2>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>📱 Завантажити мобільний застосунок RWords для Android</li>
          <li>📋 Знайти готові списки слів, створювати власні та обмінюватись ними з іншими користувачами</li>
          <li>📝 Ділитись досвідом вивчення слів у блозі, створюючи свої дописи і коментуючи чужі</li>
          <li>💡 Давати пропозиції по розвитку як сайту, так і застосунку, створюючи дописи у блозі</li>
          <li>💬 Коментувати записи в блозі, створені іншими користувачами</li>
          <li>🗂 Імпортувати слова зі списків на цьому сайті (або створювати власні)</li>
          <li>🌐 Зробити автоматичний переклад на будь-яку мову</li>
          <li>🔁 Слухати: слово → переклад → оцінка (знаю / не знаю)(в розробці)</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">🎯 Навіщо цей сайт?</h2>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>
            Ділитись списками слів за темами: <em>подорожі, побут, робота, культура тощо</em>
          </li>
          <li>Знаходити та завантажувати готові списки для свого рівня і мови</li>
          <li>Обговорювати все у блозі, ділитись ідеями, залишати коментарі</li>
        </ul>

        {/* ✅ 4. CTA: Зареєструйтесь */}
        <section className="bg-yellow-100 text-center py-10 px-6 bg-blue-50">
          {user ? (
            <>
              <h3 className="text-xl font-semibold mb-4">Дякуємо, що з нами!</h3>
              <p className="mb-6 text-gray-700">
                Ви вже зареєстровані. Тепер ви можете користуватись усіма можливостями сайту.
              </p>
              <Link
                href="/download"
                className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
              >
                ⬇️Завантажити застосунок RWords
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-4">Готові почати?</h3>
              <p className="mb-6 text-gray-700">
                Зареєструйтесь, щоб завантажити застосунок RWords, створювати власні словники для вивчення слів,
                публікувати дописи та коментувати записи інших користувачів.
              </p>
              <Link href="/auth" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
                Увійти або зареєструватись
              </Link>
            </>
          )}
        </section>

        <blockquote className="mt-8 italic border-l-4 border-hBg pl-4 text-hTextD dark:text-hTextHovD">
          Сайт RWords — це про навчання разом. Ми вивчаємо. Ми ділимось. Ми ростемо.
        </blockquote>
      </main>
      {/* ✅ 2. Про застосунок */}
      <section className="px-6 py-10 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Що таке застосунок RWords?</h2>
        <p className="text-gray-700 text-lg">
          <strong>RWords</strong> — це мобільний застосунок для android для вивчення іноземних слів та виразів за
          допомогою голосових і кнопкових команд. Ви самі оцінюєте свої знання, формуєте списки вивчення та слухаєте
          слова у циклічному режимі.{" "}
        </p>
        <Link href="/about_rwords" className="italic font-semibold text-blue-900 hover:underline">
          Більше про RWords.
        </Link>
      </section>

      {/* ✅ 3. Основні можливості */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-10 max-w-6xl mx-auto">
        <div className="bg-white shadow-md p-5 rounded-md border hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">📚 Словники</h3>
          <p className="text-gray-600 text-sm">Переглядай, створюй або імпортуй списки слів із файлів формату .csv.</p>
        </div>

        <div className="bg-white shadow-md p-5 rounded-md border hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">🧠 Теми та групи</h3>
          <p className="text-gray-600 text-sm">
            об&#39;єднуй слова за темами й групами для зручнішого та ефективнішого вивчення.
          </p>
        </div>

        <div className="bg-white shadow-md p-5 rounded-md border hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">📝 Статті</h3>
          <p className="text-gray-600 text-sm">
            Читай поради, інструкції, історії інших користувачів і ділись власним досвідом.
          </p>
        </div>

        <div className="bg-white shadow-md p-5 rounded-md border hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">🗂️ Профілі для завантаження</h3>
          <p className="text-gray-600 text-sm">Формуй профілі для завантаження, обираючи теми, які хочеш вивчати.</p>
        </div>

        <div className="bg-white shadow-md p-5 rounded-md border hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">📥 Завантаження тем</h3>
          <p className="text-gray-600 text-sm">
            Завантажуй готові теми для вивчення безпосередньо з застосунку RWords.
          </p>
        </div>

        <div className="bg-white shadow-md p-5 rounded-md border hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">📱 Застосунок RWords</h3>
          <p className="text-gray-600 text-sm">
            Встанови мобільний застосунок RWords, щоб вивчати слова й фрази з перевіркою знань та голосовим керуванням.
          </p>
        </div>
      </section>
    </>
  )
}

export default LandingInfo
