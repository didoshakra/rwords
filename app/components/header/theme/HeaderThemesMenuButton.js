//CL/HeaderSetingDroop.js
"use client"
import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { FaSun, FaMoon, FaPalette } from "react-icons/fa"
import ThemesMenuDroop from "./ThemesMenuDroop"

const HeaderThemesMenuButton = ({ setSetingMenuOpen }) => {
  const { resolvedTheme, setTheme } = useTheme()
  const [themesMenuOpen, setThemesMenuOpen] = useState(false)
  const [setingThemesMenuOpen, setSetingThemesMenuOpen] = useState(false)
  const ref_HeaderThemesDroopMenu = useRef(null)

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref_HeaderThemesDroopMenu.current?.contains(event.target)) {
        setThemesMenuOpen(false)
        setSetingThemesMenuOpen(false)
      }
    }
    window.addEventListener("mousedown", handleOutSideClick)
    return () => window.removeEventListener("mousedown", handleOutSideClick)
  }, [])

  const setSetingThemesMenuToggle = () => {
    setThemesMenuOpen(!themesMenuOpen)
    setSetingThemesMenuOpen(false)
  }
  const themeMenuToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
    setSetingThemesMenuOpen(false)
    setThemesMenuOpen(false)
    if (setSetingMenuOpen) setSetingMenuOpen(false)
  }

  return (
    <div ref={ref_HeaderThemesDroopMenu} className="relative h-full flex items-center list-none text-base font-medium">
      <button className="flex items-center" onClick={setSetingThemesMenuToggle} title="Налаштування теми">
        <span className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-hBgHov dark:hover:bg-hBgHovD">
          {/* іконка фарби */}
          <svg
            className="h-7 w-7 text-hText dark:text-hTextHovD"
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
          {/* {resolvedTheme === "dark" ? (
            <FaSun className="h-7 w-7 text-hTextD hover:text-hTextHov" />
          ) : (
            <FaMoon className="h-7 w-7 text-hText dark:text-hTextHovD" />
          )} */}
        </span>
        <span className="md:hidden ml-2">Теми</span>
      </button>

      {/* Випадаюче меню */}
      <div className={`${themesMenuOpen ? "absolute" : "hidden"} right-0 z-10 mt-2 w-44`}>
        <ul className="m-0 rounded-lg border border-hBorder bg-hBg p-1 drop-shadow-md dark:border-hBorderD dark:bg-hBgD ">
          <li
            className="group flex items-center space-x-2 p-2 text-hText hover:bg-hBgHov hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD cursor-pointer"
            onClick={themeMenuToggle}
          >
            {resolvedTheme === "dark" ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
            <span> {resolvedTheme === "dark" ? "Світла" : "Темна"}</span>
          </li>
          <li
            className="group flex items-center space-x-2 p-2 text-hText hover:bg-hBgHov hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD cursor-pointer"
            onClick={() => setSetingThemesMenuOpen(!setingThemesMenuOpen)}
          >
            <FaPalette className="h-5 w-5" />
            <span>Теми</span>
          </li>
        </ul>
        {/* Випадаюче меню Теми */}
        {setingThemesMenuOpen && (
          <ThemesMenuDroop
            setSetingMenuOpen={setSetingMenuOpen}
            setThemesMenuOpen={setThemesMenuOpen}
            setSetingThemesMenuOpen={setSetingThemesMenuOpen}
          />
        )}
      </div>
    </div>
  )
}

export default HeaderThemesMenuButton