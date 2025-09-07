// about_rwords/page.js
"use client"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"

function ScreenBlock({ title, img, children }) {
  return (
    <section className="space-y-4 text-xs sm:text-sm lg:text-base mb-6">
      <h3 className="text-h3Text text-lg sm:text-xl lg:text-2xl font-bold text-center mb-2">{title}</h3>
      <div className={`grid gap-4 items-center ${img ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
        {img && <img src={img} alt={title} className="w-full md:w-1/2 mx-auto my-4 rounded shadow" />}
        <div className="text-xs sm:text-sm lg:text-base">{children}</div>
      </div>
    </section>
  )
}

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

      {/* Секція завантаження застосунку */}
      <section className="bg-pBg1 text-sm sm:text-base lg:text-lg mb-6 text-center py-10 px-6 rounded">
        {user ? (
          <Link
            href="/download"
            className="flex items-center justify-center gap-2 bg-pBg text-pText dark:text-pTextD px-6 py-3 rounded hover:bg-pBgHov transition "
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
      <ScreenBlock title="🧠 Головна ідея застосунку">
        <p>
          <strong>RWords</strong> дозволяє оцінювати знання голосом або кнопками <strong>Знаю / Не знаю</strong>,
          формуючи персоналізовані списки для подальшого прослуховування. Для комфортнішої роботи викоритовються
          голосові команди
        </p>
        {/* <p>
          Створіть базу даних у налаштуваннях: <strong>Слова</strong>, <strong>Теми</strong>, <strong>Групи тем</strong>
          . Доступний імпорт CSV та автоматичний переклад.
        </p> */}
      </ScreenBlock>

      <ScreenBlock title="🧭 Застосунок має 4-й основні екрани,">
        <h3 className="text-h3Text text-lg sm:text-xl lg:text-xl font-semibold text-center mb-1">
          Вони відкриваються по натисканню кнопок в нижній навігаційній панелі.
        </h3>
        <ul className="list-disc pl-10 space-y-2">
          <li>
            <strong>🏠 Home</strong> — титульний екран з іконками перемикання тем🌙-темна/🌞-світла і ❓-загальний опис
            додатку
          </li>
          <li>
            <strong>🎧 Слухати</strong> — головний екран який складається з 2-х частин:
            <ul className="list-disc pl-6">
              <h4 className="text-h3Text text-sm sm:text-base lg:text-lg font-semibold mt-1">
                У 1-й частині екрану «Слухати» ви можете:
              </h4>
              <li>🎙️🚫 включати/виключати мікрофон для того щоб додаток міг слухати голосові команди</li>
              <li>🎙️ налаштовувати голосові команти по кнопці/рядку голосові команди;</li>
              <li>⚙️ налаштовувати режими прослуховування </li>
              <li>🎯 бачити к-сть вибраних слів для прослуховування</li>
              <li>🔽 обирати знання для прослуховування</li>
              <li>🔽 обирати теми для прослуховування</li>
              <li>обирати початок або продовження прослуховування «↺ З початку» / «▶️ Продовжити» </li>
            </ul>
            <ul className="list-disc pl-6">
              <h4 className="text-h3Text text-sm sm:text-base lg:text-lg font-semibold mt-1">
                У 2-й частині екрану «Слухати» ви можете прослуховувати слова і:
              </h4>
              <li>🗣️ для навігації по списку використовувати голосові команди або кнопки, які дозволяють:</li>
              <li>🎧 Оцінювати свої знання «✅ Знаю» / «✅ Ні».</li>
              <li>⏭️ Зупинити прослуховування</li>
              <li>⏭️ Продовжити прослуховування</li>
              <li>⏭️ Пропустити слово (перейти до наступного)</li>
              <li>🔁 Повторити слово (програти його ще раз)</li>
              <li>⏮️ Повернутись на попереднє слово</li>
              <li>🔄 Повернутись на початок відтворення із збереженням інформації про останнє слово</li>
              <li>📂 Перейти на наступну тему</li>
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
      {/* 1 */}
      <ScreenBlock title="🧭 Основні екрани1">
        <ScreenBlock title="Початковий екран застосунку" img="/rwords_screens/scr_home.jpg">
          <h4 className="font-semibold mb-1">🔝 Верхня панель</h4>
          <ul className="list-disc pl-10 mb-4">
            <li>🌙 Перемикач теми</li>
            <li>❓ Загальний опис додатку</li>
          </ul>
        </ScreenBlock>

        <ScreenBlock title="🗣️ Слова/Налаштування і інформація" img="/rwords_screens/scr_WordsInfo.jpg">
          <h4 className="font-bold mb-1">🔝 Верхня панель</h4>
          <ul className="list-disc pl-10 mb-4">
            <li>❓ Підказка</li>
          </ul>
          <h4 className="font-bold mb-1">🔻 Нижче</h4>
          <ul className="list-disc pl-10 mb-4">
            <li>Напис «Голос» або «Не слухаю», якщо мікрофон виключений</li>
            <li>Мікрофон посередині, пульсує при включенні</li>
            <li>Справа — розпізнані програмні команди (тільки при активному мікрофоні)</li>
          </ul>
          <h4 className="font-bold mb-1">⚙️ Основні налаштування і інформація</h4>
          <ul className="list-disc pl-10">
            <li>🎙️ Голосові команди</li>
            <li>⚙️ Вибір тем та режимів прослуховування</li>
            <li>🎯 Вибрано слів (к-сть)</li>
            <li>🔻 Вибрані теми</li>
            <li>🔻 Вибрані знання</li>
            <li>
              ▶️ Кнопки «↺ З початку» / «▶️ Продовжити»-відтворює з останнього слова повереднього сеансу якщо воно є в
              поточному списку
            </li>
          </ul>
        </ScreenBlock>

        <ScreenBlock title="🎧 Слова/Прослуховування" img="/rwords_screens/scr_WordsPlay.jpg">
          <h4 className="font-bold mb-1">🎙️ Доступні наступні кнопки і голосові команди:</h4>
          <ul className="list-disc pl-10 mb-4">
            <li> «➡️ Далі» – переходить до наступного слова</li>
            <li> «⬅️ Назад» – повертається до попереднього</li>
            <li> «🔁 Повторити» – повторює поточне слово</li>
            <li> «🔙 Назад» – повертає до попереднього екрана</li>
            <li>{` «⏪ На початок» – на початок з запам'ятовуванням останнього слова`}</li>
            <li> «✅ Знаю» – позначає слово як відоме</li>
            <li> «❌ Не знаю» – позначає слово як відоме</li>
            <li> «🗂 Наступна тема» – перехід на наступну тему</li>
            <li> «❌ Не знаю» – позначає слово як не відоме</li>
            <li> Прослуховуйте слова й оцінюйте свої знання</li>
            <li> Для прослуховування(навігації по списку) </li>
          </ul>
          <h4 className="font-bold mb-1">🎧 Прослуховуйте слова й оцінюйте свої знання.</h4>
          <h4 className="font-bold mb-1">🎙️ використовуйте голосові команди або кнопки.</h4>
          {/*  */}
        </ScreenBlock>
        <ScreenBlock title="⚙️ Налаштування прослуховування" img="/rwords_screens/words_settings.jpg">
          {/* <h4 className="font-bold mb-1">🎙️ Доступні слідуючі налаштування</h4> */}
          <ul className="list-disc pl-10 mb-4">
            <li> ⏳-різні паузи</li>
            <li>⏱️ Затримка голосу для правильного відображення команд</li>
            <li>🔊 Вираз для озвучки кінця списку</li>
            <li>🔁 Вираз для озвучки початку списку</li>
            <li>🎛️ Всі кнопки в словах відображаються</li>
            <li>📂 Вибір тем</li>
            <li>✅ Вибір знань </li>
            <li>🖼️ Показ картинки</li>
            <li>🗣️ Мова оригіналу</li>
            <li>🌐 Мова перекладу</li>
          </ul>
          <h4 className="font-bold mb-1">🎧 Налаштовуйте застосунок під свій ритм.</h4>
          {/*  */}
        </ScreenBlock>
        <ScreenBlock title="🎙️ Налаштування голосових команд" img="/rwords_screens/voices_commands.jpg">
          {/* <h4 className="font-bold mb-1">🎙️ Доступні слідуючі налаштування</h4> */}
          <ul className="list-disc pl-10 mb-4">
            <li>🗣️ Додавання нових голосових команд для кнопок</li>
            <li>📝 Коригування/❌видалення голосових команд</li>
            <li>🎙️ Можна додавати команди голосом налаштовуючи їх під свій тембр голосу</li>
          </ul>
          <h4 className="font-bold mb-1">🗣️ Налаштувуйте команди під свій тембр голосу</h4>
          {/*  */}
        </ScreenBlock>
        <ScreenBlock title="📂 Вибір тем" img="/rwords_screens/scr_ChoosingTopics.jpg">
          <h4 className="font-bold mb-1">⚙️ Доступні слідуючі дії:</h4>
          <ul className="list-disc pl-10 mb-4">
            <li>⬇️ Відкривати групу тем</li>
            <li>✅ Відмічати теми для прослуховування</li>
            <li>☰ Переміщати теми в списку в межах групи</li>
          </ul>
          <h4 className="font-bold mb-1">🧑‍🤝‍🧑 Налаштувуйте послідовність відтворення тем</h4>
          {/*  */}
        </ScreenBlock>
        <ScreenBlock title="🎓 Вибір знань" img="/rwords_screens/scr_ChoosingKnow.jpg">
          <h4 className="font-bold mb-1">⚙️ Доступний слідуючий вибір:</h4>
          <ul className="list-disc pl-10 mb-4">
            <li>✅ Знаю</li>
            <li>❌ Не знаю</li>
            <li>👥 Всі</li>
          </ul>
          <h4 className="font-bold mb-1">🎯 Вибирайте тількі потрібні слова</h4>
          {/*  */}
        </ScreenBlock>
        <ScreenBlock title="☰ Меню" img="/rwords_screens/scr_menu.jpg">
          <h4 className="font-bold mb-1">Тут ви можете</h4>
          <ul className="list-disc pl-10 mb-4">
            <li>📱 Побачити версію вашого додатку</li>
            <li>🆕 Побачити доступну нову версію(якщо ваш додаток старіший)</li>
            <li>🔄 Обновити додаток до самої нової версії</li>
            <li>📂 Зайти у вказані довідники</li>
            <li>ℹ️ Отримати повну інформацію про додаток</li>
          </ul>
          <h4 className="font-bold mb-1">🔄 Обновляйте додаток для отримання доступу до найновіших функцій</h4>
          {/*  */}
        </ScreenBlock>
        <ScreenBlock
          title="📋 Список слів-кнопки"
          img="/rwords_screens/words_list_buttons.jpg"
          //  img="/rwords_screens/words_list_buttons.jpg"
        >
          <h4 className="font-bold mb-1">Тут ви можете</h4>
          <ul className="list-disc pl-10 mb-4">
            <li>🗂️ 1-й рядок — група тем</li>
            <li>📑 2-й рядок — тема</li>
            <li>📝 Слова/фрази на мові оригіналу</li>
            <li>🔘 Кнопки: Додати, Імпортувати, Перекласти</li>
            <li>✏️ 🗑️ Редагувати або видаляти слова</li>
            <li>📥 Імпорт CSV</li>
            <li>🌍 Переклад на інші мови</li>
          </ul>
          <h4 className="font-bold mb-1">🔄 Обновляйте словниковий запас</h4>
          {/*  */}
        </ScreenBlock>

        <ScreenBlock title="📋🔀 Список слів-переміщення" img="/rwords_screens/words_list.jpg">
          <h4 className="font-bold mb-1">Тут ви можете</h4>
          <ul className="list-disc pl-10 mb-4">
            <li>{` Щоб перемістити рядок потріьно: Відмітити слово ✅. а потім натиснути кнопку "Перемістити", яка появиться при відмітці тільки одного рядка-> внизу воявиться віконце для переміщення рядка. І вже тоді стрілками  ↑/↓ перемісти вибраний рядок у потрібне місце. По завершенню переміщення вийти назад, натиснувши кнопку "Готово"`}</li>
          </ul>
          <h4 className="font-bold mb-1">🔀 Маніпулюйте словами відповідно до потреб</h4>
          {/*  */}
        </ScreenBlock>
        <ScreenBlock title="🎨 Налаштування колірних схем" img="/rwords_screens/сolors_settings.jpg">
          <h4 className="font-bold mb-1">Тут ви можете</h4>
          <ul className="list-disc pl-10 mb-4">
            <li>🌈 Вибір колірної схеми</li>
            <li>
              Натисніть на кнопку із стрілкою іназвою текучої колірної схеми і виберіть любу кольорову схему з списку.
            </li>
          </ul>
          <h4 className="font-bold mb-1">🎨 Вибирайте кольори до своїх вподобань</h4>
          {/*  */}
        </ScreenBlock>
      </ScreenBlock>

      {/* Блок цитати */}
      <blockquote className="mt-6 italic border-l-4 border-hBg pl-4 text-base sm:text-lg lg:text-xl">
        RWords — інструмент, який адаптується під вас. Ви керуєте процесом вивчення: що слухати, як оцінювати, коли
        повторювати.
      </blockquote>
    </main>
  )
}
