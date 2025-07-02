//TableMenuDroopAction.js
//Меню в Drawer з Header

"use client"
import { useRef, useEffect, useState } from "react"

const TableMenuDroopAction = ({ fAction }) => {
  const [tableMenuDroopAction, setTableMenuDroopAction] = useState(false)

  //*************Для клацання поза обєктом
  const ref_TableMenuDroopAction = useRef(null)

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref_TableMenuDroopAction.current?.contains(event.target)) {
        // alert("Outside Clicked.");
        // console.log("Outside Clicked. ");
        // setSetingMenuOpen(false);
        setTableMenuDroopAction(false)
      }
    }

    window.addEventListener("mousedown", handleOutSideClick)

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick)
    }
  }, [ref_TableMenuDroopAction, setTableMenuDroopAction])
  //

  const onAction = (e,action) => {
    fAction(e,action)
    setTableMenuDroopAction(false)
  }

  //випадаюче меню
  const renderMenu = () => {
    return (
      <>
        {/* Додати */}
        {/* <div
          className="space-x-2 flex list-none flex-nowrap  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
          title="Додати"
          onClick={() => onAction("add")}
        >
          <svg
            className="h-6 w-6  hover:text-hTextHov text-hText dark:text-hTextD dark:hover:text-hTextHovD"
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

          <p> Додати </p>
        </div> */}

        {/* Редагувати */}
        {/* <div
          className="m-1 space-x-2 flex list-none flex-nowrap  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
          title="Редагувати"
          onClick={() => onAction("edit")}
        >
          <svg
            className="h-6 w-6  hover:text-hTextHov text-hText dark:text-hTextD dark:hover:text-hTextHovD"
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
          <p>Редагувати</p>
        </div> */}

        {/* Видалити */}
        {/* <div
          className="m-1 space-x-2 flex list-none flex-nowrap  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
          title="Видалити"
          onClick={() => onAction("delete")}
        >
          <svg
            className="h-6 w-6  hover:text-hTextHov text-hText dark:text-hTextD dark:hover:text-hTextHovD"
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
          <p>Видалити</p>
        </div> */}
        {/* експорт в Exell */}
        <div
          className="m-1 space-x-2 flex list-none flex-nowrap  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
          title="експорт в Exel"
          onClick={(e) => onAction(e,"toExell")}
        >
          {/* експорт */}
          <svg
            className="h-6 w-6  hover:text-hTextHov text-hText dark:text-hTextD dark:hover:text-hTextHovD"
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
            <path stroke="none" d="M0 0h24v24H0z" /> <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />{" "}
            <polyline points="7 9 12 4 17 9" /> <line x1="12" y1="4" x2="12" y2="16" />
          </svg>
          <p>експорт в Exel</p>
        </div>

        {/*імпорт з Exel */}
        <div
          className="m-1 space-x-2 flex list-none flex-nowrap  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
          title="імпорт з Exel"
          //   onClick={(e) => onAction(e,"importExel")}
        >
          {/* імпорт*/}

          <svg
            className="h-6 w-6  hover:text-hTextHov text-hText dark:text-hTextD dark:hover:text-hTextHovD"
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
            <path stroke="none" d="M0 0h24v24H0z" /> <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />{" "}
            <polyline points="7 11 12 16 17 11" /> <line x1="12" y1="4" x2="12" y2="16" />
          </svg>
          <p>імпорт з Exel</p>
          <input
            title="Імпорт з Exell"
            type="file"
            name="file"
            onChange={(e) => fAction(e, "importExel")}
            accept=".xlsx"
          />
        </div>

        {/* Друкувати */}
        <div
          className="m-1 space-x-2 flex list-none flex-nowrap  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
          title="Друкувати"
          onClick={() => onAction("print")}
        >
          {/* Друкувати */}
          <svg
            className="h-6 w-6  hover:text-hTextHov text-hText dark:text-hTextD dark:hover:text-hTextHovD"
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
            <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />{" "}
            <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" /> <rect x="7" y="13" width="10" height="8" rx="2" />
          </svg>
          <p>Друкувати</p>
        </div>
      </>
    )
  }

  // ************************************************************************************
  return (
    <div ref={ref_TableMenuDroopAction} className="m-0 items-center">
      <div
        className="my-2 w-full flex list-none flex-nowrap items-center space-x-1 text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
        onClick={() => setTableMenuDroopAction(!tableMenuDroopAction)}
        title="меню"
      >
        {/* іконка мобільного меню */}
        <p className="pl-2 text-lg font-medium italic  text-hText"> Дії</p>
        {tableMenuDroopAction ? (
          // стрілка вверх
          <svg
            className="h-6 w-6"
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
            <path stroke="none" d="M0 0h24v24H0z" /> <polyline points="6 15 12 9 18 15" />
          </svg>
        ) : (
          // стрілка вниз
          <svg
            className="h-6 w-6 "
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
            <path stroke="none" d="M0 0h24v24H0z" /> <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </div>

      <div className={`${tableMenuDroopAction ? "relative" : "hidden"}  text-base font-normal px-2`}>
        <div>{renderMenu()}</div>
      </div>
    </div>
  )
}

export default TableMenuDroopAction
