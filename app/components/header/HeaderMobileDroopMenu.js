//HeaderSetingDroop.js
//Мобіле-Шестерня(іконка)
//*********************************************************************************** */
//Щоб відключити всі *Open=(false), треба відключити при клацанні поза обєктом function useOutsideAlerter(ref)
// і відключення у всіх onClick(*togle) в самомк об'єкті.
//********************************************************************************** */

"use client"
import { useState, useRef, useEffect } from "react"
import UserSwitcher from "./user/UserSwitcher"
import HeaderThemesDroopMenu from "./theme/HeaderThemesDroopMenu"

const HeaderMobileDroopMenu = () => {
  const [mobileDroopMenu, setMobileDroopMenu] = useState(false)
  //*************Для клацання поза обєктом
  const ref_HeaderMobileDroopMenu = useRef(null)

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref_HeaderMobileDroopMenu.current?.contains(event.target)) {
        setMobileDroopMenu(false)
        // setUserMenuOpen(false)
      }
    }

    window.addEventListener("mousedown", handleOutSideClick)

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick)
    }
  }, [ref_HeaderMobileDroopMenu, setMobileDroopMenu])

  //випадаюче меню Налаштувань
  const onSetingMenu = () => {
    setMobileDroopMenu(!mobileDroopMenu)
  }

  return (
    <div ref={ref_HeaderMobileDroopMenu} className="relative m-0 items-center p-0 md:hidden">
      <button
        className="flex items-center justify-center rounded-full p-1 transition-colors hover:bg-hBgHov dark:hover:bg-hBgHovD"
        onClick={onSetingMenu}
      >
        {/* іконка три крапки по Y */}
        <svg
          className="h-8 w-8  text-hText hover:text-hTextHov dark:text-hTextD dark:hover:text-hTextHovD"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <circle cx="12" cy="12" r="1" /> <circle cx="12" cy="5" r="1" /> <circle cx="12" cy="19" r="1" />
        </svg>
        {/* іконка шестерня */}
        {/* <svg
          className="h-8 w-8  text-hText hover:text-hTextHov dark:text-hTextD dark:hover:text-hTextHovD"
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
        </svg> */}
      </button>

      {/* Випадаюче мобільне меню  */}
      <div className={`${mobileDroopMenu ? "absolute" : "hidden"} right-0 z-10 m-0 p-0`}>
        <ul
          className={`m-0 w-[150px] rounded-lg  border border-hBorder bg-hBg p-1 text-base font-medium drop-shadow-md dark:border-hBorderD dark:bg-hBgD`}
        >
          <li className="dark:text-hTex flex w-full list-none  items-center text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:hover:bg-hBgHovD dark:hover:text-hTextHovD">
            <HeaderThemesDroopMenu setMobileDroopMenu={setMobileDroopMenu} />
          </li>
          {/* Випадаюче меню User */}
          <li className="dark:text-hTex flex w-full list-none  items-center text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:hover:bg-hBgHovD dark:hover:text-hTextHovD">
            <UserSwitcher setMobileDroopMenu={setMobileDroopMenu} />
          </li>
        </ul>
      </div>
    </div>
  )
}

export default HeaderMobileDroopMenu
