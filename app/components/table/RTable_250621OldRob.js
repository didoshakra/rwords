//RTable.js-таблиця:пошук(фільтр) по всіх полях/сортування/select.
//Select: selectedRows- масив індексів(_nrow) вибраних рядків  )
//==== на базі RTable.js==========================================================
//https://flowbite.com/docs/components/tables/#striped-rows\\Table pagination
//Creating a React sortable table //https://blog.logrocket.com/creating-react-sortable-table/
//---
//https://dev.to/franciscomendes10866/react-basic-search-filter-1fkh
//Step-by-Step Guide: Building a Simple Search Filter with React
//--------------------------------------------------------------------

// Поля задаються в const initialСolumns = [
//  {label: "ШтрихКод", //Що буде відображатись в заголовку <th>
//   accessor: "skod",//-значення з БД, (Якщо accessor: "index", то іде нумерація рядків на основі index)
//   type: "date", //Для фільтру і вирівнюванню в рядку(string-вліво, numeric-вправо,date-по центу)
//   sortable: true,//чи буде сортуватись колонка
//   filtered: true,//чи буде фільтруватись
//   align: "center",//Додпткове вирівнбвання в стстовбцю(має перевагу над type)
//   minWith: "100px",//Ще не прпцює
//   With: "200px",}//Ще не прпцює
// ];
//     { label: "Назва товару"-Заголовок
//       accessor: "name"-значення з data,
//       sortable: true- чи буде сортуватись колонка
//       with: "200px"-???
//
//сортування/
//  Створення className для сортування(bg-color+bg-icon)
// 20231105-фіксовані <thead> i <tfoot> з вертикальним скролом
// Таблиця з фіксованим заголовком і прокручуваним тілом//https://www.w3docs.com/snippets/html/how-to-create-a-table-with-a-fixed-header-and-scrollable-body.html
// <th colspan="2">-обєднання колонок в заголовку і tfoot
// 20231110 //Поділ на сторінки:вибір к-сті рядків на сторінці/переміщення по сторінках
// - TableFooter.js,useTable.js://https://dev.to/franciscomendes10866/how-to-create-a-table-with-pagination-in-react-4lpd
//  - інфа: які рядки зараз відображені на сторінці і рядків всього
// 20231111 // вибір шрифтіф таблиці (T)
// 20231114 // Видалив з таблиці select ( тепер видідення  цілим рядком)
// 20231117 // Щвидкий пошук по всіх полях(одне значення,пошуковий рядок)/Відновлення даних при стиранні у рядку/ Працює разом з сортуванням
// 20231120 // Добавив вікна фільтрів по заданих полях:DropdownFilter.js+DroopFifterForm.js
// 20231127 // Фільтрування по багатьох полях/Відновлення БД до фільтрування/ При фівльтруванні для порівняння дані перетворюються у ті типи, які задані в initialСolumns.type
// 20231128 // Вирівнювання даних в стовбцях згідно даних (initialСolumns.align)/по замовчуванню згідно типів даних (initialСolumns.type: number+boolean=right/ date=center/ решта=left)/Якщо не заданий тип, то =left
// 20231215 -  ВІдмітити(зняти) всі/
// 20231217 - <th>i<td>-whitespace-nowrap-щоб текст у комірці таблиці не переносився(довгий рядок)
// 20231222 - Cуми по стовбцях:Нижній рядок сумування/Працює на основі параметрів initialСolumns(sum: "sum","max","min","mean" \\можна відключити (p_sum=false)-небуде ні нижньоо рядка ні кнопки обчислення Sum
// 20231226 Налаштування ф-цій таблиці:/вибрати всі/шрифти/фільтр/швидкий пошук/підсумковий рядок/
// 20231227 Відображення в таблиціобєктів "img"(посилання на картинку) і"boolean"(галочка-іконка)
// 20231228 Доробив: Фільтри по даті/ щоб працювало фільтрування по date, з SQL запиту треба пмовертати чистий тип дати в фортаті yyyy-mm-ddT00:00:0000 а не перетворювати в запиті  char типу COALESCE(to_char(date_create, 'MM-DD-YYYY'), '') AS datecreate,
//--------------------------------------------------------------------------------------------------------------------

//*** Типи даних ******* */(string,number,boolean,img,date-це об'єкт,але треба вказувати)
// Для кращого відображення і фільтрування потрібно вказувати типи даних
// Якщо тип не вказаний, то він прирівнюється до (string)

"use client"
import { useState, useMemo, useCallback, useRef } from "react"
// import Image from "next/image"
import { useRouter } from "next/navigation"
import * as XLSX from "xlsx" //Екпорт в EXELL
import { saveAs } from "file-saver" //Для запису файлів/Екпорт в EXELL
import TableFooter from "./TableFooter"
import { TablePageRows } from "./TablePageRows"
import DropdownFilter from "./DropdownFilter"
import TableMenuDroop from "./TableMenuDroop"
// import TableMenuDroop from "./TableMenuDroopSeting"

export default function Rtable({
  initialData, //початкові дані (з БД) - обов'язково
  initialСolumns, //поля(задаються в ...) - обов'язково
  p_title, //назва таблиці/- не обов'язково
  p_selected, //Вибрати всі+ інвормація про к-сть вибраних рядків
  p_fonts, //чи треба зміні фонтів(величина шрифтів)(true/false)
  p_filtered, //чи треба Фільтр по всіх полях-не обов'язково(true/false)
  p_sumRow, //чи треба Підсумковий рядок(true/false)
  p_searchAllRows, //чи треба пошук по всіх полях-не обов'язково(true/false)
  //
  setIsFormAdd, //Для відкриття форми додавання
  setIsFormEdit,
  setIsFormDelete,
  setEditData, //дані для коригування
  setDeleteData, //дані для вилучення
  //   fDelete, //Ф-ція для видалення записів(прийлає масив rows БД)
}) {
  const router = useRouter() //для виходу із сторінок і переходу на інші сторінки
  const [isTableMenuDroop, setIsTableMenuDroop] = useState(false) //чи активовано drawer налаштування і подій
  //   const [isMenuSetingDrop, setIsMenuSetingDrop] = useState(false) //налаштування(шестерня)(НЕ БУДЕ)чи активовано меню налаштування
  const [isDropdownFilter, setIsDropdownFilter] = useState(false) //чи активовано вікно фільтру
  const [pSeting, setPSeting] = useState({
    pSelected: p_selected,
    pFonts: p_fonts,
    pFiltered: p_filtered,
    pSumRow: p_sumRow,
    pSearchAllRows: p_searchAllRows,
  })
  //   console.log("RTable.js/pSeting=", pSeting)
  const [workData, setWorkData] = useState([]) //РОбоча таьлиця
  const [filterData, setFilterData] = useState([]) //Фільтер для всіх полів
  const [sumRow, setSumRow] = useState({}) //Підсумковий рядок(дані)
  const [selectedRows, setSelectedRows] = useState([]) //Вибрані рядки(дані{1,2,...})
  const [selectedAllRows, setSelectedAllRows] = useState(false) //Чи була подія вибрані всі
  const [sortField, setSortField] = useState("") //Поле(колонка) по якій сортується
  const [order, setOrder] = useState("asc") //Сортування в яку сторону(верх/вниз)
  const [rowsPerPage, setRowsPerPage] = useState(15) //К-сть рядків на сторінку
  const [tableFontSize, setTableFontSize] = useState("sm") //Шрифти таблиці(font-size )
  const [lengthSearhValue, setLengthSearhValue] = useState(0) //Попереднє значення рядка пошуку(Для відкату пошуку)
  const [beforSeachData, setBeforSeachData] = useState([]) //Зберігається БД перед пошуком (Для відкату пошуку)
  const [beforFilterData, setBeforFilterData] = useState([]) //Зберігається БД перед фільтруванням (Для відкату)
  const [filteredState, setFilteredState] = useState(0) //Стан фільтрування (0-незаповнений фільтр і не було фільтрування/ 1-заповнений фільтр, але не було фільтрування / 2- було фільтрування)
  const dataJson = useRef([]) // для convertToJson з EXELL/зберігає до renderingy
  //** Сторінки */ //https://dev.to/franciscomendes10866/how-to-create-a-table-with-pagination-in-react-4lpd
  const [page, setPage] = useState(1) //Номер текучої сторінки

  // Стилі таблиці
  //Величина щрифта основних компонентів таблиці(надбудова(пошук+ітфо)/шапка/чаклунки/footer(підсумки)/нижній інфорядок з вибором сторінок (МОЖЛИВИЙ ВИБІР)
  //em-Відносно розміру шрифту даного елемента(=em*text-xs)
  const styleTableImg =
    tableFontSize === "xs"
      ? " h-3 w-3"
      : tableFontSize === "sm"
      ? "h-[14px] w-[14px]"
      : tableFontSize === "base"
      ? "h-4 w-4"
      : "h-[18px] w-[18px]"

  const styleTableText =
    tableFontSize === "xs"
      ? " text-xs p-[0.25em]"
      : tableFontSize === "sm"
      ? " text-sm p-[0.2em]"
      : tableFontSize === "base"
      ? " text-base p-[0.2em]"
      : " text-lg p-[0.2em]"

  const styleTitleText =
    tableFontSize === "xs"
      ? " text-lg p-[0.1em]"
      : tableFontSize === "sm"
      ? " text-xl p-[0.1em]"
      : tableFontSize === "base"
      ? " text-2xl p-[0.1em]"
      : " text-3xl p-[0.1em]"

  //   const styleTableRowsColor = row._selected
  //     ? "bg-tabTrBgSel dark:tabTrBgSelD"
  //     : " odd:bg-tabTrBg even:bg-tabTrBgEve hover:bg-tabTrBgHov dark:odd:bg-tabTrBgD dark:even:bg-tabTrBgEveD dark:hover:bg-tabTrBgHovD";
  //   const styleTableRowsColor = row._selected
  //     ? "bg-tabTrBgSel dark:tabTrBgSelD"
  //     : " odd:bg-tabTrBg even:bg-tabTrBgEve hover:bg-tabTrBgHov dark:odd:bg-tabTrBgD dark:even:bg-tabTrBgEveD dark:hover:bg-tabTrBgHovD";
  // }  hover:bg-tabTrBgHov dark:odd:bg-tabTrBgD dark:even:bg-tabTrBgEveD dark:hover:bg-tabTrBgHovD`}

  // className =
  //   "odd:bg-tabTrBg even:bg-tabTrBgEve hover:bg-tabTrBgHov dark:odd:bg-tabTrBgD dark:even:bg-tabTrBgEveD dark:hover:bg-tabTrBgHovD";
  //-----------------------------------------------------------------------------------------

  //== Підготовка робочої структури workData */   //https://habr.com/ru/companies/otus/articles/696610/
  const preparedData = useMemo(() => {
    // console.log("FRtable.js/preparedData= useMemo")
    // console.log("FRtable.js/preparedData/initialData=/", initialData)
    // const start = Date.now(); //Час початку
    const temp = initialData.map((data, idx) => {
      let tempData = { ...data } // Copy object()
      tempData._nrow = idx // Set new field/Встановити нове поле
      // if (typeof p_selected !== "undefined") tempData._selected = false; // Set new field
      tempData._selected = false // Set new field/Встановити нове поле
      return tempData //Новий масис з добавленмим полями tempData._nrow/tempData._selected
    })
    // const millis = Date.now() - start; //Час виконання
    // console.log("FRtable.js/preparedData/Час виконання : ", millis + "ms");
    setWorkData(temp)
    // return temp
  }, [initialData]) //Змінюється тільки при зміні 2-го аргумента

  //==  Робоча таблиця*/
  //   const [workData, setWorkData] = useState(preparedData) //РОбоча таьлиця

  //--------------------------------------------------------------------

  //== Підготовка масиву фільтрів по полях (filterData) */
  const preparedFilterData = useMemo(() => {
    // console.log("FRtable.js/preparedFilterData = useMemo/")
    // console.log("FRtable.js/preparedFilterData = useMemo/")
    let resData = [] //масив об'єктів
    let nR = -1
    const temp = initialСolumns.map((data, idx) => {
      let tempData = {} // об’єкта
      if (data.filtered != undefined && data.filtered) {
        nR = nR + 1
        tempData._nrow = nR
        tempData.name = data.label
        tempData.accessor = data.accessor
        if (data.type != undefined) tempData.type = data.type
        else tempData.type = "string"
        tempData.comparisonFirst = ""
        tempData.filterFirst = ""
        tempData.logical = ""
        tempData.comparisonTwo = ""
        tempData.filterTwo = ""
        resData.push(tempData) //Додаємо в масив
      }
    })
    setFilterData(resData)
    // return resData
  }, [initialСolumns]) //Змінюється тільки при зміні 2-го аргумента

  //--- Формування масиву рядків текучої сторінки: slice, range: к-сть сторінок у всій БД
  //--- workData-БД, page-№ текучої сторінки, rowsPerPage-к-сть рядків на сторінці
  const { slice, range } = TablePageRows(workData, page, rowsPerPage) //Формування сторінок

  //==*п Сортування */
  const handleSorting = (sortField, sortOrder) => {
    // console.log("FRtable./js/handleSorting/")
    //--- Для встановлення початкового сортування
    if (sortOrder === "default") {
      sortOrder = "asc"
      sortField = "_nrow"
    }
    //--- Саме сортування
    if (sortField) {
      const sorted = [...workData].sort((a, b) => {
        if (a[sortField] === null) return 1
        if (b[sortField] === null) return -1
        if (a[sortField] === null && b[sortField] === null) return 0
        return (
          a[sortField].toString().localeCompare(b[sortField].toString(), "en", {
            numeric: true,
          }) * (sortOrder === "asc" ? 1 : -1)
        )
      })
      setWorkData(sorted)
    }
  }

  //--- Задає режим сортування
  const handleSortingChange = (accessor) => {
    // console.log("FRtable.js/handleSortingChange/")
    // console.log("RTable.js/handleSortingChange/accessor=", accessor)
    const sortOrder =
      //   accessor === sortField && order === "asc" ? "desc" : "asc";
      accessor === sortField && order === "asc" ? "desc" : order === "desc" ? "default" : "asc"
    setSortField(accessor)
    setOrder(sortOrder)
    // console.log("RTable.js/handleSortingChange/sortOrder=", sortOrder);
    handleSorting(accessor, sortOrder)
  }
  //==*к Сортування */

  //== Пошук(search)/фільтер-по всіх полях зразу */
  const seachAllFilds = (e) => {
    // console.log("FRtable.js/seachAllFilds/")
    const searchValue = e.target.value
    if (lengthSearhValue === 0) {
      setBeforSeachData(workData)
    }
    const rows = beforSeachData

    // console.log("seachAllFilds/searchValue=", searchValue + "/ rows", rows);
    if (rows.length > 0) {
      const attributes = Object.keys(rows[0]) //Це рядок заголовку

      const nowData = []
      //-- Цикл по рядках
      for (const current of rows) {
        //Цикл по колонках
        for (const attribute of attributes) {
          //Відсіюємо поля по яких не робиться пошук
          if (attribute === "id" || attribute === "_nrow" || attribute === "_selected") {
            continue //пропустити поле
          }
          //   const value = current[attribute];
          const value = String(current[attribute]).toLowerCase() //переводимо значення поля у нижній регістр
          //порівнюємо значення поля із пошуком, переводеним у нижній регістр
          if (value.includes(searchValue.toLowerCase())) {
            nowData.push(current)
            break //вихід з внутрішнього циклу
          }
        }
      }
      setLengthSearhValue(searchValue.length)
      setWorkData(nowData)
      setSumRow({}) //очистка нихнього рядка
    }
  }

  //== Вибір/Selected / Записуємо селект(true/false) в _selected роточого масиву(workData) */
  const selectRows = (e) => {
    // if (selectedRows.length > 0) return //Якщо виділена хоч одна запис
    // if (e.altKey && e.shiftKey&&e.ctrlKey) {
    // if (e.ctrlKey) {
    //   alert("RTable/selectRows/ctrlKey")
    // }
    // console.log("FRtable.js/selectRows/")
    const nRow = Number(e.target.id) //id-Це DOM(<td id="1"> Я йому присвоюю значення БД=_nrow)
    //--- Формуємо масив з індексами відмічених записів (setSelectedRow) --------------------
    let copyArray = ([] = [...selectedRows]) //Копія робочого масиву обєктів

    // //Скидаємо виділення з усіх, якщо було загальне виділення
    if (selectedAllRows) {
      onSelectAll()
      copyArray = [] //скидаємо масив
    }

    //шукаємо в масиві
    const selectIndex = copyArray.findIndex((item) => item === nRow) //індекс нашого масиву це id HTML DOM елемента (в нашому випадку:id={_nrow})
    // console.log("RTable.js.js/selectRows/selectedRows.length=", selectedRows.length)
    // console.log("RTable.js.js/selectRows/selectedRows=", selectedRows)
    // console.log("RTable.js.js/selectRows/selectIndex=", selectIndex);
    if (selectIndex === -1) {
      //Якщо виділена хоч одна запис
      //   if (selectedRows.length > 0 && !e.ctrlKey) return //Якщо виділена хоч одна запис
      copyArray.push(nRow) //якщо нема то додаємо в масив
      //   console.log("RTable.js.js/addSelecrToRbTable/nRow=", nRow);
    } else copyArray.splice(selectIndex, 1) //Якщо вже є в масиві то видаляємо(знімаємо виділення)
    // console.log("RTable.js/selectRows/copyArray=", copyArray)

    //Обновляємо масив
    setSelectedRows(copyArray) //Запмс в масив

    //--- Запишемо селект(true/false) в _selected роточого масиву(workData) --------
    let tWorkData = [...workData] //Копія робочого масиву обєктів

    //https://www.geeksforgeeks.org/how-to-modify-an-objects-property-in-an-array-of-objects-in-javascript/
    const targetObj = tWorkData.find((obj) => obj._nrow === nRow) //Шукажмо запис по _nrow=nRow
    // console.log("RTable.js.js/selectRows/targetObj=", targetObj);
    if (targetObj) {
      const newSelect = !targetObj._selected
      targetObj._selected = newSelect
      setWorkData(tWorkData)
    }
  }

  //--- Вибір/Selected (всі)
  const onSelectAll = () => {
    // console.log("FRtable.js/onSelectAll/")
    let tWorkData = [...workData] //Копія робочого масиву обєктів
    let tSelectedData = []
    const temp = tWorkData.map((data, idx) => {
      if (selectedAllRows) data._selected = false
      else data._selected = true
      setWorkData(tWorkData)
      //   console.log("FRtable.js/onSelectAll/tSelectedData=", tSelectedData)
      if (!selectedAllRows) tSelectedData.push(data._nrow) //Додаємо в масив
    })
    //
    setSelectedAllRows(!selectedAllRows)
    // console.log("FRtable.js/onSelectAll/tSelectedData=", tSelectedData)
    setSelectedRows(tSelectedData)
  }

  //== Фільтр множинний */
  //--- Формує (true/false) для стилю шоб показувати іконку фільтру біля назви в шапці, якщо є заданий фільтр по цьому полю
  const clasThFilter = useCallback(
    (accessor) => {
      //   console.log("FRtable.js/clasThFilterl/")
      const targetObj = filterData.find((obj) => obj.accessor === accessor) //Шукажмо запис
      // console.log("RTable.js.js/applyFilters/targetObj ==", targetObj)
      if (targetObj && targetObj.filterFirst.length > 0) {
        return true
      } else return false
    },
    [filterData]
  )

  //---*** Сам фільтр/Apply/Застосувати //Визначає масив даних, які відповідають фільтрам по всіх полях (filterData)
  const applyFilters = () => {
    // console.log("FRtable.js/applyFilters/")
    setIsDropdownFilter(false) //Закриваєм випадаюче вікно фільтрів
    if (filteredState === 0) return
    //--- Додаткові ф-ції
    //Як реалізувати оператор змінної в JavaScript? // https://stackoverflow.com/questions/66267093/how-to-implement-a-variable-operator-in-javascript
    //--- Об'єкт(набір змінних), що імітує оператори
    const operators = {
      ">": (a, b) => a > b,
      ">=": (a, b) => a >= b,
      "<": (a, b) => a < b,
      "<=": (a, b) => a <= b,
      "==": (a, b) => a == b,
      "!=": (a, b) => a != b,
    }
    //--- Ф-ція порівняння 2-х змінних з операторм,який є в змінній
    function doCompare(x, y, op) {
      const check = operators[op] ?? (() => false)
      if (check(x, y)) {
        return true
      } else {
        return false
      }
    }
    //*-- Ф-ція перетворення типів у відповідності до заданих типиві таблиці і у нижній регістр
    const valToType = (value, type = "string") => {
      // console.log("RTable.js.js/applyFilters/value=", value + "/type=", type)
      if (type === "number") return parseFloat(value)
      if (type === "date") return Date.parse(value)
      return String(value).toLowerCase() //переводимо значення поля у нижній регістр
    }

    //--- Початок фільтруівання
    // console.log("RTable.js.js/applyFilters/filterData=", filterData);
    // console.log("RTable.js.js/applyFilters/filteredState=", filteredState)
    let tempWorkData = []
    if (filteredState === 2) {
      tempWorkData = [...beforFilterData] //Повертаємо початкове значення workData
    } else {
      setBeforFilterData(workData) //Для відкату(Початкове значення фільтру)
      tempWorkData = [...workData] //Перший раз починаємо фільтрування з workData}
    }
    // console.log("RTable.js.js/applyFilterstempWorkData=", tempWorkData)

    const nowData = []
    //*** Цикл по рядках
    // const attributes = Object.keys(tempWorkData[0]); //Це рядок заголовку(масив)
    // console.log("RTable.js.js/ApplyFilters/attributes=", attributes);
    // console.log("RTable.js.js/ApplyFilters/for2/filterData=", filterData)
    for (const current of tempWorkData) {
      // console.log("RTable.js.js/ApplyFilters/for1/currentRow=", current)
      //++++ Принцип виходу з атрибуту(for2) при невідповідностях
      //Цикл по колонках \\ Щоб не бігти по масиву ро
      let rowFilterted = false
      for (const column of filterData) {
        const attribute = column.accessor
        // console.log("RTable.js.js/ApplyFilters/for2/rowColumn=", column)
        // console.log("RTable.js.js/ApplyFilters/for2/attribute=", attribute)
        // Чи є не пустий фільтр по цьоиу полю в масиві фільтрів
        const targetObj = filterData.find((obj) => obj.accessor === attribute)
        //===============================
        if (targetObj.filterFirst.length > 0) {
          //   console.log("RTable.js.js/ApplyFilters/for2/attribute=", attribute);
          const filterRow = `${targetObj.comparisonFirst}/${targetObj.filterFirst}/${targetObj.logical}/${targetObj.comparisonTwo}/${targetObj.filterTwo}`
          //   console.log("RTable.js.js/ApplyFilters/for2/targetObj: ", targetObj);
          //   console.log("RTable.js.js/ApplyFilters/for2/filterRow: ", filterRow);

          //--- Задаєм змінну типу поля //Тип змінної, якщо не заданий то "string"
          const valueType = targetObj.type === undefined ? "string" : targetObj.type //Ф-ція що задає типи
          //--- Перетворюємо у робочі змінні у вказаний тип і у нижній регістр
          const valueData = valToType(current[attribute], valueType) //Значення поля робочої БД
          const filterFirst = valToType(targetObj.filterFirst, valueType) //Значення фільтру1
          //   console.log("RTable.js.js/ApplyFilters/typeof /valueData=", valueData + "/", typeof valueData)
          //   console.log("RTable.js.js/ApplyFilters/filterFirst=", filterFirst + "/", typeof filterFirst)

          //https://stackoverflow.com/questions/66267093/how-to-implement-a-variable-operator-in-javascript
          //doCompare-ф-ція що повертає результат порівняння 2-х змінних де третя є самим оператор порівняння("><=...")
          //filterFirst

          let compareFirst = false
          if (valueType === "number" || valueType === "date") {
            compareFirst = doCompare(valueData, filterFirst, targetObj.comparisonFirst) //   doStuff(4, 2, ">")=true
          } else compareFirst = valueData.includes(filterFirst.toLowerCase()) //Порівняння (чивходить)
          //
          //   if (compareFirst) {
          //     rowFilterted = true
          //     // console.log("RTable.js/applyFilters/iFcompareFirst/current._nRow:", current._nrow)
          //   }

          //--- Якщо є filterTwo.length
          if (targetObj.filterTwo.length > 0) {
            // console.log("RTable.js/applyFilters/iFfilterTwo/current._nRow:", current._nrow + "/valueData", valueData)
            //   console.log("RTable.js.js/applyFilters/Two/filterRow=", filterRow);
            const filterTwo = valToType(targetObj.filterTwo, valueType) //Значення фільтру1
            let compareTwo = false
            if (valueType === "number" || valueType === "date") {
              compareTwo = doCompare(valueData, filterTwo, targetObj.comparisonTwo)
            } else compareTwo = valueData.includes(filterTwo.toLowerCase())

            //1-a умова
            if (compareFirst && compareTwo) {
              rowFilterted = true
            } else {
              //2a
              if (compareFirst != compareTwo && targetObj.logical != "&&") {
                rowFilterted = true
              } else {
                // console.log("RTable.js/ApplyFilte/!(compareTwo)lseIfEls(compareFirst&&/_nRow:", current._nrow)
                rowFilterted = false //Якщо "&&"" то при First = true і Two = false- викидаємоні
                break //Бо filterFirct=true але при "&&" filterTwo=false, отже це поле випадає а значить і весь запис
              }
            }
          } else if (compareFirst) {
            // console.log("RTable.js/applyFilters/elseIf(ост)/current._nRow:", current._nrow)
            rowFilterted = true
          } else {
            rowFilterted = false
            break
          }
        }
        //-- fEndor2
        // console.log("RTable.js/ApplyFilters/Endfor2/_nRow: ", current._nrow + " /attribute:", attribute)
      }
      //--- Endfor1
      //   console.log("RTable.js.js/ApplyFilters/Endfor1*/_nRow: ", current._nrow);
      if (rowFilterted) {
        nowData.push(current) // Добавляємо текучий рядок в новий масив
        // console.log("RTable.js.js/ApplyFilters/Endfor1/if(rowFilterted)***/_nRow: ", current._nrow)
      }
    }
    // console.log("RTable.js.js/ApplyFilters/Endfor1/")
    setWorkData(nowData)
    setFilteredState(2) //Колір заповнення іконки фільтру
    setSumRow({}) //очистка нихнього рядка
  }

  //--- Очищаємо фільтр/Відкат даних до фільтру/Закриваємо випадаюче вікно
  const deleteFilterAll = () => {
    // console.log("RTable.js/deleteFilterAll/")
    let tempFilterData = [...filterData]
    const temp = tempFilterData.map((data) => {
      data.comparisonFirst = ""
      data.filterFirst = ""
      data.logical = ""
      data.comparisonTwo = ""
      data.filterTwo = ""
    })
    setFilterData(tempFilterData) //Перезаписуєм масив фільтрів
    // setWorkData(beforSeachData) //Відкат даних до фільтру
    setIsDropdownFilter(false) //Закриваємо випадаюче вікно
    if (filteredState === 2) setWorkData(beforFilterData) //Відновлюємо робочу БД до фільтрування
    setFilteredState(0) //Іконка
    setSumRow({}) //очистка нихнього рядка
  }

  //-- Підсумковий рядок /сум,середнє,max,min
  const applySum = () => {
    // console.log("FRtable.js/applySum/")
    let tRowSum = {} //об'єкт
    const temp1 = initialСolumns.map((item) => {
      //   let tempSumRow = { ...sumRow }
      // console.log("RTable.js/applySum/ workData.map/accessor=", item.accessor + "/знач:", trow[item.accessor])
      if (item.sum === "sum" || item.sum === "mean" || item.sum === "max" || item.sum === "min") {
        let tSum = Number(0)
        let kZap = 0
        const temp = workData.map((trow, idx) => {
          kZap += 1
          // console.log("RTable.js/applySum/ workData.map/accessor=", item.accessor + "/знач:", trow[item.accessor])
          if (item.sum === "max") {
            if (idx === 0) tSum = trow[item.accessor]
            tSum = Math.max(tSum, Number(trow[item.accessor]))
          } else if (item.sum === "min") {
            if (idx === 0) tSum = trow[item.accessor]
            tSum = Math.min(tSum, Number(trow[item.accessor]))
          } else {
            tSum += Number(trow[item.accessor])
          }
        })
        //середнє ариіметичне
        if (item.sum === "mean") {
          tSum = tSum / kZap
        }
        // console.log("RTable.js/applySum/accessor", item.accessor + "/tSum=", tSum)
        tRowSum[item.accessor] = tSum //Додавання нової властивості до оь'якту
      }
    })
    // console.log("RTable.js/applySum/tRowSum=", tRowSum)
    setSumRow(tRowSum)
  }

  //-- Вихід з форми
  const onCancel = () => {
    //якщо не довідник
    router.push("/") //перехід на сторінку
    // if (!isDovidnuk) router.push("/") //перехід на сторінку
    // // if (!isDovidnuk) router.back() //повернутись
    // else setDovActive("")
  }

  //=========================================================
  //--Export в EXELL(Роб)/sheetjs-style   //https://codesandbox.io/p/devbox/alkira-sfubt5?file=%2Fsrc%2Fcomponents%2Fexcelexport%2FExcelExport.tsx%3A2%2C1-3%2C37

  const exportToExcel = (filedata) => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    const ws = XLSX.utils.json_to_sheet(filedata)
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] }
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const data = new Blob([excelBuffer], { type: fileType })
    return data
  }

  //***  Імпорт з EXELL в PostgreSQL ******************************** */
  //--   Функція для перетворення даних файлу Excel у формат JSON
  const convertToJson = async (headers, data) => {
    // console.log("exell_eventfile_table.js/convertToJson/data=", data)
    const rows = []
    //forEach-цикл
    data.forEach(async (row) => {
      let rowData = {}
      row.forEach(async (element, index) => {
        rowData[headers[index]] = element
      })
      //   console.log("exell_eventfile_table.js/convertToJson/rowData=", rowData)
      rows.push(rowData)
    })

    //
    dataJson.current = rows //dataJson = useRef([])-бо useState не мінялось?
    // console.log("Rtable.js/convertToJson/dataJson.current=", dataJson.current)

    // setDataJson(rows) //збереження даних\не зберігає до renderingy
    // console.log("exell_eventfile_table.js/convertToJson/rows=", rows)
    return rows
  }
  //-- Зчитування і перетворення з EXELL в формат Json/dataJson
  const importExell = async (e) => {
    const file = e.target.files[0] //для читання файлу.
    const reader = new FileReader()
    //імпорт з EXELL в файл fileData
    reader.onload = async (event) => {
      const bstr = event.target.result
      const workBook = XLSX.read(bstr, { type: "binary" }) //читання файлу excel
      const workSheetNane = workBook.SheetNames[0] //читання назви аркуша.
      const workSheet = workBook.Sheets[workSheetNane]
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 }) //читання даних файлу.
      const headers = fileData[0] //читання першого рядка як заголовка
      //   const heads = headers.map((head) => ({ tittle: head, field: head }))
      fileData.splice(0, 1)

      //*** Перетворення в формат Json в dataJson
      const jData = await convertToJson(headers, fileData)
      //   console.log("RTable.js/handleImportExell/rr=", jData)

      //*** Загрузка даних в PjstgreSQL
      const insertZap = await insertDB(jData) //Загрузка даних в PjstgreSQL
      //   console.log("RTable.js/handleImportExell/insertZap=", insertZap)
    }
    reader.readAsBinaryString(file)
    // reader.readAsDataURL(file)
  }

  //--- Загрузка даних в DB PostgreSQL/ В циклі .map по 1-му запису
  const insertDB = async () => {
    // console.log("d_product.js/insertDB//dataJson.current=", dataJson.current)

    let insertZap = 0
    try {
      //Цикл по rowData(запис в БД (doc_check_products)
      const addToDB = await dataJson.current.map((row, index) => {
        // console.log("RTab.js/insertDB/row=", row)
        //
        rowAdd(row) //Запис в БД(select)
        //
        insertZap = insertZap + 1
      })
    } finally {
      //   console.log("d_product.js/insertDB/finally/insertRows.current=", insertRows.current)
      await alert(`finally:Добавленo ${insertZap}`)
      //   insertRows.current=0
    }
    return insertZap
  }

  //--- Добавалення(create) запису(запит)
  const rowAdd = async (tRow) => {
    // console.log("/RTable/rowAdd/tRow=", tRow)
    const url = "/api/shop/references/d_product" //працює
    const options = {
      method: "POST",
      body: JSON.stringify(tRow), //Для запитів до серверів використовувати формат JSON
      headers: {
        "Content-Type": "application/json", //Вказує на тип контенту
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      // якщо HTTP-статус в диапазоне 200-299
      const resRow = await response.json() //повертає тіло відповіді json
      //   console.log(`Запис успішно добавленo`)
      //   console.log("Product.js/rowAdd/try/esponse.ok/resRow=", resRow)
      //   alert(`Запис успішно добавленo`)
      return resRow
    } else {
      const err = await response.json() //повертає тіло відповіді json
      //   alert(`Запис не добавлено! ${err.message} / ${err.stack}`)
      //   console.log(`Product.js/rowAdd/try/else/\ Помилка при добавленні запису\ ${err.message} / ${err.stack} `)
    }
  }
  //--------------------------------------------------

  //-- Дії типу/Export/Import/Друк,,,,
  const fAction = (e, action) => {
    // console.log("RTable.js/fAction/e=", e)
    switch (action) {
      case "toExell":
        saveAs(exportToExcel(workData), "workData" + ".xlsx")
        break
      case "importExel":
        // console.log("RTable.js/fAction/importExel/e=", e)
        importExell(e)
        break
      default:
        break
    }
  }
  //--------------------------------------------------------
  const onDelete = () => {
    // console.log("RTable.js/onDelete/e=")
    let selRows = []
    const temp = workData.map((item) => {
      if (item._selected) {
        // selRow["id"] = item.id
        // selRow["_nRow"] = item._nrow
        selRows.push(item.id) //Додаємо в масив
      }
    })
    // console.log("FRtable.js/onDelete/selRows=", selRows)
    // fDelete(selRows)//ф-ція
    setDeleteData(selRows) //дані вилучення
    setIsFormDelete(true)
  } 
  //--------------------------------------------------------
  const onEdit = () => {
    const temp = workData.map((item) => {
      if (item._selected) {
        // console.log("RTable.js/onEdit/item._selected=", item)
        setEditData(item) //дані для зміни форми
      }
    })
    setIsFormAdd(true)
    setIsFormEdit(true)
  }
  //--------------------------------------------------------
  const onAdd = () => {
    setIsFormAdd(true)
    setIsFormEdit(false)
    setEditData({})
  }
  //--------------------------------------------------------

  //-- Права частина голови таблиці (кнопки дій/+,del,edit,exit,,,)
  const HeadRight = () => {
    return (
      <>
        {/* Додат */}
        {selectedRows.length === 0 && (
          <button
            // className="flex h-5 w-5 items-center justify-center rounded-full align-middle    transition-colors hover:bg-hBgHov dark:hover:bg-hBgHovD"
            className="mx-1 h-7 w-7 relative  flex justify-center items-center dark:text-hTextD rounded-3xl align-middle border border-tabThBorder dark:border-tabThBorderD font-bold  text-hText   hover:bg-hBgHov dark:hover:bg-hBgHovD"
            // onClick={() => exportToExcel()}
            // onClick={() => setIsFormAdd(true)}
            onClick={onAdd}
            title="Додати"
          >
            {/* Додати */}
            <svg
              className="h-5 w-5 text-iconT dark:text-iconTD"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" /> <line x1="12" y1="5" x2="12" y2="19" />{" "}
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        )}

        {/* Якщо вибрано тільки один запис */}
        {selectedRows.length === 1 && (
          <button
            // className="flex h-5 w-5 items-center justify-center rounded-full align-middle    transition-colors hover:bg-hBgHov dark:hover:bg-hBgHovD"
            className="mx-1 h-7 w-7 relative  flex justify-center items-center dark:text-hTextD rounded-3xl align-middle border border-tabThBorder dark:border-tabThBorderD font-bold  text-hText   hover:bg-hBgHov dark:hover:bg-hBgHovD"
            // onClick={() => setIsFormAdd(true)}
            onClick={() => onEdit()}
            title="Редагувати"
          >
            {/* Редагувати */}
            <svg
              className="h-5 w-5 text-iconT dark:text-iconTD"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />{" "}
              <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" /> <line x1="16" y1="5" x2="19" y2="8" />
            </svg>
          </button>
        )}

        {/* Якщо вибрано хоч один запис */}
        {selectedRows.length > 0 && (
          <button
            // className="flex h-5 w-5 items-center justify-center rounded-full align-middle    transition-colors hover:bg-hBgHov dark:hover:bg-hBgHovD"
            className="mx-1 h-7 w-7 relative  flex justify-center items-center dark:text-hTextD rounded-3xl align-middle border border-tabThBorder dark:border-tabThBorderD font-bold  text-hText   hover:bg-hBgHov dark:hover:bg-hBgHovD"
            onClick={() => onDelete()}
            title="Видалити"
          >
            {/* Видалити */}
            <svg
              className="h-5 w-5 text-iconT dark:text-iconTD"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" /> <line x1="4" y1="7" x2="20" y2="7" />{" "}
              <line x1="10" y1="11" x2="10" y2="17" /> <line x1="14" y1="11" x2="14" y2="17" />{" "}
              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />{" "}
              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
            </svg>
          </button>
        )}

        {/* налаштування(шестерня) */}
        {/* <button
           className="mx-1 h-7 w-7 relative  flex justify-center items-center dark:text-hTextD rounded-3xl align-middle border border-tabThBorder dark:border-tabThBorderD font-bold  text-hText   hover:bg-hBgHov dark:hover:bg-hBgHovD"
          onClick={() => setIsMenuSetingDrop(!isMenuSetingDrop)}
          title="Вийти"
        >
          <svg
            className="h-5 w-5 text-iconT dark:text-iconTD"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />{" "}
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button> */}

        {/* мобільного меню */}
        <button
          className="mx-1 h-7 w-7 relative  flex justify-center items-center dark:text-hTextD rounded-3xl align-middle border border-tabThBorder dark:border-tabThBorderD font-bold  text-hText   hover:bg-hBgHov dark:hover:bg-hBgHovD"
          onClick={() => setIsTableMenuDroop(!isTableMenuDroop)}
          title="меню"
        >
          <svg
            className="h-5 w-5 text-iconT dark:text-iconTD"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <line x1="8" y1="6" x2="21" y2="6" /> <line x1="8" y1="12" x2="21" y2="12" />{" "}
            <line x1="8" y1="18" x2="21" y2="18" /> <line x1="3" y1="6" x2="3.01" y2="6" />{" "}
            <line x1="3" y1="12" x2="3.01" y2="12" /> <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </button>

        {/*відмова(помножити)  */}
        <button
          className="mx-1 h-7 w-7 relative  flex justify-center items-center dark:text-hTextD rounded-3xl align-middle border border-tabThBorder dark:border-tabThBorderD font-bold  text-hText   hover:bg-hBgHov dark:hover:bg-hBgHovD"
          onClick={onCancel}
          title="Вийти"
        >
          <svg
            className="h-5 w-5 text-iconT dark:text-iconTD"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <line x1="18" y1="6" x2="6" y2="18" /> <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </>
    )
  }

  //-------------------------------------------------
  return (
    //align-middle-текст по вертикалі посередині
    <div className={`${styleTableText} px-0 align-middle bg-bodyBg dark:bg-bodyBgD`}>
      {typeof p_title !== "undefined" && p_title.length > 0 && (
        <div className="flex justify-center text-center items-center rounded-3xl align-middle border border-tabThBorder dark:border-tabThBorderD font-bold bg-hBg text-hText  dark:bg-hBgD">
          {/* title */}
          <h1 className={`${styleTitleText}  text-center  `}>{p_title}</h1>
        </div>
      )}

      {/* Надбудова таблиці з елементами управління (пошук+...) */}
      {/* <div className="mb flex border-3 border-green-300 p-1 dark:bg-gray-900"> */}
      <div className="my-1 flex flex-wrap items-center justify-between">
        {/* left*/}
        {/* Блок:селект/фільтер/шрифт */}
        <div className="flex flex-wrap items-center justify-start">
          {/*Інформація про вибрані рядки  */}
          {/* {typeof p_selected !== "undefined" && p_selected && ( */}
          {typeof pSeting.pSelected !== "undefined" && pSeting.pSelected && (
            <button
              className="ml-1 flex items-center rounded-lg border border-tabThBorder dark:border-tabThBorderD bg-tabTrBg text-tabTrText dark:text-tabTrTextD p-1 dark:bg-tabTrBgD"
              onClick={onSelectAll}
              title="Вибрати всі"
            >
              {/* галочка */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-5 w-5 text-iconT dark:text-iconTD"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>

              <p title="Відмічено">: {selectedAllRows ? workData.length : selectedRows.length}</p>
            </button>
          )}

          {/* Вибір шрифта */}
          {typeof pSeting.pFonts !== "undefined" && pSeting.pFonts && (
            <div className="ml-1 md:flex items-center rounded-lg border hidden  border-tabThBorder dark:border-tabThBorderD bg-tabTrBg text-tabTrText dark:text-tabTrTextD p-1 dark:bg-tabTrBgD">
              {/* іконка T */}
              <svg
                className="h-5 w-5 text-iconT dark:text-iconTD"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <polyline points="4 7 4 4 20 4 20 7" /> <line x1="9" y1="20" x2="15" y2="20" />{" "}
                <line x1="12" y1="4" x2="12" y2="20" />
                <title>Шрифти</title>
              </svg>
              <p>:</p>
              <select
                className="mx-1 block w-full  items-center border-tabThBorder bg-tabTrBg align-middle  text-gray-900 hover:cursor-pointer focus:border-blue-500 focus:ring-blue-500 dark:border-tabThBorderD dark:bg-tabTrBgD dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                defaultValue={tableFontSize}
                onChange={(e) => setTableFontSize(e.target.value)}
                title="Величина шрифту"
              >
                <option value={tableFontSize} disabled>
                  {tableFontSize}
                </option>
                <option value="xs">xs</option>
                <option value="sm">sm</option>
                <option value="base">base</option>
                <option value="lg">lg</option>
                {/* <option value="xs">дрібний</option>
              <option value="sm">середній</option>
              <option value="base">базовий</option>
              <option value="lg">великий</option> */}
              </select>
            </div>
          )}

          {/* Фільтр: Інфа відфільтровані/ вся БД  */}
          {typeof pSeting.pFiltered !== "undefined" && pSeting.pFiltered && (
            <>
              <button
                //   className="ml-1 flex items-center rounded-lg border border-gray-300 bg-gray-50 p-1 dark:bg-gray-700"
                className="ml-1 flex items-center rounded-lg border border-tabThBorder dark:border-tabThBorderD bg-tabTrBg text-tabTrText dark:text-tabTrTextD p-1 dark:bg-tabTrBgD"
                onClick={() => setIsDropdownFilter(!isDropdownFilter)}
              >
                {/* Лійка */}
                <svg
                  className="h-5 w-5 text-iconT dark:text-iconTD"
                  viewBox="0 0 24 24"
                  fill={filteredState === 2 ? "currentColor" : filteredState === 1 ? "green" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  <title>Фільтр</title>
                </svg>

                <p title="Відфільтровано">: {workData.length}</p>
                <p title="Вся БД">/ {initialData.length}</p>
              </button>

              {/* Dropdown menu */}
              {/* {isDropdownFilter && (
                <DropdownFilter
                  filterData={filterData} //Дані фільтру(тільки ті поля по яких задано )
                  setFilterData={setFilterData}
                  setIsDropdownFilter={setIsDropdownFilter}
                  styleTableText={styleTableText}
                  applyFilters={applyFilters} //Застосувати фільтр
                  deleteFilterAll={deleteFilterAll}
                  filteredState={filteredState} //Що у фільтрі є непусті записи
                  setFilteredState={setFilteredState} //Що у фільтрі є непусті записи
                />
              )} */}
            </>
          )}
          {/* Іконка рядка сум(налаштовуєься) */}
          {/* {typeof (pSumRow !== "undefined") && pSumRow && ( */}
          {typeof pSeting.pSumRow !== "undefined" && pSeting.pSumRow && (
            <div>
              <button
                className="ml-1 flex items-center rounded-lg border border-tabThBorder dark:border-tabThBorderD bg-tabTrBg text-tabTrText dark:text-tabTrTextD p-1 dark:bg-tabTrBgD"
                onClick={applySum}
                //   onClick={onSumRow}
                title="Рядок сум"
              >
                {/* suma */}
                <svg
                  className="h-5 w-5 text-iconT dark:text-iconTD"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {" "}
                  <path stroke="none" d="M0 0h24v24H0z" />{" "}
                  <path d="M18 16v2a1 1 0 0 1 -1 1h-11l6-7l-6-7h11a1 1 0 0 1 1 1v2" />
                  <title>Рядок сум</title>
                </svg>
              </button>
            </div>
          )}
        </div>
        <div className=" md:hidden flex justify-end ">
          <HeadRight />
        </div>

        {/*  */}

        {/*Пошук швидкий/фільтр (рядок пощуку по всіх полях) */}
        {typeof pSeting.pSearchAllRows !== "undefined" && pSeting.pSearchAllRows && (
          <div className="relative ml-1 w-full items-center md:w-80">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center  pl-3">
              {/* Лупа */}
              <svg
                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                // className="h-5 w-5 text-gray-500 dark:text-red-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              size="lg"
              placeholder="Пошук..."
              onChange={(e) => seachAllFilds(e)}
              type="text"
              className="block w-full items-center rounded-lg border border-tabThBorder bg-tabTrBg p-1 pl-10 text-tabTrText dark:border-tabThBorderD dark:bg-tabTrBgD dark:text-tabTrTextD"
            />
          </div>
        )}
        {/* right */}
        <div className=" hidden md:flex justify-end ">
          <HeadRight />
        </div>
      </div>
      {/* Dropdown menu */}
      {isDropdownFilter && (
        <DropdownFilter
          filterData={filterData} //Дані фільтру(тільки ті поля по яких задано )
          setFilterData={setFilterData}
          setIsDropdownFilter={setIsDropdownFilter}
          styleTableText={styleTableText}
          applyFilters={applyFilters} //Застосувати фільтр
          deleteFilterAll={deleteFilterAll}
          filteredState={filteredState} //Що у фільтрі є непусті записи
          setFilteredState={setFilteredState} //Що у фільтрі є непусті записи
        />
      )}
      {/* Dropdown <TableMenuDroop */}
      {isTableMenuDroop && (
        <TableMenuDroop
          setIsTableMenuDroop={setIsTableMenuDroop}
          fAction={fAction}
          setPSeting={setPSeting}
          pSeting={pSeting}
          tableFontSize={tableFontSize}
          setTableFontSize={setTableFontSize}
        />
      )}
      {/* Dropdown MenuSetingDrop
      {isMenuSetingDrop && (
        <MenuSetingDrop setIsMenuSetingDrop={setIsMenuSetingDrop} setPSeting={setPSeting} pSeting={pSeting} />
      )} */}

      {/* Обгортка(Wraper)таблиці (для проокрутки і...)   border-3 border-green-300 */}
      <div
        className=" max-h-[--sH] w-full overflow-auto border border-tabThBorder dark:border-tabThBorderD"
        style={{ "--sH": "calc(100vh - 200px)" }} //Створення style для h-
      >
        {/*border-collapse- обєднання границь ячейок "> */}
        <table id="example" className=" w-full table-auto">
          <thead
            className={`${styleTableText} sticky top-0  border-b border-tabThBorder bg-tabThBg text-tabThText dark:border-tabThBorderD dark:bg-tabThBgD dark:text-tabThTextD`}
          >
            <tr>
              {/*
              label - назва поля в шапці
              accessor-справжня назва поля */}

              {initialСolumns.map(({ label, accessor, sortable, filtered }) => {
                //  Створення className для сортування(bg-color+bg-url)
                const clasSort = sortable
                  ? sortField === accessor && order === "asc"
                    ? "up"
                    : sortField === accessor && order === "desc"
                    ? "down"
                    : "default"
                  : ""

                //  Створення className для фільтрування(іконка біля назви в шапці)
                const clasFilter = clasThFilter(accessor)

                return (
                  <th
                    //whitespace-nowrap-щоб текст у комірці таблиці не переносився
                    className={`${styleTableText} border-r dark:border-tabThBorderD border-tabThBorder whitespace-nowrap`}
                    key={accessor}
                  >
                    {/* // uppercase- текст у верхній регістр */}
                    <div className="flex justify-center text-center align-middle uppercase ">
                      <div className="flex uppercase ">
                        <button className="flex" onClick={sortable ? () => handleSortingChange(accessor) : null}>
                          <p className="px-1"> {label}</p>
                          {clasSort === "up" ? (
                            <span> &#8593;</span>
                          ) : clasSort === "down" ? (
                            <span> &#8595;</span>
                          ) : (
                            clasSort === "default" && ""
                          )}
                        </button>
                      </div>

                      {/* filter */}
                      {typeof filtered !== "undefined" && filtered && (
                        <div className="flex text-center align-middle">
                          {clasFilter && (
                            <svg
                              //   className="h-5 w-5 "
                              className="h-5 w-5 text-iconInfo dark:text-iconInfoD"
                              viewBox="0 0 24 24"
                              fill="none"
                              // fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>

          {/* рядки */}
          <tbody>
            {/* перебір рядків */}
            {/* slice-це кусок вибраного для рендерінгу масиву (сторінка/відфільтроване і...) */}
            {/* {slice.map((row, rowIndex) => ( */}
            {slice.map((row) => (
              <tr
                id={row._nrow} //_nrow- нумерація рядків/додано програмно
                key={row._nrow}
                className={`${
                  row._selected
                    ? "bg-tabTrBgSel hover:bg-tabTrBgSelHov dark:bg-tabTrBgSelD dark:hover:bg-tabTrBgSelHovD"
                    : "odd:bg-tabTrBg even:bg-tabTrBgEve hover:bg-tabTrBgHov dark:odd:bg-tabTrBgD dark:even:bg-tabTrBgEveD dark:hover:bg-tabTrBgHovD"
                }`}
                onClick={(e) => selectRows(e)}
              >
                {/* перебір полів */}
                {initialСolumns.map(({ accessor, type = "", align = "" }) => {
                  //   const tData = accessor === "index" ? rowIndex : row[accessor]
                  const tImg = (
                    <div
                      id={row._nrow}
                      className="flex justify-center"
                      //   className={`${styleTableImg} flex justify-cente border border-3`}
                    >
                      {/* Щоб використовувати Image з зовнішніми url Потрібно налаштовувати next.config на кожний сайт з якого тягнуться картинки */}
                      {/* <Image
                        id={row._nrow}
                        alt="image"
                        // fill
                        width={16} //Не міняється при зміні шрифтів(від 12-18px)
                        height={16} //Не міняється при зміні шрифтів(від 12-18px)
                        src={row[accessor]}
                        // style={{
                        //   objectFit: "cover",
                        // }}
                      /> */}
                      <img id={row._nrow} className={`${styleTableImg}`} src={row[accessor]} alt="Jese image" />
                    </div>
                  )
                  const tData =
                    //   type === "boolean" && row[accessor] === "true"
                    type === "boolean" && row[accessor] ? (
                      // ? "+"
                      <div id={row._nrow} className="flex justify-center">
                        <svg
                          id={row._nrow}
                          className="h-4 w-4 text-red-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {" "}
                          <polyline points="9 11 12 14 22 4" />{" "}
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                      </div>
                    ) : type === "boolean" && !row[accessor] ? (
                      <div id={row._nrow} className="flex justify-center">
                        <svg
                          id={row._nrow}
                          //   className ="h-4 w-4 text-red-500"
                          className={`${styleTableImg}  text-iconT dark:text-iconTD`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {" "}
                          {/* <polyline points="9 11 12 14 22 4" />{" "} */}
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                      </div>
                    ) : type === "img" ? (
                      tImg
                    ) : (
                      // ) : type === "date" && row[accessor] != null && row[accessor] != undefined ? (
                      //     // row[accessor].substring(0, 10)
                      //     row[accessor]
                      row[accessor]
                    )
                  const clasTextAlign =
                    align == "right"
                      ? "text-right"
                      : align == "center"
                      ? "text-center"
                      : align == "left"
                      ? "text-left"
                      : type == "number"
                      ? "text-right"
                      : type == "date" || type == "boolean" || type == "img"
                      ? "text-center"
                      : "text-left"

                  return (
                    <td
                      id={row._nrow}
                      key={accessor}
                      //whitespace-nowrap-щоб текст у комірці таблиці не переносився
                      className={`${styleTableText} ${clasTextAlign} text-tabTrText dark:text-tabTrTextD  whitespace-nowrap`}
                    >
                      {tData}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>

          {/* Нижній рядок сум */}
          {typeof pSeting.pSumRow !== "undefined" && pSeting.pSumRow && (
            <tfoot
              className={`${styleTableText} sticky bottom-0 border-t border-tabThBorder bg-tabThBg text-tabThText dark:border-tabThBorderD dark:bg-tabThBgD dark:text-tabThTextD`}
            >
              <tr>
                {/* <th colSpan="8" className="text-center">
                Всього
              </th> */}
                {initialСolumns.map(({ accessor, _nrow, sum, align, type, index }) => {
                  const clasFlexJustify =
                    align == "right"
                      ? "justify-end "
                      : align == "center"
                      ? "justify-center"
                      : align == "left"
                      ? "justify-start"
                      : type == "number"
                      ? "justify-end "
                      : type == "date"
                      ? "justify-center"
                      : "justify-start"
                  const tIcon =
                    sum === "sum" ? (
                      // suma
                      <svg
                        className="h-5 w-5 text-iconInfo dark:text-iconInfoD"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {" "}
                        <path stroke="none" d="M0 0h24v24H0z" />{" "}
                        <path d="M18 16v2a1 1 0 0 1 -1 1h-11l6-7l-6-7h11a1 1 0 0 1 1 1v2" />
                        <title>suma</title>
                      </svg>
                    ) : sum === "min" ? (
                      <>
                        <svg
                          className="h-5 w-5 text-iconInfo dark:text-iconInfoD"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {" "}
                          <path stroke="none" d="M0 0h24v24H0z" /> <path d="M3 12h7l-3 -3m0 6l3 -3" />{" "}
                          <path d="M21 12h-7l3 -3m0 6l-3 -3" /> <path d="M9 6v-3h6v3" /> <path d="M9 18v3h6v-3" />
                          <title>min</title>
                        </svg>
                      </>
                    ) : sum === "max" ? (
                      <>
                        {/*>max  */}
                        <svg
                          className="h-5 w-5 text-iconInfo dark:text-iconInfoD"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {" "}
                          <path stroke="none" d="M0 0h24v24H0z" /> <path d="M10 12h-7l3 -3m0 6l-3 -3" />{" "}
                          <path d="M14 12h7l-3 -3m0 6l3 -3" /> <path d="M3 6v-3h18v3" /> <path d="M3 18v3h18v-3" />
                          <title>max</title>
                        </svg>
                      </>
                    ) : sum === "mean" ? (
                      <svg
                        className="h-5 w-5 text-iconInfo dark:text-iconInfoD"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {" "}
                        <path stroke="none" d="M0 0h24v24H0z" /> <circle cx="12" cy="12" r="9" />{" "}
                        <line x1="12" y1="3" x2="12" y2="7" /> <line x1="12" y1="21" x2="12" y2="18" />{" "}
                        <line x1="3" y1="12" x2="7" y2="12" /> <line x1="21" y1="12" x2="18" y2="12" />{" "}
                        <line x1="12" y1="12" x2="12" y2="12.01" />
                        <title>середнє</title>
                      </svg>
                    ) : (
                      ""
                    )
                  return (
                    <th
                      key={accessor}
                      className={`${styleTableText} border-r dark:border-tabThBorderD border-tabThBorder whitespace-nowrap`}
                    >
                      <div
                        id={_nrow}
                        key={accessor}
                        className={`${styleTableText} ${clasFlexJustify} flex items-center text-tabTrText dark:text-tabTrTextD  whitespace-nowrap text-left`}
                      >
                        <p className="flex align-bottom">{tIcon}</p>
                        <p>{sumRow[accessor]}</p>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {/* footer */}
      <TableFooter
        range={range}
        slice={slice}
        setPage={setPage}
        page={page}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        maxRow={workData.length}
      />
    </div>
  )
}
