//HeaderSetingDroop.js
// Коли треба показувати меню ThemesMenuDroop
//*********************************************************************************** */

"use client"
import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import ThemesMenuDroop from "./ThemesMenuDroop"

const HeaderThemesDroopMenu = ({ setMobileDroopMenu }) => {
  const { resolvedTheme, setTheme } = useTheme()
  const [themesMenuOpen, setThemesMenuOpen] = useState(false) //Для випадання верхнього меню
  const [setingThemesMenuOpen, setSetingThemesMenuOpen] = useState(false) //Для випадання меню вибору теми

  //   *************Для клацання поза обєктом
  const ref_HeaderThemesDroopMenu = useRef(null)

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref_HeaderThemesDroopMenu.current?.contains(event.target)) {
        // alert("Outside Clicked.");
        // console.log("Outside Clicked. ");
        setThemesMenuOpen(false)
        setSetingThemesMenuOpen(false)
        // if (setMobileDroopMenu) setMobileDroopMenu(false);
      }
    }

    window.addEventListener("mousedown", handleOutSideClick)

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick)
    }
  }, [ref_HeaderThemesDroopMenu, setThemesMenuOpen, setSetingThemesMenuOpen])

  //випадаюче меню Налаштувань
  const setSetingThemesMenuToggle = () => {
    setThemesMenuOpen(!themesMenuOpen)
    setSetingThemesMenuOpen(false) //Закриваєм меню
    // console.log("setSetingThemesMenuToggle/themesMenuOpen=", themesMenuOpen);
  }
  //Зміна в newTheme Context
  const themeMenuToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
    setSetingThemesMenuOpen(false)
    setThemesMenuOpen(false)
    if (setMobileDroopMenu) setMobileDroopMenu(false)
  }

  return (
    <div ref={ref_HeaderThemesDroopMenu} className="relative  list-none text-base font-medium">
      {/* іконка seting*/}
      {/* <div className="HeaderThemesDroopMenu__icon" onClick={setSetingThemesMenuToggle}> */}
      <button
        className="flex items-center   text-hText hover:text-hTextHov dark:text-hTextD dark:hover:text-hTextHovD"
        onClick={setSetingThemesMenuToggle}
      >
        <span
          className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-hBgHov dark:hover:bg-hBgHovD"
          onClick={setSetingThemesMenuToggle}
        >
          {/* іконка фарби */}
          <svg
            className="h-8 w-8  dark:text-hTextD dark:hover:text-hTextHovD"
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
            <path d="M12 21a9 9 0 1 1 0 -18a9 8 0 0 1 9 8a4.5 4 0 0 1 -4.5 4h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" />{" "}
            <circle cx="7.5" cy="10.5" r=".5" fill="currentColor" />{" "}
            <circle cx="12" cy="7.5" r=".5" fill="currentColor" />{" "}
            <circle cx="16.5" cy="10.5" r=".5" fill="currentColor" />
          </svg>
        </span>
        <span className="md:hidden">Кольори</span>
      </button>

      {/* Випадаюче меню */}
      <div className={`${themesMenuOpen ? "absolute" : "hidden"} font-bol right-0 z-10 m-0 p-0 `}>
        <ul
          className={`m-0 w-[180px] rounded-lg  border border-hBorder bg-hBg p-1 drop-shadow-md dark:border-hBorderD dark:bg-hBgD`}
        >
          <li
            // ref={ref_HeaderThemesDroopMenu}
            className="active:text-hTextAct dark:active:text-hTextAct group flex list-none flex-nowrap items-center space-x-1 p-1 text-hText hover:bg-hBgHov hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
            onClick={themeMenuToggle}
            //   onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {/* <FontAwesomeIcon icon={themeTypeLight ? faSun : faMoon} /> */}
            <span
            //  title="Темна/світла"
            >
              {resolvedTheme === "dark" ? (
                <svg
                  className="h-8 w-8 text-hText dark:text-hTextHovD group-hover:text-hTextHov dark:group-hover:text-hTextHovD"
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
                  <path stroke="none" d="M0 0h24v24H0z" /> <circle cx="12" cy="12" r="3" />{" "}
                  <line x1="12" y1="5" x2="12" y2="3" /> <line x1="17" y1="7" x2="18.4" y2="5.6" />{" "}
                  <line x1="19" y1="12" x2="21" y2="12" /> <line x1="17" y1="17" x2="18.4" y2="18.4" />{" "}
                  <line x1="12" y1="19" x2="12" y2="21" /> <line x1="7" y1="17" x2="5.6" y2="18.4" />{" "}
                  <line x1="6" y1="12" x2="4" y2="12" /> <line x1="7" y1="7" x2="5.6" y2="5.6" />
                </svg>
              ) : (
                <svg
                  className="h-8 w-8  text-hTextHov dark:text-hTextHovD dark:group-hover:text-hTextHovD group-hover:text-hTextHov"
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
                  <path d="M16.2 4a9.03 9.03 0 1 0 3.9 12a6.5 6.5 0 1 1 -3.9 -12" />
                </svg>
              )}
            </span>
            <span> {resolvedTheme === "dark" ? "Світла" : "Темна"}</span>
          </li>
          <li
            className="active:text-hTextAct dark:active:text-hTextAct group flex list-none flex-nowrap items-center space-x-1 p-1 text-hText hover:bg-hBgHov hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
            onClick={() => setSetingThemesMenuOpen(!setingThemesMenuOpen)}
          >
            {/* // Від цього об'єкту li відраховуються відступи в випадаючих меню мов  */}
            <span>
              {/* іконка валік/малювати */}
              {/* <svg
                className="h-8 w-8 text-hText group-hover:text-hTextHov dark:text-hTextD dark:group-hover:text-hTextHovD"
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
                <path stroke="none" d="M0 0h24v24H0z" /> <rect x="5" y="3" width="14" height="6" rx="2" />{" "}
                <path d="M19 6h1a2 2 0 0 1 2 2a5 5 0 0 1 -5 5l-5 0v2" />{" "}
                <rect x="10" y="15" width="4" height="6" rx="1" />
              </svg> */}
              {/* іконка фарби */}
              <svg
                className="h-8 w-8 text-hText group-hover:text-hTextHov dark:text-hTextD dark:group-hover:text-hTextHovD"
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
                <path d="M12 21a9 9 0 1 1 0 -18a9 8 0 0 1 9 8a4.5 4 0 0 1 -4.5 4h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" />{" "}
                <circle cx="7.5" cy="10.5" r=".5" fill="currentColor" />{" "}
                <circle cx="12" cy="7.5" r=".5" fill="currentColor" />{" "}
                <circle cx="16.5" cy="10.5" r=".5" fill="currentColor" />
              </svg>
            </span>
            <span>Кольори</span>
          </li>
        </ul>
        {/* Випадаюче меню Теми */}
        {setingThemesMenuOpen && (
          <ThemesMenuDroop
            setMobileDroopMenu={setMobileDroopMenu} //0-й рівень
            setThemesMenuOpen={setThemesMenuOpen} //1-й рівень
            setSetingThemesMenuOpen={setSetingThemesMenuOpen} //1-й рівень
          />
        )}
      </div>
    </div>
  )
}

export default HeaderThemesDroopMenu
