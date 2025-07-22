// about_rwords/page.js
"use client"
import { useAuth } from "@/app/context/AuthContext"
import Link from "next/link"

export default function HowItWorks() {
  const { user } = useAuth()
  return (
    <main className="px-4 py-8 max-w-4xl mx-auto text-hText dark:text-hTextD">
      <h1 className="text-3xl font-bold mb-4">🎯 Що таке застосунок RWords?</h1>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          RWords — це мобільний застосунок для android для вивчення іноземних слів та виразів за допомогою голосових і
          кнопкових команд. Ви самі оцінюєте свої знання, формуєте списки вивчення та слухаєте слова у циклічному
          режимі.
        </h2>
      </section>
      {/* ✅ 4. CTA: Зареєструйтесь */}
      <section className="mb-6 bg-yellow-100 text-center py-10 px-6 bg-blue-50">
        {user ? (
          <>
            {/* <h3 className="text-xl font-semibold mb-4">Дякуємо, що з нами!</h3>
            <p className="mb-6 text-gray-700">
              Ви вже зареєстровані. Тепер ви можете користуватись усіма можливостями сайту.
            </p> */}
            <Link href="/download" className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition">
              ⬇️Завантажити застосунок RWords
            </Link>
          </>
        ) : (
          <>
            {/* <h3 className="text-xl font-semibold mb-4">Готові почати?</h3> */}
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
      <h1 className="text-3xl font-bold mb-4">📖 Як працює застосунок RWords</h1>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">🧠 Головна ідея застосунку</h2>
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
        <h2 className="text-2xl font-semibold mb-2">🧩 Елементи інтерфейсу</h2>
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
        <h2 className="text-2xl font-semibold mb-2 text-center">🧭 Основні екрани</h2>

        {/* Home */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center">🏠 Головна</h3>
          <h4 className="text-nowrap font-semibold text-center mb-1">Початковий екран застосунку</h4>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/home.jpg"
              alt="Титульний екран Home"
              className="w-full md:w-1/2  md:order-1 mx-auto my-4 rounded shadow"
            />

            <div className="text-lg md:order-2">
              {/* Верхня панель */}
              <h3 className="text-base font-bold mb-1">🔝 Верхня панель</h3>
              <ul className="text-base list-disc pl-10 mb-4">
                <li>🌙 Перемикач теми</li>
                <li>❓ Загальний опис додатку</li>
              </ul>

              {/* Нижня панель */}
              <h3 className="text-base font-bold mb-1">🔻 Нижня панель — Основні іконки навігації:</h3>
              <ul className="text-base list-disc pl-10">
                <li>🏠 Головна</li>
                <li>📖 Слова</li>
                <li>⚙️ Налаштування</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Words */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center">🗣️ Слова</h3>
          <h4 className="text-nowrap font-semibold text-center mb-1">
            Початковий екран прослуховування слів на якому відображаються :
          </h4>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div className="text-lg md:order-1">
              {/* Верхня панель */}
              <h3 className="text-base font-bold mb-1">🔝 Верхня панель</h3>
              <ul className="text-base list-disc pl-10 mb-4">
                <li>🔙 Вихід на попередній екран</li>
                <li>🎙️ Голосові команди(Налаштування голосових команд)</li>
                <li>⚙️ Налаштування: прослуховування слів(вибір тем, і режимів прослуховування) </li>
                <li>❓ Підказка</li>
              </ul>
              <h3 className="text-base font-bold mb-1">🔝 Трохи нижче :</h3>
              <ul className="text-base list-disc pl-10">
                <li>
                  Зліва від мікрофона відображається напис &quot;Не слухаю&quot;,якщо мікрофон виключений / якщо
                  мікрофон включений, то відображаються розпізнані слова(не команди)
                </li>
                <li>
                  Посередині мікрофон, який пульсує, якщо він включений. Щоб включити мікрофон і прослуховування,
                  потрібно натиснути на іконку Мікрофон
                </li>
                <li>Зправа від мікрофона відображаються розпізнані програмні команди</li>
              </ul>
              <h3 className="text-base font-bold mb-1">🔝 Ще нижче основні налаштування для прослуховування:</h3>
              <ul className="text-base list-disc pl-10">
                <li>🎯 Вибрано слів:к-сть вибраних слів</li>
                <li>🎯 Вибрані теми:к-сть вибраних тем</li>
                <li>🎯 Вибрані знання:всі/знаю/не знаю</li>
              </ul>
              <h3 className="text-base font-bold mb-1">
                🔝 Щоб почати слухати вибраний список слів натисніть &quot;Почати&quot;
              </h3>
            </div>
            <img
              src="/rwords_screens/words.jpg"
              alt="Головний екран Слова"
              //   className="rounded-xl shadow-lg max-w-full md:order-2"
              className="w-full md:w-1/2 md:order-2 mx-auto my-4 rounded shadow"
            />
          </div>
        </div>

        {/* Налаштування відтворення */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center mb-4">⚙️Налаштування прослуховування</h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/words_settings.jpg"
              alt="Екран налаштувань"
              className="w-full md:w-1/2 md:order-1 mx-auto my-4 rounded shadow"
            />
            <div className="text-lg md:order-2">
              {/* Верхня панель */}
              <h3 className="text-base font-bold mb-1">
                {" "}
                У цьому вікні можна налаштувати багато параметрів прослуховування в тому числі:
              </h3>
              <ul className="text-base list-disc pl-10 mb-4">
                <li>
                  ⏱️ Затримка голосу-потрібна щоб правильно визначити до якого слова буде відноситись команда Знаю/Не
                  знаю (текучого чи наступного) так як розпізнавання голосу працює з деякою затримкою
                </li>
                <li>
                  🔊 Вираз для озвучки кінця списку-це вираз який озвучить застосунок при досягненні початку списку
                </li>
                <li>
                  🔁 Вираз для озвучки початку списку-це вираз який озвучить застосунок при досягненні початку списку
                  при по команді &quot;Назад&quot;
                </li>
                <li>
                  🎛️ Всі кнопки в словах-при озвучці будуть показані всі кнопким екрування а не тільки Стоп/Знаю/Ні
                </li>
                <li>🗣️ Мова оригіналу-мова на якій завантажені слова</li>
                <li>🌐 Мова перекладу- мова на яку буду</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Налаштування голосових команд */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center mb-4">🎙️ Налаштування голосових команд</h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/voices_commands.jpg"
              alt="Головний екран Слова"
              //   className="rounded-xl shadow-lg max-w-full md:order-2"
              className="w-full md:w-1/2 md:order-2 mx-auto my-4 rounded shadow"
            />
            <div className="text-lg md:order-1">
              <h3 className="text-base font-bold mb-1">Додавання і вилучення голосових команд:</h3>
              <ul className="text-base list-disc pl-10 mb-4">
                <li>
                  🗣️ Кожна команда керування яка закріплена кнопками має декілька голосових команд тому, що
                  розпізнавання голосу працює не завжди коректно і залежить від вашого тембру і інших факторів. Ви маєте
                  можливість добавляти свої голосові команди до конкретних керуючих команд. Ви також можете робити це
                  голосом, контролюючи розпізнавання голосу, підлаштовуючи команди під свій голос
                </li>
                <li>🗣️ Ви можете: </li>
                <li>🗣️ Переглянкти уже доступні голосові команди до команд управління.</li>
                <li>🗣️ Додавайти(вилучати) голосові команди до команд управління.</li>
                <li>🗣️ Додавайти нові команди голосом, включивши мікрофон 🎤 </li>
                <li>🗣️ Налаштувати голосові команди під свій голос.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Список слів-кнопки */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center mb-4">📋 Список слів-кнопки</h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/words_list_buttons.jpg"
              alt="Головний екран Слова"
              //   className="rounded-xl shadow-lg max-w-full md:order-2"
              className="w-full md:w-1/2 md:order-1 mx-auto my-4 rounded shadow"
            />
            <div className="text-lg md:order-1">
              <h3 className="text-base font-bold mb-1">Додавання/імпорт/переклад слів:</h3>
              <ul className="text-base list-disc pl-10 mb-4">
                <li>1-й рядок — група тем</li>
                <li>2-й рядок — тема</li>
                <li>Далі — слова/фрази (на мові оригіналу)</li>
                <li>
                  Для того щоб виконати необхідні дії з додавання, імпорту або перекладу слів, натисніть на кнопку
                  &quot;Додати&quot;, &quot;Імпортувати&quot;, &quot;Перекласти&quot; внизу
                </li>
                <li>
                  Ви також можете коригувати слово, виділивши його і натиснути кнопку &quot;Редагувати&quot;,яка
                  появиться при виділенні тільки одногослова
                </li>
                <li>
                  Ви також можете вилучити слово, чи групу слів виділивши його(їх) і натиснути кнопку
                  &quot;Вилучити&quot;,яка появиться при виділенні
                </li>
                <li>При імпотрі слів з CSV-файлу, ви можете вибрати файл з вашого компоб&#39;ютера. Формат CSV:</li>
                <li>
                  При перекладі ви зможете вибрати чим перекладати всі слова, чи тільки ті що ще не перекладені, тим
                  самим мати можливість реперекласти слова на іншу, задану в налаштуваннях, мову
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Список слів-переміщення */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center mb-4">📋🔀Список слів-переміщення </h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/words_list.jpg"
              alt="Екран налаштувань"
              className="w-full md:w-1/2 md:order-2 mx-auto my-4 rounded shadow"
            />

            <div className="text-lg md:order-1">
              <h3 className="text-base font-bold mb-1">🔀Переміщення рядків</h3>
              <ul className="text-base list-disc pl-10 mb-4">
                <li>
                  🎧 Щоб перемістити слово в списку потрібно його відмітити і тоді появиться кнопка
                  &quot;Перемістити&quot; при натисканні на яку появилься модальне віконечко для переміщення із
                  стрілками вверх/вниз. Щоб завершити переміщення натисніть кнопку Готово.
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Налаштування колірних схем*/}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center mb-4">🎨Налаштування колірних схем</h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/сolors_settings.jpg"
              alt="Екран налаштувань"
              className="w-full md:w-1/2 md:order-1 mx-auto my-4 rounded shadow"
            />
            <div className="text-lg md:order-1">
              <h3 className="text-base font-bold mb-1">Вибір колірних схем:</h3>
              <ul className="text-base list-disc pl-10 mb-4">
                <li>🌈 Виберіть колірну схему</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* ********************************************************** */}

      <blockquote className="mt-6 italic border-l-4 border-hBg pl-4">
        RWords — це інструмент, який адаптується під вас. Ви керуєте процесом вивчення: що слухати, як оцінювати, коли
        повторювати.
      </blockquote>
    </main>
  )
}
