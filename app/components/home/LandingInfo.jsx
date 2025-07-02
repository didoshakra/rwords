// LandingInfo.jsx
//Для Home
const LandingInfo = () => {
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
          <p className="text-gray-600 text-sm">Переглядай, створюй або завантажуй словники з підтримкою імпорту CSV.</p>
        </div>
        <div className="bg-white shadow-md p-5 rounded-md border hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">🧠 Теми та групи</h3>
          <p className="text-gray-600 text-sm">Об`'`єднуй слова у теми та групи тем для ефективнішого вивчення.</p>
        </div>
        <div className="bg-white shadow-md p-5 rounded-md border hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">📝 Статті</h3>
          <p className="text-gray-600 text-sm">
            Читай поради, інструкції, історії інших користувачів та ділись своїм досвідом.
          </p>
        </div>
      </section>

      {/* ✅ 4. CTA: Зареєструйтесь */}
      <section className="text-center py-10 px-6 bg-blue-50">
        <h3 className="text-xl font-semibold mb-4">Готові почати?</h3>
        <p className="mb-6 text-gray-700">
          Зареєструйтесь, щоб скачати додаток, створювати свої словники або коментувати пости.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
          Створити акаунт
        </button>
      </section>
    </>
  )
}

export default LandingInfo
