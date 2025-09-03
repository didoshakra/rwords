// about_rwords/page.js
"use client"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"

export default function HowItWorks() {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <main className="px-4 py-8 max-w-4xl mx-auto text-pText dark:text-pTextD">
      {/* Головний заголовок */}
      <h1 className="inline-flex items-center justify-center gap-2 text-h1Text text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
        <Image src="/images/home/RW_know_64.png" alt="RWords" width={24} height={24} priority />
        Що таке RWords?
      </h1>

      {/* Опис застосунку */}
      <section className="mb-6 text-pText dark:text-pTextD  ">
        <p className="text-base sm:text-lg lg:text-xl font-semibold mb-2">
          {`RWords — мобільний застосунок на Android для вивчення іноземних слів та фраз. В ньому ви маєте можливість
          прослуховувати слова, фрази, речення з перекладом на вибрану вами мову із списків слів, які уже є в
          застосунку, а також можете самі добавляти слова і цілі теми шляхом імпорту як
          напряму в застосунок, так і через сайт. При прослуховуванні, ви можете оцінювати свої знання натискаючи
          клавіші "Знаю"/"Не знаю". При цьому при слідчому прослуховуванні ці слова можуть вже не відтворюватись(залежно від
          ваших налаштувань). Керування прослуховуванням можливе як через інтерфейс застосунку, так і за допомогою
          голосових команд.`}
        </p>
      </section>

      {/* Секція кнопок */}
      <section className="bg-pBg1 text-base sm:text-lg lg:text-xl mb-6 text-center py-10 px-6 rounded">
        {user ? (
          <Link
            href="/download"
            className="flex items-center justify-center gap-2 bg-green-600text-pText dark:text-pTextD` px-6 py-3 rounded hover:bg-green-700 transition "
          >
            <Image src="/images/home/RW_know_64.png" alt="RWords" width={24} height={24} priority />
            До завантаження застосунку ⬇️
          </Link>
        ) : (
          <>
            <p className="mb-6  text-pText  dark:text-pTextD">
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

      {/* Підзаголовок "Як працює" */}
      <h2 className="text-h2Text text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 text-center">
        📖 Як працює застосунок RWords
      </h2>

      {/* Головна ідея */}
      <section className="mb-6">
        <h3 className="text-h3Text text-lg sm:text-xl lg:text-2xl font-bold mb-2">🧠 Головна ідея застосунку</h3>
        <p className="mb-2 text-base sm:text-lg lg:text-xl">
          <strong>RWords</strong> дозволяє оцінювати знання голосом або кнопками <strong>Знаю / Не знаю</strong>,
          формуючи персоналізовані списки.
        </p>
        <p className="text-base sm:text-lg lg:text-xl">
          Для початку створіть базу даних у налаштуваннях: <strong>Слова</strong>, <strong>Теми</strong>,{" "}
          <strong>Групи тем</strong>. Також доступний імпорт CSV та автоматичний переклад.
        </p>
      </section>

      {/* Елементи інтерфейсу */}
      {/* <section className="mb-6">
        <h3 className="text-h3Text text text-lg sm:text-xl lg:text-2xl font-bold mb-2">🧩 Елементи інтерфейсу</h3>

        <h4 className="text-base sm:text-lg font-semibold mt-2">🔝 Верхня панель</h4>
        <ul className="list-disc pl-5 text-base sm:text-lg">
          <li>🔙 Стрілка — назад</li>
          <li>🌙 Перемикач теми</li>
          <li>❓ Підказка</li>
          <li>📋 Доступ до довідників: додавання, редагування, CSV-імпорт</li>
        </ul>

        <h4 className="text-base sm:text-lg font-semibold mt-2">🔻 Нижня панель</h4>
        <p className="text-base sm:text-lg">Основні іконки навігації в додатку.</p>
      </section> */}
      
      <div className="space-y-4 text-base" >
        {/* --- Заголовок екранів --- */}
        <p className="font-bold text-center my-2">
          🧭 Застосунок має чотири основні навігаційні іконки розташовані в нижній частині екрана:
        </p>

        {/* --- Список екранів --- */}
        <p>
          <strong>1. 🏠 "Home" - Титульний екран</strong>
          <br />
          <strong>2. 🎧 "Слухати" - Головний екран який складається з 2-х частин</strong>
          <br />
          У 1-й частині екрану "Слухати" ви можете налаштовувати:
          <br />• 🎤 голосові команди;
          <br />• 🔁 параметри циклічного відтворення;
          <br />• Вибрати з якого місця слухати: з початку, чи продовжити.
          <br />
          У 2-й частині екрану "Слухати" ви можете:
          <br />• Прослуховувати слова й оцінювати свої знання.
          <br />• Для прослуховування (навігації по списку) використовувати голосові команди або кнопки, які дозволяють:
          <br />• Пропустити слово (перейти до наступного);
          <br />• Повторити слово (програти його ще раз);
          <br />• Повернутись на попереднє слово;
          <br />• Повернутись на початок відтворення із збереженням інформації про останнє слово що прослуховувалось;
          <br />• Перейти на наступну тему;
          <br />• Оцінювати свої знання: команди або кнопки "Знаю" / "Ні"
          <br />– ⚙️ інші функції екрану "Слухати" можна взнати у довідці вікна "Слухати".
          <br />
          <br />
          <strong>☰ 3. Екран "Меню"</strong>
        </p>

        {/* --- Меню Налаштування --- */}
        <p>
          ⚙️ <strong>Група меню "Налаштування"</strong>:
          <br />• 🖥️ Пункт "Загальні налаштування" — вікно налаштування режимів прослуховування.
          <br />• 🎨 Пункт "Колірні теми інтерфейсу" — відкриває вікно вибору колірної схеми.
          <br />• 📲 Пункт "Оновлення додатку" — завантаження нової версії.
          <br />• Нижче показано відповідність вашої версії додатку і версії, доступної для завантаження.
        </p>

        {/* --- Меню Довідники --- */}
        <p>
          📖 <strong>Група меню "Довідники"</strong>:
          <br />• Тут знаходяться довідники "Слова", "Теми" та "Групи тем".
          <br />• Ви можете додавати нові елементи, редагувати, видаляти або змінювати порядок.
          <br />• У <em>Слова</em> також можна імпортувати дані з CSV та перекладати автоматично на мову, задану у
          налаштуваннях.
        </p>

        {/* --- Загальні елементи інтерфейсу --- */}
        <p>
          🧩 <strong>4. Загальні елементи інтерфейсу:</strong>
          <br />
          🔝 <strong>Верхня панель (topBar)</strong> кожного екрана:
          <br />• 🔙 <strong>Стрілка зліва</strong> — повернення до попереднього екрана.
          <br />• 🌙 Іконка теми — перемикання між світлою 🌞 і темною 🌙 темами.
          <br />• ❓ Іконка "Підказка" — виклик опису роботи екрана.
          <br />– <em>Слова</em>,
        </p>

        {/* --- Нижня панель --- */}
        <p>
          🔻 <strong>Нижня панель (bottomBar)</strong> доступна в більшості вікон і містить основні іконки для навігації
          та взаємодії.
        </p>
      </div>

      {/* Основні екрани */}
      <section className="mb-6">
        <h2 className="text-h2Text text text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 text-center">
          🧭 Основні екрани
        </h2>

        {/* Початковий екран */}
        <div className="mt-8">
          <h3 className="text-h3Text text text-lg sm:text-xl lg:text-2xl font-bold text-center mb-2">
            Початковий екран застосунку
          </h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/scr_home.jpg"
              alt="Home"
              className="w-full md:w-1/2 mx-auto my-4 rounded shadow"
            />
            <div className="text-sm sm:text-base lg:text-lg">
              <h4 className="font-semibold mb-1">🔝 Верхня панель</h4>
              <ul className="list-disc pl-10 mb-4">
                <li>🌙 Перемикач теми</li>
                <li>❓ Загальний опис додатку</li>
              </ul>
              <h4 className="font-bold mb-1">🔻 Нижня панель</h4>
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
          <h3 className="text-h3Text text text-lg sm:text-xl lg:text-2xl font-bold text-center mb-2">
            🗣️ Слова/Налаштування і інформація
          </h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div className="text-sm sm:text-base lg:text-lg">
              <h4 className="font-bold mb-1">🔝 Верхня панель</h4>
              <ul className="list-disc pl-10 mb-4">
                <li>🔙 Вихід на попередній екран</li>
                <li>🎙️ Голосові команди</li>
                <li>⚙️ Налаштування: вибір тем та режимів прослуховування</li>
                <li>❓ Підказка</li>
              </ul>
              <h4 className="font-bold mb-1">🔝 Нижче</h4>
              <ul className="list-disc pl-10 mb-4">
                <li>Напис &quot;Не слухаю&quot;, якщо мікрофон виключений</li>
                <li>Мікрофон посередині, пульсує при включенні</li>
                <li>Справа — розпізнані програмні команди</li>
              </ul>
              <h4 className="font-bold mb-1">🔝 Основні налаштування</h4>
              <ul className="list-disc pl-10">
                <li>🎯 Вибрано слів</li>
                <li>🎯 Вибрані теми</li>
                <li>🎯 Вибрані знання</li>
              </ul>
            </div>
            <img
              src="/rwords_screens/scr_wordsInfo.jpg"
              alt="Words"
              className="w-full md:w-1/2 mx-auto my-4 rounded shadow"
            />
          </div>
        </div>

        {/* Налаштування відтворення */}
        <div className="mt-8">
          <h3 className="text-h3Text text text-lg sm:text-xl lg:text-2xl font-bold text-center mb-2">
            ⚙️ Налаштування прослуховування
          </h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/words_settings.jpg"
              alt="Settings"
              className="w-full md:w-1/2 mx-auto my-4 rounded shadow"
            />
            <div className="text-sm sm:text-base lg:text-lg">
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
          <h3 className="text-h3Text text text-lg sm:text-xl lg:text-2xl font-bold text-center mb-2">
            🎙️ Налаштування голосових команд
          </h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/voices_commands.jpg"
              alt="Voice Commands"
              className="w-full md:w-1/2 mx-auto my-4 rounded shadow sm:order-2"
            />
            <div className="text-sm sm:text-base lg:text-lg sm:order-1">
              <ul className="list-disc pl-10 mb-4">
                <li>🗣️ Додавання/видалення голосових команд для кнопок</li>
                <li>🗣️ Можна додавати команди голосом</li>
                <li>🗣️ Налаштувати під свій тембр</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Вибір тем */}
        <div className="mt-8">
          <h3 className="text-h3Text text text-lg sm:text-xl lg:text-2xl font-bold text-center mb-2">⚙️ Вибір тем</h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/scr_ChoosingTopics.jpg"
              alt="Settings"
              className="w-full md:w-1/2 mx-auto my-4 rounded shadow"
            />
            <div className="text-sm sm:text-base lg:text-lg">
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
        {/* Вибір знань */}
        <div className="mt-8">
          <h3 className="text-h3Text text text-lg sm:text-xl lg:text-2xl font-bold text-center mb-2">⚙️ Вибір знань</h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div className="text-sm sm:text-base lg:text-lg">
              <ul className="list-disc pl-10 mb-4">
                <li>⏱️ Затримка голосу для правильного відображення команд</li>
                <li>🔊 Вираз для озвучки кінця списку</li>
                <li>🔁 Вираз для озвучки початку списку</li>
                <li>🎛️ Всі кнопки в словах відображаються</li>
                <li>🗣️ Мова оригіналу</li>
                <li>🌐 Мова перекладу</li>
              </ul>
            </div>
            <img
              src="/rwords_screens/scr_ChoosingKnow.jpg"
              alt="Settings"
              className="w-full md:w-1/2 mx-auto my-4 rounded shadow"
            />
          </div>
        </div>
        {/* Слова/Прослуховування */}
        <div className="mt-8">
          <h3 className="text-h3Text text text-lg sm:text-xl lg:text-2xl font-bold text-center mb-2">
            🗣️ Слова/Прослуховування
          </h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/scr_wordsPlay.jpg"
              alt="Words"
              className="w-full md:w-1/2 mx-auto my-4 rounded shadow"
            />
            <div className="text-sm sm:text-base lg:text-lg">
              <h4 className="font-bold mb-1">🔝 Верхня панель</h4>
              <ul className="list-disc pl-10 mb-4">
                <li>🔙 Вихід на попередній екран</li>
                <li>🎙️ Голосові команди</li>
                <li>⚙️ Налаштування: вибір тем та режимів прослуховування</li>
                <li>❓ Підказка</li>
              </ul>
              <h4 className="font-bold mb-1">🔝 Нижче</h4>
              <ul className="list-disc pl-10 mb-4">
                <li>Напис &quot;Не слухаю&quot;, якщо мікрофон виключений</li>
                <li>Мікрофон посередині, пульсує при включенні</li>
                <li>Справа — розпізнані програмні команди</li>
              </ul>
              <h4 className="font-bold mb-1">🔝 Основні налаштування</h4>
              <ul className="list-disc pl-10">
                <li>🎯 Вибрано слів</li>
                <li>🎯 Вибрані теми</li>
                <li>🎯 Вибрані знання</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Меню */}
        <div className="mt-8">
          <h3 className="text-h3Text text text-lg sm:text-xl lg:text-2xl font-bold text-center mb-2">☰ Меню</h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div className="text-sm sm:text-base lg:text-lg">
              <h4 className="font-bold mb-1">🔝 Верхня панель</h4>
              <ul className="list-disc pl-10 mb-4">
                <li>🔙 Вихід на попередній екран</li>
                <li>🎙️ Голосові команди</li>
                <li>⚙️ Налаштування: вибір тем та режимів прослуховування</li>
                <li>❓ Підказка</li>
              </ul>
              <h4 className="font-bold mb-1">🔝 Нижче</h4>
              <ul className="list-disc pl-10 mb-4">
                <li>Напис &quot;Не слухаю&quot;, якщо мікрофон виключений</li>
                <li>Мікрофон посередині, пульсує при включенні</li>
                <li>Справа — розпізнані програмні команди</li>
              </ul>
              <h4 className="font-bold mb-1">🔝 Основні налаштування</h4>
              <ul className="list-disc pl-10">
                <li>🎯 Вибрано слів</li>
                <li>🎯 Вибрані теми</li>
                <li>🎯 Вибрані знання</li>
              </ul>
            </div>
            <img
              src="/rwords_screens/scr_menu.jpg"
              alt="Words"
              className="w-full md:w-1/2 mx-auto my-4 rounded shadow"
            />
          </div>
        </div>
        {/* Список слів-кнопки */}
        <div className="mt-8">
          <h3 className="text-h3Text text text-lg sm:text-xl lg:text-2xl font-bold text-center mb-2">
            📋 Список слів-кнопки
          </h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/words_list_buttons.jpg"
              alt="Words List Buttons"
              className="w-full md:w-1/2 mx-auto my-4 rounded shadow"
            />
            <div className="text-sm sm:text-base lg:text-lg">
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
          <h3 className="text-h3Text text text-lg sm:text-xl lg:text-2xl font-bold text-center mb-2">
            📋🔀 Список слів-переміщення
          </h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/words_list.jpg"
              //   src="/rwords_screens/words_list.jpg"
              alt="Words List Move"
              className="w-full md:w-1/2 mx-auto my-4 rounded shadow sm:order-2"
            />
            <div className="text-sm sm:text-base lg:text-lg sm:order-1">
              <ul className="list-disc pl-10">
                <li>{` Щоб перемістити рядок потріьно: Відмітити слово ✅. а потім натиснути кнопку "Перемістити", яка появиться при відмітці тільки одного рядка-> внизу воявиться віконце для переміщення рядка. І вже тоді стрілками  ↑/↓ перемісти вибраний рядок у потрібне місце. По завершенню переміщення вийти назад, натиснувши кнопку "Готово"`}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Колірні схеми */}
        <div className="mt-8">
          <h3 className="text-h3Text text text-lg sm:text-xl lg:text-2xl font-bold text-center mb-2">
            🎨 Налаштування колірних схем
          </h3>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <img
              src="/rwords_screens/сolors_settings.jpg"
              alt="Colors Settings"
              className="w-full md:w-1/2 mx-auto my-4 rounded shadow"
            />
            <div className="text-sm sm:text-base lg:text-lg">
              <ul className="list-disc pl-10">
                <li>🌈 Вибір колірної схеми</li>
                <li>
                  Натисніть на кнопку із стрілкою іназвою текучої колірної схеми і виберіть любу кольорову схему з
                  списку.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Блок цитати */}
      <blockquote className="mt-6 italic border-l-4 border-hBg pl-4 text-base sm:text-lg lg:text-xl">
        RWords — інструмент, який адаптується під вас. Ви керуєте процесом вивчення: що слухати, як оцінювати, коли
        повторювати.
      </blockquote>
    </main>
  )
}
