//HeaderMenu.js
"use client"

import Link from "next/link"
import { headMenu } from "../../data/dataMenu"

const HeaderMenu = () => {
  // console.log("HeaderMenu/headMenu= ", headMenu);
  const renderMenu = () => {
    return headMenu.map((item, index) => {
      return (
        <li
          className="dark:text-hTextD hover:bg-hBgHov items-center whitespace-nowrap pr-1 font-sans text-lg font-bold text-hText hover:text-hTextHov hover:underline dark:bg-hBgD dark:hover:bg-hBgHovD  dark:hover:text-hTextHovD"
          key={index}
        >
          <Link href={item.link}>{item.a}</Link>
        </li>
      )
    })
  }

  return (
    <div className=" hidden md:mx-1 md:flex md:justify-end   ">
      {/* Меню для десктопа */}
      <ul className=" flex justify-end gap-3">{renderMenu()}</ul>
    </div>
  )
}

export default HeaderMenu
