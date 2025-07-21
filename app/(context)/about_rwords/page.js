// about_rwords/page.js
export default function HowItWorks() {
  return (
    <main className="px-4 py-8 max-w-4xl mx-auto text-hText dark:text-hTextD">
      <h1 className="text-3xl font-bold mb-4">📖 Як працює застосунок RWords</h1>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">🔷 Головна ідея застосунку</h2>
        <p className="mb-2">
          <strong>RWords</strong> дозволяє під час прослуховування слів чи фраз оцінювати свої знання за допомогою
          голосових або кнопкових команд <strong>Знаю / Не знаю</strong>. Так ви формуєте персоналізовані списки для
          навчання.
        </p>
        <p>
          Щоб почати, потрібно створити базу даних у налаштуваннях: <strong>Слова</strong>, <strong>Теми</strong> і{" "}
          <strong>Групи тем</strong>. В налаштуваннях також доступний імпорт слів із CSV та автоматичний переклад.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-center">🧭 Основні екрани</h2>

        {/* Home */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center">🏠 Головна</h3>
          <h4 className="text-nowrap font-semibold text-center mb-1">Початковий екран</h4>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/home.jpg"
              alt="Титульний екран Home"
              className="w-full md:w-1/2  md:order-1 mx-auto my-4 rounded shadow"
            />

            <ul className="list-disc pl-5 text-lg md:order-2">
              <h3 className="text-base font-bold">🔝 Верхня панель</h3>
              <li>🌙 Перемикач теми</li>
              <li>❓ Загальний опис додатку.</li>
              <h3 className="text-base font-bold">🔻 Нижня панель-Основні іконки навігації:</h3>
              <li>🏠 Головна</li>
              <li>📖 Слова</li>
              <li>⚙️ Налаштування</li>
            </ul>
          </div>
        </div>

        {/* Words */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center">🗣️ Слова</h3>
          <h4 className="text-nowrap font-semibold text-center mb-1">
            Початковий екран прослуховування слів на якому відображаються :
          </h4>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <ul className="list-disc pl-5 text-lg md:order-1">
              <li>🔝 Верхня панель екрану :</li>
              <li>🔙 Вихід на попередній екран</li>
              <li>🎤 Налаштування голосових команд</li>
              <li>⚙️ Налаштування: прослуховування слів(вибір тем,і режимів прослуховування) </li>
              <li>❓ Підказка</li>
              <li>🔝 Трохи ннижче :</li>
              <li>
                Злівва від мікрофона напис &quot;Не слухаю&quot; — коли виключений мікрофон / коли мікрофон включений,
                то відображаються розпізнані слова
              </li>
              <li>🔝 Трохи ннижче :</li>
              <li>Розмішена інформаційна панель на якій відображається</li>
              <li>Зправа від мікрофона відображаються розпізнані програмні команди</li>
              <li>Навігація: голосові команди або кнопки.</li>
              <li>Налаштування: 🎤 голос, 🔁 повтор, ⚙️ інші параметри.</li>
            </ul>
            <img
              src="/rwords_screens/words.jpg"
              alt="Головний екран Слова"
              //   className="rounded-xl shadow-lg max-w-full md:order-2"
              className="w-full md:w-1/2 md:order-2 mx-auto my-4 rounded shadow"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center mb-4">🎨Налаштування відтворення</h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/words_settings.jpg"
              alt="Екран налаштувань"
              className="w-full md:w-1/2 md:order-1 mx-auto my-4 rounded shadow"
            />
            <ul className="list-disc pl-5 text-lg md:order-2">
              <li>Доступ до довідників: Слова, Теми, Групи тем.</li>
              <li>🌈 Колірні схеми оформлення.</li>
            </ul>
          </div>
        </div>

        {/* voices_commands */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center mb-4">🗣️ Налаштування голосових команд</h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <ul className="list-disc pl-5 text-lg md:order-1">
              <li>Додавайте(змінюйте) голосові команди до команд управління.</li>
              <li>Додавайте нові коланди голосом: 🎤 голос, 🔁 повтор, ⚙️ інші параметри.</li>
              <li>Налаштовуйте голосові команди під свій голос.</li>
            </ul>
            <img
              src="/rwords_screens/voices_commands.jpg"
              alt="Головний екран Слова"
              //   className="rounded-xl shadow-lg max-w-full md:order-2"
              className="w-full md:w-1/2 md:order-2 mx-auto my-4 rounded shadow"
            />
          </div>
        </div>

        {/* сolors_settings*/}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center mb-4">🎨Налаштування колірних схем</h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/сolors_settings.jpg"
              alt="Екран налаштувань"
              className="w-full md:w-1/2 md:order-1 mx-auto my-4 rounded shadow"
            />
            <ul className="list-disc pl-5 text-lg md:order-2">
              <li>Доступ до довідників: Слова, Теми, Групи тем.</li>
              <li>🌈 Колірні схеми оформлення.</li>
            </ul>
          </div>
        </div>
        {/* words_run */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center mb-4">🗣️ Відтворення слів</h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <ul className="list-disc pl-5 text-lg md:order-1">
              <li>Прослуховуйте слова та оцінюйте знання.</li>
              <li>Навігація: голосові команди або кнопки.</li>
              <li>Налаштування: 🎤 голос, 🔁 повтор, ⚙️ інші параметри.</li>
            </ul>
            <img
              src="/rwords_screens/words_run.jpg"
              alt="Головний екран Слова"
              //   className="rounded-xl shadow-lg max-w-full md:order-2"
              className="w-full md:w-1/2 md:order-2 mx-auto my-4 rounded shadow"
            />
          </div>
        </div>

        {/* words_list */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center mb-4">🎨 Список слів-переміщення </h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/words_list.jpg"
              alt="Екран налаштувань"
              className="w-full md:w-1/2 md:order-1 mx-auto my-4 rounded shadow"
            />
            <ul className="list-disc pl-5 text-lg md:order-2">
              <li>Доступ до довідників: Слова, Теми, Групи тем.</li>
              <li>🌈 Колірні схеми оформлення.</li>
            </ul>
          </div>
        </div>
        {/* words_list_buttons */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center mb-4">🗣️ Список слів-кнопки</h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <ul className="list-disc pl-5 text-lg md:order-1">
              <li>Прослуховуйте слова та оцінюйте знання.</li>
              <li>Навігація: голосові команди або кнопки.</li>
              <li>Налаштування: 🎤 голос, 🔁 повтор, ⚙️ інші параметри.</li>
            </ul>
            <img
              src="/rwords_screens/words_list_buttons.jpg"
              alt="Головний екран Слова"
              //   className="rounded-xl shadow-lg max-w-full md:order-2"
              className="w-full md:w-1/2 md:order-2 mx-auto my-4 rounded shadow"
            />
          </div>
        </div>
      </section>
      {/* ********************************************************** */}✅ Що зроблено: Назва кожного екрану по центру
      (text-center). Нижче —
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">📌 Елементи інтерфейсу</h2>
        <h3 className="text-xl font-bold mt-2">🔝 Верхня панель</h3>
        <ul className="list-disc pl-5">
          <li>🔙 Стрілка — назад</li>
          {/* <li>🌞 Перемикач теми</li> */}
          <li>🌙 Перемикач теми</li>
          <li>❓ Підказка</li>
          <li>📋 Доступ до довідників: додавання, редагування, CSV-імпорт</li>
        </ul>

        <h3 className="text-xl font-bold mt-2">🔻 Нижня панель</h3>
        <p>Основні іконки навігації в додатку.</p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">🎙️ Голосові команди</h2>
        <p className="mb-2">Після натискання 🎤 мікрофон активується, і ви можете використовувати голосові команди:</p>
        <ul className="list-disc pl-5">
          <li>⏹️ Зупинити — пауза</li>
          <li>▶️ Продовжити — відновити</li>
          <li>⏭️ Наступне, ⏮️ Попередн</li>
          <li>🔁 Повторити</li>
          <li>⏪ На початок</li>
          <li>✅ Знаю, ❌ Не знаю</li>
          <li>🔙 Назад</li>
        </ul>
        <p className="mt-2">Команди налаштовуються у меню мікрофона (справа вгорі).</p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">📤 Імпорт/експорт слів</h2>
        <ul className="list-disc pl-5">
          <li>
            <strong>Імпорт CSV</strong> — з будь-якої папки. Формат:
            <ul className="list-disc pl-5">
              <li>1-й рядок — група тем</li>
              <li>2-й рядок — тема</li>
              <li>Далі — слова/фрази (на мові оригіналу)</li>
            </ul>
          </li>
          <li>
            <strong>Експорт CSV</strong> — з перекладом. Налаштуйте мову перекладу у ⚙️ Налаштування → Мови.
          </li>
        </ul>
      </section>
      <blockquote className="mt-6 italic border-l-4 border-hBg pl-4">
        RWords — це інструмент, який адаптується під вас. Ви керуєте процесом вивчення: що слухати, як оцінювати, коли
        повторювати.
      </blockquote>
    </main>
  )
}
