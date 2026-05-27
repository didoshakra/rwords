// about_rwords/page.js
"use client"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"

function ScreenBlock({ id, title, img, children }) {
  return (
    <section id={id} className="space-y-2 text-xs sm:text-sm lg:text-base mb-6">
      <h3 className="h3On text-h3On text-center mb-2">{title}</h3>
      <div className={`grid gap-2 items-center ${img ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
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
    <main className="px-1 py-4 max-w-4xl mx-auto text-pOn dark:text-pOnD">
      {/* Секція завантаження застосунку */}
      <section className="bg-kBg text-sm sm:text-base lg:text-lg mb-6 text-center py-4 px-4 rounded">
        {/* {user ? ( */}
          <Link
            href="/download"
            className="flex items-center justify-center gap-2 bg-btBg text-btOn dark:text-btOnD px-6 py-3 rounded hover:bg-btBgHov transition "
          >
            <Image src="/images/home/RW_know_64.png" alt="RWords" width={24} height={24} priority />
            До завантаження застосунку ⬇️
          </Link>
        {/* ) : (
          <>
            <p className="mb-6  text-pOn  dark:text-pOnD font-semibold">
              Зареєструйтесь, щоб завантажити застосунок RWords, створювати власні словники, публікувати дописи та
              коментувати записи.
            </p>

            <Link
              href="/auth"
              className="inline-block bg-btBg text-btOn hover:bg-btBgHov px-5 py-2 rounded transition text-sm sm:text-base lg:text-lg"
            >
              Увійти або зареєструватись
            </Link>
          </>
        )} */}
      </section>
      {/* Головний заголовок */}
      <div className="flex justify-center mt-1 mb-2">
        <h1 className="h1On text-h1On inline-flex items-center gap-2 ">
          <Image src="/images/home/RW_know_64.png" alt="RWords" width={24} height={24} priority />
          Що таке RWords?
        </h1>
      </div>

      {/* Опис застосунку */}
      <section className="mb-6">
        <h2 className="h2On text-h2On mb-2 ">
          📖 Це платформа для вивчення іноземних слів і фраз, яка складається з 2-х частин:
        </h2>
        <h3 className="h3On text-h3On mx-8 mb-1 ">1. Застосунку RWords</h3>
        <h3 className="h3On text-h3On mx-8 mb-1 ">2. Цього сайту</h3>

        <p className="pOn text-Text mb-2 indent-8">
          <span className="font-bold"> Основне завдання застосунку</span> — допомогти вам ефективно вивчати іноземні
          слова, вирази і речення, використовуючи голосові команди і кнопки для формування списків тільки з тих слів,
          які ви хочете вивчати, відкидаючи уже відомі вам слова із уже сформованих списків. Це дозволяє зосередитися на
          вивченні нових слів і підвищує ефективність процесу навчання.
        </p>
        <p className="pOn text-Text mb-2 indent-8">
          <span className="font-bold">Основне завдання сайту</span> — допомогти вам швидко знаходити додаткові слова,
          вирази і речення, створювати і редагувати нові списки для їх вивчення. А також допомогти мені розвивати цей
          сайт і додаток на основі ваших відгуків і побажань.
        </p>
        <p className="pOn text-Text mb-2 indent-8">
          <span className="font-bold">У застосунку ви можете</span> прослуховувати слова, вирази та речення з перекладом
          на вибрану мову із вибраних вами списків. Під час прослуховування ви можете оцінювати свої знання натискаючи
          кнопки «Знаю» / «Не знаю», чи подаючи аналогічні команди голосом. Це дає можливість при виборі списків для
          прослуховування формувати персональні списки. Слова, позначені як «Знаю», можна виключати з подальшого
          відтворення. Результат оцінювання своїх знань можна переглянути в довіниках «Слова та вирази» і «Теми», у яких
          всі слова, які ви відмітили як знаю, позначаються 👍. У «Теми» ви знайдете кількісне і % значення. Ви також
          можете формувати нові списки шляхом імпорту з сайту RWords або імпорту з CSV файлів.
        </p>
        <p className="pOn text-Text mb-2 indent-8">
          <span className="font-bold">На сайті ви можете</span> створювати, редагувати, видаляти, імпортувати (CSV) і
          перекладати слова, вирази і речення, а також створювати і редагувати теми і групи тем. Після створення нових
          списків на сайті, ви можете імпортувати їх у застосунок.
        </p>
      </section>
      {/*  */}
      {/* 1. Основні можливості */}
      <ScreenBlock title="📝 В застосунку ви можете">
        <ul className="list-disc pl-4 space-y-2">
          <li className="h4Text text-h3On  mb-1">
            🎙️
            <Link href="#listen" className="text-blue-600 underline ml-1">
              Налаштовувати середовище для прослуховуванням
            </Link>
          </li>
          <li className="h4Text text-h3On  mb-1">
            🎧
            <Link href="#listenPlay" className="text-blue-600 underline ml-1">
              Слухати слова, вирази та речення і оцінювати свої знання
            </Link>
          </li>

          <li className="h4Text text-h3On  mb-1">
            ⚙️
            <Link href="#listeningMode" className="text-blue-600 underline ml-1">
              Вибирати режими прослуховування
            </Link>
          </li>
          <li className="h4Text text-h3On  mb-1">
            🗣️
            <Link href="#voiceCommands" className="text-blue-600 underline ml-1">
              Налаштувати голосові команди
            </Link>
          </li>
          <li className="h4Text text-h3On  mb-1">
            📂
            <Link href="#choiceTopics" className="text-blue-600 underline ml-1">
              Вибирати теми для прослуховування
            </Link>
          </li>
          <li className="h4Text text-h3On  mb-1">
            🎓
            <Link href="#choiceKnowledge" className="text-blue-600 underline ml-1">
              Вибрати знання для прослуховування
            </Link>
          </li>
          <li className="h4Text text-h3On  mb-1">
            ☰
            <Link href="#choiceMenu" className="text-blue-600 underline ml-1">
              Перейти в меню і вибрати щось із запропонованого списку
            </Link>
          </li>

          <li className="h4Text text-h3On  mb-1">
            📋
            <Link href="#wordList" className="text-blue-600 underline ml-1">
              Робити щось зі списком слів
            </Link>
          </li>
          <li className="h4Text text-h3On  mb-1">
            📋
            <Link href="#topicsList" className="text-blue-600 underline ml-1">
              Робити щось зі списком тем
            </Link>
          </li>
          <li className="h4Text text-h3On  mb-1">
            📋
            <Link href="#csvStructure" className="text-blue-600 underline ml-1">
              Ознайомитися з CSV структурою файлу імпорту .csv
            </Link>
          </li>
          <li className="h4Text text-h3On  mb-1">
            🌈
            <Link href="#colorSettings" className="text-linkOn underline ml-1">
              Вибрати колірну схему
            </Link>
          </li>
          <li className="h4Text text-h3On  mb-1">
            🌐
            <Link href="#wwwRWords" className="text-linkOn underline ml-1">
              Перейти на сайт RWords
            </Link>
          </li>
          <li className="h4Text text-h3On  mb-1">
            📋
            <Link href="#wwwWordsList" className="text-linkOn underline ml-1">
              Вибрати список слів на сайті і імпортувати його в застосунок
            </Link>
          </li>
          <li className="h4Text text-h3On  mb-1">
            📋
            <Link href="#wwwWordsImport" className="text-linkOn underline ml-1">
              Завантаження списку слів з сайту
            </Link>
          </li>
        </ul>
      </ScreenBlock>
      {/*  */}

      {/* Підзаголовок "Як працює" */}
      <h2 className="text-h2On text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 text-center">
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

      <ScreenBlock title="🧭 Застосунок має 4-й основні екрани.">
        {/* <h4 className="h4Text text-h3On text-center mb-1">
          Вони відкриваються по натисканню кнопок в нижній навігаційній панелі.
        </h4> */}
        <ul className="list-disc pl-4 space-y-2">
          <li>
            <strong>1.🏠 Home</strong> — титульний екран з іконками перемикання тем🌙-темна/🌞-світла і ❓-загальний
            опис додатку
          </li>
          <li>
            <strong>2.🎧 Слухати</strong> — головний екран який складається з 2-х частин:
            <p className="pOn text-Text mt-1">
              У 1-й частині екрану «Слухати» ви можете налаштовувати і отримувати інформацію про прослуховування
            </p>
            <p className="pOn text-Text mt-1">
              У 2-й частині екрану «Слухати» ви можете прослуховувати і оцінювати слова.
            </p>
          </li>
          <li>
            <strong>3.🌐 wwwRWords</strong> — перехід на сайт для нових списків слів
          </li>
          <li>
            <strong>4.☰ Меню</strong> — налаштування, колірні теми, оновлення додатку
          </li>
        </ul>
      </ScreenBlock>
      {/* 1 */}
      {/* <ScreenBlock title="🧭 Основні екрани"> */}
      <ScreenBlock>
        <ScreenBlock title="🏠 Початковий екран" img="/rwords_screens/scr_homeGreen.jpg">
          <h4 className="font-semibold mb-1">🔝 Верхня панель</h4>
          <ul className="list-disc pl-4 mb-4">
            <li>🌙 Перемикач теми</li>
            <li>❓ Загальний опис додатку</li>
          </ul>
        </ScreenBlock>

        <ScreenBlock id="listen" title="🗣️ Слухати/Налаштування" img="/rwords_screens/sct_listenGreen.jpg">
          <h4 className="font-bold mb-1">Тут ви можете</h4>
          <ul className="list-disc pl-4 mb-4">
            <li>🎙️🚫 включати/виключати мікрофон для того щоб додаток міг слухати голосові команди</li>
            <li>🎙️ налаштовувати голосові команди по кнопці/рядку голосові команди;</li>
            <li>⚙️ налаштовувати режими прослуховування </li>
            <li>🎯 бачити к-сть вибраних слів для прослуховування</li>
            <li> ▼ обирати знання для прослуховування</li>
            <li> ▼ обирати теми для прослуховування</li>
            <li>Напис «Голос» або «Не слухаю» відображаються при включеному/виключеному мікрофоні</li>
            <li>Мікрофон посередині, пульсує при включенні</li>
            <li>Справа відображаються розпізнані програмні команди (тільки при активному мікрофоні)</li>
            <li>
              «↺ З початку» / «▶️ Продовжити» - обирати початок або продовження прослуховування з останнього слова
              попереднього сеансу якщо воно є в поточному списку
            </li>
          </ul>
        </ScreenBlock>
        <ScreenBlock id="listenPlay" title="🎧 Слухати/Прослуховування" img="/rwords_screens/scr_ListenPlayGreen.jpg">
          <h4 className="font-bold mb-1">Доступні наступні кнопки і голосові команди</h4>
          <ul className="list-disc pl-4 mb-4">
            <li> «➡️ Далі» – переходить до наступного слова</li>
            <li> «⬅️ Назад» – повертається до попереднього</li>
            <li> «🔁 Повторити» – повторює поточне слово</li>
            <li> «🔙 Назад» – повертає до попереднього екрана</li>
            <li>{` «⏪ На початок» – на початок з запам'ятовуванням останнього слова`}</li>
            <li> «✅ Знаю» – позначає слово як відоме</li>
            <li> «❌ Не знаю» – позначає слово як відоме</li>
            <li> «🗂 Наступна тема» – перехід на наступну тему</li>
          </ul>
          <h4 className="font-bold mb-1">🎧 Прослуховуйте слова й оцінюйте свої знання.</h4>
          <h4 className="font-bold mb-1">🎙️ використовуйте голосові команди або кнопки.</h4>
          {/*  */}
        </ScreenBlock>
        <ScreenBlock id="listeningMode" title="⚙️ Режими прослуховування" img="/rwords_screens/scr_settingsGreen.jpg">
          <h4 className="font-bold mb-1">Тут ви можете задавати</h4>
          <ul className="list-disc pl-4 mb-4">
            <li> ⏳-різні паузи після...</li>
            <li>⏱️ Затримка голосу (для правильного співставлення голосових команд «✅ Знаю»/«❌ Не знаю»)</li>
            <li>🔊 Вираз для озвучки кінця списку(вираз який скаже програма при закінченні вибраного списку слів)</li>
            <li>🔁 Вираз для озвучки початку списку(вираз який скаже програма при початку вибраного списку слів)</li>
            <li>🎛️ Всі кнопки в словах(відображаються всі кнопки при прослуховуванні або тільки основні)</li>
            <li>📂 Вибір тем</li>
            <li>✅ Вибір знань </li>
            <li>🖼️ Показ картинки</li>
            <li>🗣️ Мова оригіналу</li>
            <li>🌐 Мова перекладу</li>
          </ul>
          <h4 className="font-bold mb-1">🎧 Налаштовуйте застосунок під свій ритм.</h4>
          {/*  */}
        </ScreenBlock>
        <ScreenBlock
          id="voiceCommands"
          title="🎙️ Налаштування голосових команд"
          img="/rwords_screens/scr_voiceCommandsGreen.jpg"
        >
          <h4 className="font-bold mb-1">Тут ви можете</h4>
          <ul className="list-disc pl-4 mb-4">
            <li>🗣️ Додавати нові голосові команди для кнопок</li>
            <li>📝 Коригувати/❌видаляти голосові команди</li>
            <li>
              🎙️ Голосові команди можна додавати не тільки з клавіатури, а і голосом, налаштовуючи їх під свій
              тембр{" "}
            </li>
          </ul>
          <h4 className="font-bold mb-1">🗣️ Налаштовуйте команди під свій тембр голосу</h4>
          {/*  */}
        </ScreenBlock>
        <ScreenBlock id="choiceTopics" title="📂 Вибір тем" img="/rwords_screens/scr_ChoosingTopicsGreen.jpg">
          <h4 className="font-bold mb-1">Тут ви можете</h4>
          <ul className="list-disc pl-4 mb-4">
            <li>▼ Відкривати групу тем</li>
            <li>✅ Відмічати теми для прослуховування</li>
            <li>
              ═ Переміщати теми в списку в межах групи для зміни послідовності відтворення, тягнучи за іконку ═
              вверх/вниз
            </li>
          </ul>
          <h4 className="font-bold mb-1">🧑‍🤝‍🧑 Налаштовуйте послідовність відтворення тем</h4>
          {/*  */}
        </ScreenBlock>
        <ScreenBlock id="choiceKnowledge" title="🎓 Вибір знань" img="/rwords_screens/scr_ChoosingKnowGreen.jpg">
          <h4 className="font-bold mb-1">Доступний слідуючий вибір</h4>
          <ul className="list-disc pl-4 mb-4">
            <li>✅ Знаю</li>
            <li>❌ Не знаю</li>
            <li>👥 Всі</li>
          </ul>
          <h4 className="font-bold mb-1">🎯 Вибирайте тільки потрібні слова</h4>
          {/*  */}
        </ScreenBlock>
        <ScreenBlock id="choiceMenu" title="☰ Меню" img="/rwords_screens/scr_menuGreen.jpg">
          <h4 className="font-bold mb-1">Тут ви можете</h4>
          <ul className="list-disc pl-4 mb-4">
            <li>📱 Побачити версію вашого додатку</li>
            <li>🆕 Побачити доступну нову версію (якщо ваш додаток старіший)</li>
            <li>🔄 Оновити додаток до самої нової версії</li>
            <li>🎨 Вибирайте колірні теми інтерфейсу додатку у відповідності до своїх вподобань</li>
            <li>📂 Зайти у вказані довідники</li>
            <li>ℹ️ Отримати повну інформацію про додаток</li>
          </ul>
          <h4 className="font-bold mb-1">🔄 Оновлюйте додаток для отримання доступу до найновіших функцій</h4>
          {/*  */}
        </ScreenBlock>

        <ScreenBlock id="wordList" title="📋 Список слів" img="/rwords_screens/scr_WordsListGreen.jpg">
          <h4 className="font-bold mb-1">Тут ви бачите</h4>
          <ul className="list-disc pl-4 mb-4">
            <li>
              🗂️ У кожному з заголовків в дужках ви можете бачити к-сть відмічених і загальну кількість рядків, що
              входять до групи(теми)
            </li>
            <li>🗂️ 1-й рядок — група тем</li>
            <li>📑 2-й рядок — тема</li>
            <li>📝 Слова/фрази на мові оригіналу</li>
            <li>🔘 Кнопки: Додати, Імпортувати, Перекласти</li>
          </ul>
          <h4 className="font-bold mb-1">Тут ви можете</h4>
          <ul className="list-disc pl-4 mb-4">
            <li>🔘 Додати, Редагувати, Видаляти,Імпортувати, Перекласти слова</li>
            <li>✏️ 🗑️ Кнопки Редагувати або Видалити появляться тільки при відмітці хоч одного рядка</li>
            <li>✅ Щоб відмітити(вибрати) рядок, натисніть на нього</li>
            <li>➕ Щоб додати новий рядок, натисніть на кнопку Додати</li>
            <li>📝 Щоб редагувати або видалити рядок, відмітьте його і натисніть відповідну кнопку</li>
            <li>📥 Імпортувати слова CSV</li>
            <li>🌍 Перекладати на інші мови</li>
          </ul>
          <h4 className="font-bold mb-1">🔄 Оновлюйте словниковий запас</h4>
          {/*  */}
        </ScreenBlock>
        <ScreenBlock id="topicsList" title="📋 Теми" img="/rwords_screens/scr_TopicsListGreen.jpg">
          <h4 className="font-bold mb-1">Тут ви бачите</h4>
          <ul className="list-disc pl-4 mb-4">
            <li>
              🗂️ У кожному з заголовків в дужках ви можете бачити к-сть відмічених і загальну кількість рядків, що
              входять до групи
            </li>
            <li>🗂️ 1-й рядок — група тем</li>
            <li>📑 Нижче рядки — тема</li>
            <li>👍 У рядку тема ви можете бачити %(28) і к-сть(6) слів, які ви оцінили як Знаю</li>
          </ul>
          <h4 className="font-bold mb-1">Тут ви можете</h4>
          <ul className="list-disc pl-4 mb-4">
            <li>🔘 Додати, Редагуввати, Видаляти,Імпортувати, Перекласти слова</li>
            <li>✏️ 🗑️ Кнопки Редагувати або Видалити появляться тільки при відмітці хоч одного рядка</li>
            <li>✅ Щоб відмітити(вибрати) рядок, натисніть на нього</li>
          </ul>
          <h4 className="font-bold mb-1">🔄 Оновлюйте словниковий запас</h4>
          {/*  */}
        </ScreenBlock>
        <ScreenBlock
          id="csvStructure"
          title="📋CSV структура файлу імпорту .csv"
          img="/rwords_screens/scr_FileCsv.jpg"
          //  img="/rwords_screens/words_list_buttons.jpg"
        >
          <h4 className="font-bold mb-1">Загальне для всього файлу</h4>
          <ul className="list-disc pl-4 mb-4">
            <li>`// - на початку - ігнорується весь рядок`</li>
            <li>* - на початку - Нова тема </li>
            <li>; - роздільник між полями (може не бути, якщо нема слідуючого поля)</li>
          </ul>
          <h4 className="font-bold mb-1">Структура рядків</h4>
          <ul className="list-disc pl-4 mb-4">
            <li>1-й рядок: назва секції(групи тем) ; назва секції англійською (для створення папки картинки)</li>
            <li>2-й рядок: назва теми ; назва теми англійською (для створення папки картинки)</li>
            <li>3-й і решта: слово ; вираз, речення ; назва картинки для слова</li>
          </ul>

          <h4 className="font-bold mb-1">
            📥 Приклад структури .csv файлу можна
            <a href="/rwords_screens/ImportWords.csv" className="text-blue-600 underline ml-1">
              переглянути тут
            </a>
          </h4>
          {/*  */}
        </ScreenBlock>

        <ScreenBlock
          id="colorSettings"
          title="🎨 Налаштування колірних схем"
          img="/rwords_screens/scr_colorSettingsGreen.jpg"
        >
          <h4 className="font-bold mb-1">Тут ви можете</h4>
          <ul className="list-disc pl-4 mb-4">
            <li>🌈 Вибрати колірну схему</li>
            <li>
              Натисніть на кнопку із стрілкою і назвою текучої колірної схеми і виберіть любу колірну схему з списку.
            </li>
          </ul>
          <h4 className="font-bold mb-1">🎨 Вибирайте кольори до своїх вподобань</h4>
          {/*  */}
        </ScreenBlock>
        {/*  www*/}
        <ScreenBlock id="wwwRWords" title="📋 Сайт RWords вид з додатку" img="/rwords_screens/scr_wwwGreen.jpg">
          <h4 className="font-bold mb-1">Тут ви можете </h4>
          <ul className="list-disc pl-4 mb-4">
            <li>🗂️ Перейти на домашню сторінку сайту RWords</li>
          </ul>
          <h4 className="font-bold mb-1">🌐 Переходьте на сайт для додавання нових списків слів</h4>

          {/*  */}
        </ScreenBlock>
        <ScreenBlock id="wwwWordsList" title="📋 Список слів на сайті" img="/rwords_screens/scr_wwwWordsListGreen.jpg">
          <h4 className="font-bold mb-1">Тут ви бачите</h4>
          <ul className="list-disc pl-4 mb-4">
            <li>
              🗂️ У кожному з заголовків в дужках ви можете бачити к-сть відмічених і загальну кількість рядків, що
              входять до групи(теми)
            </li>
            <li>🗂️ 1-й рядок — група тем</li>
            <li>📑 2-й рядок — тема</li>
            <li>📝 Слова/фрази на мові оригіналу</li>
            <li>🔘 Кнопки: Додати, Імпортувати, Перекласти</li>
          </ul>
          <h4 className="font-bold mb-1">Тут ви можете</h4>
          <ul className="list-disc pl-4 mb-4">
            <li>🔘 Додати, Редагуввати, Видаляти,Імпортувати, Перекласти слова</li>
            <li>✏️ 🗑️ Кнопки Редагувати або Видалити появляться тільки при відмітці хоч одного рядка</li>
            <li>✅ Щоб відмітити(вибрати) рядок, натисніть на нього</li>
            <li>➕ Щоб додати новий рядок, натисніть на кнопку Додати</li>
            <li>📝 Щоб редагувати або видалити рядок, відмітьте його і натисніть відповідну кнопку</li>
            <li>📥 Імпортувати слова CSV</li>
            <li>🌍 Перекладати на інші мови</li>
          </ul>
          <h4 className="font-bold mb-1">🔄 Оновлюйте словниковий запас</h4>
        </ScreenBlock>
        <ScreenBlock
          id="wwwWordsImport"
          title="📋 Завантаження списку слів з сайту"
          img="/rwords_screens/scr_wwwWordsImportGreen.jpg"
        >
          <h4 className="font-bold mb-1">Тут ви бачите</h4>
          <ul className="list-disc pl-4 mb-4">
            <li>📥 кіневу фаза імпорту нових списків з csv файлу в застосунок</li>
          </ul>
          <h4 className="font-bold mb-1">
            🔄 Обновлюйте словниковий запас імпортуючи нові списки з сайту в застосунок
          </h4>
          {/*  */}
        </ScreenBlock>
      </ScreenBlock>

      {/* Блок цитати */}
      <blockquote className="mt-6 italic border-l-4 border-hBg pl-4 text-base sm:text-lg lg:text-xl">
        RWords — інструмент, який адаптується під вас. Ви керуєте процесом вивчення: що слухати, як оцінювати, коли
        повторювати. Ви також можете залишати відгуки та пропозиції для покращення застосунку. Разом ми зробимо RWords
        ще кращим!
      </blockquote>
    </main>
  )
}
