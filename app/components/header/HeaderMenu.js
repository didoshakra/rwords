//HeaderMenu.js
"use client"

import Link from "next/link"
import { headMenu } from "../../data/dataMenu"
import { useSession } from "next-auth/react"

const HeaderMenu = () => {
  // console.log("HeaderMenu/headMenu= ", headMenu);
  const { data: session } = useSession()
  const user = session?.user

  const renderMenu = () => {
    return headMenu
      .filter((item) => user?.role === "admin" || !item.roles || item.roles.includes(user?.role))
      .map((item, index) => (
        <li
          className="dark:text-hOnD hover:bg-hBgHov items-center whitespace-nowrap pr-1 font-sans text--basesm:text-base lg:text-xl font-bold text-hOn hover:text-hOnHov hover:underline dark:bg-hBgD dark:hover:bg-hBgHovD  dark:hover:text-hOnHovD"
          key={index}
        >
          <Link href={item.link}>{item.a}</Link>
        </li>
      ))
  }

  return (
    // <div className=" hidden md:mx-1 md:flex md:justify-end   ">
    <div className="flex-1 min-w-0 justify-center hidden md:flex">
      {/* Меню для десктопа */}
      {/* <ul className=" flex justify-end gap-3"> */}
      <ul className="flex justify-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">{renderMenu()}</ul>
    </div>
  )
}

export default HeaderMenu
