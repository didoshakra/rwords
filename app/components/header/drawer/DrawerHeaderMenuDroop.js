//DrawerHeaderMenuDroop.js
//Меню в Drawer з Header

"use client"
import { useState } from "react"
import Link from "next/link"
import { headMenu } from "../../../data/dataMenu"

const DrawerHeaderMenuDroop = ({ setDrawerOpen }) => {
  const [drawerHeaderMenuDroopOpen, setDrawerHeaderMenuDroopOpen] = useState(false)

  const tagleMenu = () => {
    setDrawerHeaderMenuDroopOpen(false)
    setDrawerOpen(false)
  }
  //випадаюче меню Налаштувань
  const renderMenu = () => {
    return headMenu.map((item, index) => {
      return (
        <li
          className="flex list-none flex-nowrap  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
          key={index}
          //   onClick={() => setDrawerHeaderMenuDroopOpen(false)}
          onClick={() => tagleMenu()}
        >
          <Link href={`${item.link}`}>{item.a}</Link>
        </li>
      )
    })
  }

  return (
    <div className="m-0 items-center pb-2 ">
      <div
        className="w-fullroup flex list-none flex-nowrap items-center space-x-1 text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
        onClick={() => setDrawerHeaderMenuDroopOpen(!drawerHeaderMenuDroopOpen)}
        title="меню"
      >
        {/* іконка мобільного меню */}
        <p className="pl-2 text-lg font-medium italic  text-hText dark:textD ">Головне меню</p>
        {drawerHeaderMenuDroopOpen ? (
          // стрілка вверх
          <svg
            className="h-6 w-6  dark:hover:text-hTextHovD dark:group-hover:text-hTextHov"
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
            className="h-6 w-6  dark:hover:text-hTextHovD dark:group-hover:text-hTextHovD"
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
        {/*  */}
        {/* <button
          type="button"
          className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
          data-accordion-target="#accordion-collapse-body-1"
          aria-expanded="true"
          aria-controls="accordion-collapse-body-1"
        >
          <span>What is Flowbite?</span>
          <svg
            data-accordion-icon
            className="w-3 h-3 rotate-180 shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button> */}
      </div>

      {/* список головного меню */}
      <div className={`${drawerHeaderMenuDroopOpen ? "relative" : "hidden"} pl-4 `}>
        <ul>{renderMenu()}</ul>
      </div>
    </div>
  )
}

export default DrawerHeaderMenuDroop
