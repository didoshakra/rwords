//Запуск на порт 3002 yarn  dev -p 3002
//20230723-ra-rozet
//Проба зробити шпблон свйту https://rozetka.com.ua/ua/
==================================================================
Для того щоб працювала допомога по tailwindcss треба:
    - у VSCode: Tailwind CSS IntelliSense - підказки по командах
    - у проекті:https://github.com/tailwindlabs/prettier-plugin-tailwindcss
        - npm install -D prettier prettier-plugin-tailwindcss
        - // prettier.config.js
            module.exports = {
            plugins: ['prettier-plugin-tailwindcss'],
            }
------------------------------------------------------------------------------
2023.06.23/Dark Mode in Next Js 13
https://medium.com/@danielcracbusiness/dark-mode-in-next-js-13-aab566d20baa
npm i next-themes
npm i react-icons
Для того, щоб можна було використовувати свої теми darkMode у className= "dark:bg-slate-800"
треба в tailwind.config.js: module.exports = { darkMode: 'class',
}
---------------------------------------------------------------------------
// Використання: своїх іконок з кольорами з tailwindcss.config
import resolveConfig from "tailwindcss/resolveConfig"; //отримання змінних з tailwind.config
import tailwindConfig from "@/tailwind.config"; //отримання змінних з tailwind.config
*** Отримання змінних з TailwindCSS:
    -отримання змінних з tailwind.config
        import resolveConfig from "tailwindcss/resolveConfig";
        import tailwindConfig from "@/tailwind.config";
        const { theme } = resolveConfig(tailwindConfig);
        console.log("ThemeSwitche/theme=", theme);
        console.log("ThemeSwitche/theme.colors=", theme.colors);
    - зміні теми з допомогою import { useTheme } from "next-themes";
        const { resolvedTheme, setTheme } = useTheme();
        сonst colorIcon =resolvedTheme === "dark"? theme.colors.darkmenuText: theme.colors.menuText;
    -отримання внутрішніх змінних tailwindcss/кольорів
        const requireColors = require("tailwindcss/colors");
        console.log("ThemeSwitche/requireColors=", requireColors);
----------------------------------------------------------------------------
*** використання іконок з heroicons
        Dark Theme in NextJs 13 – Using React Context in Server Components//https://www.youtube.com/watch?v=RTAJ-enfums&ab_channel=HamedBahram
    npm i @heroicons/react --save-dev // Для добавлення іконок з

---------------------------------------------------------------------------------------
20230825 // Переробив DrawerSwitcher.js і DrawerDroop.js  на tailwindcss:
---------------------------------------------------------------------------------------
20230827 // Переробив multiLevelMenu для DrawerDroop:
        - забрав(закоментував):
            -відкривання субменю при наведенні на пункт меню
            -посилання для пунктів меню <li>,що мають субменю,
        - добавив;
            - можливість використання різних кольорів на кожен рівень// //Кольори для різних рівнів  //https://stackoverflow.com/questions/75565164/cannot-change-tailwind-styles-using-variables-in-react
            - стрілки - відкритий рірень(вниз) не відкритий, але що має субменю (вбік)
            - при клацанні на рівень з субменю - випадає нове субменменю тільки цього рівня
            - рівень з субменю відкривається при:
                -клацанні миші по цьому рівні
            - рівні закриваються при:
                -клацанні миші по відповідному цьому рівні(ящо найвищий, то закривабться всі дочірні)
                  - для цього кожному елементу меню призвоюю id={domId} domId = idKey + "-" + depthLevel; де idKey-номер пункту в списку субменю; depthLevel-рівень субменю.
-------------------------------------------------------------------------------------------
20230829 NextUI//https://nextui.org/    NextUI — це бібліотека інтерфейсу користувача для React, яка допомагає створювати красиві та доступні інтерфейси користувача. Створено на основі Tailwind CSS і React Aria.
    - для NextUI треба додати в:
     tailwind.config.js ;
        const { nextui } = require("@nextui-org/react");
        ...
        content: [
            "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
        ...
         plugins: [nextui()],
--------------------------------------------------------------------------------------------
???? 20230902 Підключив по іншому PostgreSQL //https://www.simplenextjs.com/posts/next-postgresql
-------------------------------------------------------------------------------------------
20230910 /Доступ до БД з paje.js: wait fetch("/api/shop/references/d_product")
    Getting started with Vercel Postgres and Next.js 13 //https://blog.coffeeinc.in/getting-started-with-vercel-postgres-and-next-js-13-bcb4715f3899

======================================================================

Створення своєї таблиці (RTable)
20230915 /Створенння таблиць за допомогою FlowbiteUI/PrelineUI/TailwindUI
    //https://flowbite.com/docs/components/tables/#striped-rows\\Table pagination
    //https://preline.co/docs/tables.html
//--------------------------------------------------------------------
// Поля задаються в const columns = [
//   { label: "In", accessor: "index", sortable: false, with: "15px" },
//    { label: "Id", accessor: "id", sortable: true, with: "20px" },
// ];
//     { label: "Назва товару"-Заголовок
//       accessor: "name"-значення з data,
//       sortable: true- чи буде сортуватись колонка
//       with: "200px"-???
// Якщо accessor: "index", то іде нумерація рядків на основі index

------------------------------------------------------------------------------------
20230919- Сортування
   /https://flowbite.com/docs/components/tables/#striped-rows\\Table pagination
    //Creating a React sortable table //https://blog.logrocket.com/creating-react-sortable-table/

//сортування/
//  Створення className для сортування(bg-color+bg-icon)
--------------------------------------------------------
20230920// Пошук/фільтр
    //https://dev.to/franciscomendes10866/react-basic-search-filter-1fkh
    //Step-by-Step Guide: Building a Simple Search Filter with React
???!!! Поки що філбтр збиває сортування, але сортування не збиває фільтр !!!
-----------------------------------------------------------------------

 20221105-фіксовані <thead> i <tfoot> з вертикальним скролом
/Таблиця з фіксованим заголовком і прокручуваним тілом//https://www.w3docs.com/snippets/html/how-to-create-a-table-with-a-fixed-header-and-scrollable-body.html
// tfoot/https://css.in.ua/html/tag/tfoot
// <th colspan="2">-обєднання колонок в заголовку і tfoot

20221110 //Поділ на сторінки:вибір к-сті рядків на сторінці/переміщення по сторінках
        - TableFooter.js,useTable.js://https://dev.to/franciscomendes10866/how-to-create-a-table-with-pagination-in-react-4lpd
         - інфа: які рядки зараз відображені на сторінці і рядків всього

// 20231111 // вибір шрифтіф таблиці (T)
// 20231114 // Видалив з таблиці select ( тепер видідення  цілим рядком)
// 20231117 // Щвидкий пошук по всіх полях(одне значення,пошуковий рядок)/Відновлення даних при стиранні у рядку/ Працює разом з сортуванням
// 20231120 // Добавив вікна фільтрів по заданих полях:DropdownFilter.js+DroopFifterForm.js
// 20231127 // Фільтрування по багатьох полях/Відновлення БД до фільтрування/ При фівльтруванні для порівняння дані перетворюються у ті типи, які задані в initialСolumns.type
// 20231128 // Вирівнювання даних в стовбцях згідно даних (initialСolumns.align)/по замовчуванню згідно типів даних (initialСolumns.type: numeric+boll=right/ date=center/ решта=left)/Якщо не заданий тип, то =left

// 20231202 // Переробим шапки з випадаючими меню/клацання поза/...
// 20231203 // ПОчав переробляти інтерфейс:
        - додав:
            r20230618-ra-tw-examples-vegefood-fashion:vegefood-Таблиця товарів (картинки) "Наші продукти"
            r20230522_ecomerc-twcss_example- Таблиця товарів (картинки)-"ПРОПОЗИЦІЇ ДНЯ"
        - на головній новікартинки товарів + акції з msta
---------------------------------------------------------------------------------------------------------
// 20231207 / Відмовився від своїх і @heroicons/react іконок(тепер тільки оригінальні SVG)
----------------------------------------------------------------------------------------
// 20231208-Добавив вибір тем кількох тем у Tailwind CSS і Next.js //https://dev.to/ultroneoustech/creating-multiple-themes-in-tailwind-css-and-nextjs-2e98
    -tailwind.config.js
    -app\global.css - задаються стилі по default + внизу добавляються інші стилі
    -styles\themes\theme1..
     *-стратегія стилів:
     в theme1... -задаються тільки bg для light:(світла тема)
        dark: не задається, а викорисирвуються text- з light:(світла тема),

// Переробив всі headder компоненти і (shop)product під теми
// Закриваються випадаючі меню!


!!! useMemo & useCallback - оптимізація(візуалізує 1-й раз + тільки при зміні параметрів)
За замовчуванням, коли компонент повторно відтворюється, React рекурсивно відтворює всі його дочірні компоненти.
Не буду роьити, бо команда React сама доробить оптимізацію
=============================================

// 20231215-Новий підхід до тем: один  формат кольорів від 50 до 800:(Pc0-Pc8)
    - В tailwind.config.js визначеються назви змінни кольорів у відповідності до основних елементів APP
        - за основу кольрів тем береться //Tailwind CSS Color Palette in different CSS color formats
        - змінним присвоюються  кольоритем, які задаються у globals.css і переназначаються у theme.css...
        - кожна тема відповідає одному формату кольорів від 50 до 800:(Pc0-Pc8)
        - додаткові теми приміняються для основної світлої теми і частково для основної темної теми
        - кольори з theme.css для темної теми використовубться тільки text-, а для свілої всі
        - колоьри з globals.css- це кольори по замовчуванню для всіх тем, в тому числі і основної темної теми
        - у tailwind.config.js- можуть бути ще деякі кольори, яких нема у tailwind.config.js і theme.css
        - в APP використовуються змінні кольорів з tailwind.config.js
    - Зроблено 23теми з Tailwind CSS Color Palette in different CSS color formats //https://redpixelthemes.com/blog/tailwindcss-colors-different-formats/#color-Orange

// 20231216 // ВІдмітити(зняти) всі/
// 20231217 ////<th>i<td>-whitespace-nowrap-щоб текст у комірці таблиці не переносився(довгий рядок)
// 20231222 //Нижній рядок сумування/Працює на основі параметрів initialСolumns(sum: "sum","max","min","mean" \\можна відключити (p_sum=false)-небуде ні нижньоо рядка ні кнопки обчислення Sum
// 20231226 Налаштування ф-цій таблиці:/вибрати всі/шрифти/фільтр/швидкий пошук/підсумковий рядок/
// 20231227 Відображення в таблиціобєктів "img"(посилання на картинку) і"boolean"(галочка-іконка)
// 20231228 Доробив: Фільтри по даті/ щоб працювало фільтрування по date, з SQL запиту треба пмовертати чистий тип дати в фортаті yyyy-mm-ddT00:00:0000 а не перетворювати в запиті  char типу COALESCE(to_char(date_create, 'MM-DD-YYYY'), '') AS datecreate,
//*** Типи даних ******* */(string,number,boolean,img,date-це об'єкт,але треба вказувати)
// Для кращого відображення і фільтрування потрібно вказувати типи даних
// Якщо тип не вказаний, то він прирівнюється до (string)
//------------------------------------------------------------------------

//20231229-Export в EXELL(Роб)/sheetjs-style
//https://codesandbox.io/p/devbox/alkira-sfubt5?file=%2Fsrc%2Fcomponents%2Fexcelexport%2FExcelExport.tsx%3A2%2C1-3%2C37
    mpm i file-saver //файл-зберігач
    npm install xlsx

//--Чи треба print, якщо є EXELL??? react-to-print //https://medium.com/@aiska.basnet/print-in-react-437b78b257d3
//--------------------------------------------------------------------------------------------
====================================================================================================================

//-- 20240102 //Переробив page.js, як asyn/(server Action) для на отримання даних  з БД безпосередньо в компоненті
  //https://github.com/vercel/next.js/tree/canary/examples/next-forms  \\Home.js

//-- 20240105 // ПРи роботі з PostgreSQL замість pg(npm) почав використовувати postgres(npm) https://github.com/porsager/postgres?tab=readme-ov-file#connection-details
    - переробив рядок пвдключення в

//--- 202401010 //Доробив форми вводу даних
//--- 20240112 /Rtable- добавив щоб вікмітка багатьох записів буда тільки Ctrl+ЛКМ

************************************************************************************

//-- 20250302 /Что принес релиз NextJS 15 и как обновиться //https://www.youtube.com/watch?v=mgl-3vNas_w&ab_channel=%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%D0%9D%D0%B5%D0%BF%D0%BE%D0%BC%D0%BD%D1%8F%D1%89%D0%B8%D0%B9
    Міграція на Nex15/ React19:
    npx @next/codemod@canary upgrate latest
