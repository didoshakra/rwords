//ThemesDropdown.js/claud
"use client"
import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { FaSun, FaMoon, FaPalette } from "react-icons/fa"
import ThemesMenuDroop from "./ThemesMenuDroop"

const ThemesDropdown = ({ onClose }) => {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [colorsOpen, setColorsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref.current?.contains(event.target)) {
        setOpen(false)
        setColorsOpen(false)
      }
    }
    window.addEventListener("mousedown", handleOutSideClick)
    return () => window.removeEventListener("mousedown", handleOutSideClick)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
    setOpen(false)
    setColorsOpen(false)
    if (onClose) onClose()
  }

  return (
    <div ref={ref} className="relative list-none text-base font-medium">
      {/* Кнопка-тригер */}
      <button
        className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-hBgHov dark:hover:bg-hBgHovD"
        onClick={() => { setOpen(!open); setColorsOpen(false) }}
        title="Налаштування теми"
      >
        {/* іконка палітри */}
        <svg
          className="h-7 w-7 text-hOn dark:text-hOnD"
          width="24" height="24" viewBox="0 0 24 24"
          strokeWidth="2" stroke="currentColor" fill="none"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <path d="M12 21a9 9 0 1 1 0 -18a9 8 0 0 1 9 8a4.5 4 0 0 1 -4.5 4h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" />
          <circle cx="7.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="12" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="16.5" cy="10.5" r=".5" fill="currentColor" />
        </svg>
        <span className="md:hidden ml-2">Теми</span>
      </button>

      {/* Випадаюче меню */}
      <div className={`${open ? "absolute" : "hidden"} right-0 z-10 mt-2 w-44`}>
        <ul className="m-0 rounded-lg border border-hBorder bg-hBg p-1 drop-shadow-md dark:border-hBorderD dark:bg-hBgD">
          {/* Темна/Світла */}
          <li
            className="group flex list-none items-center space-x-2 p-2 cursor-pointer text-hOn hover:bg-hBgHov hover:text-hOnHov dark:text-hOnD dark:hover:bg-hBgHovD dark:hover:text-hOnHovD"
            onClick={toggleTheme}
            suppressHydrationWarning
          >
            {mounted && (resolvedTheme === "dark"
              ? <FaSun className="h-5 w-5" />
              : <FaMoon className="h-5 w-5" />
            )}
            <span suppressHydrationWarning>
              {mounted ? (resolvedTheme === "dark" ? "Світла" : "Темна") : ""}
            </span>
          </li>
          {/* Кольори */}
          <li
            className="group flex list-none items-center space-x-2 p-2 cursor-pointer text-hOn hover:bg-hBgHov hover:text-hOnHov dark:text-hOnD dark:hover:bg-hBgHovD dark:hover:text-hOnHovD"
            onClick={() => setColorsOpen(!colorsOpen)}
          >
            <FaPalette className="h-5 w-5" />
            <span>Кольори</span>
          </li>
        </ul>
        {/* Список кольорів */}
        {colorsOpen && (
          <ThemesMenuDroop
            setThemesMenuOpen={setOpen}
            setSetingThemesMenuOpen={setColorsOpen}
            setMobileDroopMenu={onClose}
          />
        )}
      </div>
    </div>
  )
}

export default ThemesDropdown