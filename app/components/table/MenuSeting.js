import { useRef, useEffect } from "react"

export default function MenuSeting({ pSeting, setPSeting, tableFontSize, setTableFontSize }) {
  const onChange = () => {
    console.log("MenuSeting.js/onChange/")
    setPSeting({ ...pSeting, ["pSumRow"]: !pSeting.pSumRow })
  }

  return (
    <fieldset>
      <legend className="font-semibold">Опції інтерфейсу таблиці</legend>
      {/* Фонт/шрифт */}
      <div className="m-1 space-x-2 md:flex justify-start hidden items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD">
        <input
          className=""
          type="checkbox"
          id="selected"
          name="selectedselected1"
          onChange={() => setPSeting({ ...pSeting, ["pSelected"]: !pSeting.pSelected })}
          checked={pSeting.pSelected ? true : false}
        />
        <label htmlFor="selected">Вибрати всі</label>
      </div>
      {/* Фонт/шрифт */}
      <div className="m-1 space-x-2 md:flex justify-start hidden items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD">
        <input
          className=""
          type="checkbox"
          id="font"
          name="font1"
          onChange={() => setPSeting({ ...pSeting, ["pFonts"]: !pSeting.pFonts })}
          checked={pSeting.pFonts ? true : false}
        />
        <label htmlFor="font">Фонт/Шрифти</label>
      </div>

      {/* Фільтр */}
      <div className="m-1 space-x-2 flex justify-start  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD">
        <input
          className=""
          type="checkbox"
          id="filter"
          name="filter1"
          onChange={() => setPSeting({ ...pSeting, ["pFiltered"]: !pSeting.pFiltered })}
          checked={pSeting.pFiltered ? true : false}
        />
        <label htmlFor="filter">Фільтр</label>
      </div>

      {/* Підсукковий рядок */}
      <div className="m-1 space-x-2 flex justify-start  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD">
        <input
          className=""
          type="checkbox"
          id="nrow"
          name="nrow1"
          onChange={() => setPSeting({ ...pSeting, ["pSumRow"]: !pSeting.pSumRow })}
          checked={pSeting.pSumRow ? true : false}
        />
        <label htmlFor="nrow">Підсукковий рядок </label>
      </div>

      {/*Швидкий пошук */}
      <div className="m-1 space-x-2 flex justify-start  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD">
        <input
          className=""
          type="checkbox"
          id="search"
          name="search1"
          onChange={() => setPSeting({ ...pSeting, ["pSearchAllRows"]: !pSeting.pSearchAllRows })}
          checked={pSeting.pSearchAllRows ? true : false}
        />
        <label htmlFor="search">Швидкий пошук</label>
      </div>

      {/*Шрифти */}
      <div className="m-1 space-x-2 flex md:hidden justify-start  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD">
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
        <select
          className="mx-1 block items-center border-tabThBorder bg-tabTrBg align-middle  text-gray-900 hover:cursor-pointer focus:border-blue-500 focus:ring-blue-500 dark:border-tabThBorderD dark:bg-tabTrBgD dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          // defaultValue={tableFontSize}
          onChange={(e) => setTableFontSize(e.target.value)}
          //   id="page-size"
          title="Шрифти"
        >
          <option value={tableFontSize} disabled>
            {tableFontSize}
          </option>
          <option value="xs">xs</option>
          <option value="sm">sm</option>
          <option value="base">base</option>
          <option value="lg">lg</option>
        </select>
        <legend>Шрифти</legend>
      </div>
    </fieldset>
  )
}
