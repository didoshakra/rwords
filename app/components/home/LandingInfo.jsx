// LandingInfo.jsx
//Для Home
"use client"
import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"

const LandingInfo = () => {
  const { user, logout } = useAuth()

  return (
    <>
      {/* ✅ 2. Про застосунок */}
      <section className="px-6 py-10 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Що таке RWords?</h2>
        <p className="text-gray-700 text-lg">
          <strong>RWords</strong> — це мобільний застосунок для вивчення іноземних слів та виразів за допомогою
          голосових і кнопкових команд. Ви самі оцінюєте свої знання, формуєте списки вивчення та слухаєте слова у
          циклічному режимі.
        </p>
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

      {/* ✅ 4. CTA: Зареєструйтесь */}
      <section className="text-center py-10 px-6 bg-blue-50">
        {user ? (
          <>
            <h3 className="text-xl font-semibold mb-4">Дякуємо, що з нами!</h3>
            <p className="mb-6 text-gray-700">
              Ви вже зареєстровані. Перейдіть до свого профілю або завантажте застосунок RWords нижче.
            </p>
            <Link href="/profile" className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition">
              Перейти в профіль
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
    </>
  )
}

export default LandingInfo
