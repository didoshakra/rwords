//drawerAdminMenuDroop.js
//Меню в Drawer з Header

"use client"
import { useState } from "react"
// import Link from "next/link"
import MenuItems from "@/app/components/header/multiLevelMenu/MenuItems"
import { menuAdmin } from "@/app/components/header/multiLevelMenu/dataMultilevelMenu"

const DrawerAdminMenuDroop = ({ setDrawerOpen }) => {
  const [drawerAdminMenuDroopOpen, setDrawerAdminMenuDroopOpen] = useState(false)

  //   const tagleMenu = () => {
  //     setDrawerAdminMenuDroopOpen(false)
  //     setDrawerOpen(false)
  //   }

  //випадаюче меню Налаштувань
  const renderMenu = () => {
    return menuAdmin.map((menu, index) => {
      const depthLevel = 0
      return <MenuItems items={menu} key={index} idKey={index} depthLevel={depthLevel} setDrawerOpen={setDrawerOpen} />
    })
  }

  return (
    <div className="m-0 items-center pb-2 ">
      <div
        className="w-fullroup flex list-none flex-nowrap items-center space-x-1 text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
        onClick={() => setDrawerAdminMenuDroopOpen(!drawerAdminMenuDroopOpen)}
        title="меню"
      >
        {/* іконка мобільного меню */}
        <p className="pl-2 text-lg font-medium italic  text-hText dark:text-hTextD ">Меню Адміністратора</p>
        {drawerAdminMenuDroopOpen ? (
          // стрілка вверх
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
      </div>

      {/* список головного меню */}
      <div className={`${drawerAdminMenuDroopOpen ? "relative" : "hidden"} pl-4 `}>
        <ul>{renderMenu()}</ul>
      </div>
    </div>
  )
}

export default DrawerAdminMenuDroop
