//DrawerHeaderMenuDroop.js
//Меню в Drawer з Header

"use client"
import { useState } from "react"
// import Link from "next/link"
import MultiLevelMenu from "@/app/components/MultiLevelMenu"
import {  headMenu } from "@/app/data/dataMenu"

const DrawerHeaderMenuDroop = ({ setDrawerOpen }) => {
  const [drawerHeaderMenuDroopOpen, setDrawerHeaderMenuDroopOpen] = useState(false)

  const tagleMenu = () => {
    setDrawerHeaderMenuDroopOpen(false)
    setDrawerOpen(false)
  }
//   //випадаюче меню Налаштувань
//   const renderMenu = () => {
//     return headMenu.map((item, index) => {
//       return (
//         <li
//           className="flex list-none flex-nowrap  items-center text-base font-normal text-hOn  hover:bg-hBgHov  hover:text-hOnHov dark:text-hOnD dark:hover:bg-hBgHovD dark:hover:text-hOnHovD"
//           key={index}
//           //   onClick={() => setDrawerHeaderMenuDroopOpen(false)}
//           onClick={() => tagleMenu()}
//         >
//           <Link href={`${item.link}`}>{item.a}</Link>
//         </li>
//       )
//     })
//   }

  return (
    <div className="m-0 items-center pb-2 ">
      <div
        className="w-fullroup flex list-none flex-nowrap items-center space-x-1 text-hOn  hover:bg-hBgHov  hover:text-hOnHov dark:text-hOnD dark:hover:bg-hBgHovD dark:hover:text-hOnHovD"
        onClick={() => setDrawerHeaderMenuDroopOpen(!drawerHeaderMenuDroopOpen)}
        title="меню"
      >
        {/* іконка мобільного меню */}
        <p className="pl-2 text-lg font-medium italic  text-hOn dark:textD ">Головне меню</p>
        {drawerHeaderMenuDroopOpen ? (
          // стрілка вверх
          <svg
            className="h-6 w-6  dark:hover:text-hOnHovD dark:group-hover:text-hOnHov"
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
            className="h-6 w-6  dark:hover:text-hOnHovD dark:group-hover:text-hOnHovD"
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
      </div>

      {/* список головного меню */}
      <div className={`${drawerHeaderMenuDroopOpen ? "relative" : "hidden"} pl-4 `}>
        {/* <ul>{renderMenu()}</ul>//Старе меню */}
        <MultiLevelMenu setDrawerOpen={setDrawerOpen} items={headMenu} isRowFirst={false} />
      </div>
    </div>
  )
}

export default DrawerHeaderMenuDroop
