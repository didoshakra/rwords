//components/header/drawer/DrawerSocialMenuDroop.js

"use client"
import { useState } from "react"
import SocialLinks from "../../SocialLinks"

const DrawerSocialMenuDroop = () => {
  const [drawerSocialMenuDroop, setDrawerSocialMenuDroop] = useState(false)

  //випадаюче меню Налаштувань
  const renderMenu = () => {
    return <SocialLinks size="lg" className="space-x-4" />
  }

  return (
    <div className="m-0 items-center">
      <div
        className="w-fullroup flex list-none flex-nowrap items-center space-x-1 text-hOn  hover:bg-hBgHov  hover:text-hOnHov dark:text-hOnD dark:hover:bg-hBgHovD dark:hover:text-hOnHovD"
        onClick={() => setDrawerSocialMenuDroop(!drawerSocialMenuDroop)}
        title="меню"
      >
        {/* іконка мобільного меню */}
        <p className="pl-2 text-lg font-semibold italic  text-hOn dark:text-hOnD hover:font-bold">Контакти</p>
        {drawerSocialMenuDroop ? (
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

      <div className={`${drawerSocialMenuDroop ? "relative" : "hidden"}  text-base font-normal px-2`}>
        <div>{renderMenu()}</div>
      </div>
    </div>
  )
}

export default DrawerSocialMenuDroop
