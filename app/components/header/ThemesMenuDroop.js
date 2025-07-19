//ThemesMenuDroop.js
//Саме випадаюче меню вибору палітри тем

import { useRef, useEffect } from "react"
import { changeTheme } from "@/utils/helper"

const ThemesMenuDroop = ({
  setMobileDroopMenu, //0-рівень
  setThemesMenuOpen, //1-рівень
  setSetingThemesMenuOpen, //2-рівень
}) => {
  // console.log(
  //   "ThemesMenuDroop/document.querySelector(html)?.=",
  //   document.querySelector("html".data-theme)
  // );

  //   //*************Для клацання поза обєктом
  const ref_ThemesMenuDroop = useRef(null)

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref_ThemesMenuDroop.current?.contains(event.target)) {
        // alert("Outside Clicked.");
        // console.log("Outside Clicked. ");
        // setMobileDroopMenu(false);
        setSetingThemesMenuOpen(false)
        setThemesMenuOpen(false)
      }
    }

    window.addEventListener("mousedown", handleOutSideClick)

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick)
    }
  }, [ref_ThemesMenuDroop, setSetingThemesMenuOpen, setThemesMenuOpen])

  const togleTheme = (theme) => {
    // const theme = theme1.trim()
    // console.log("ThemesMenuDroop.js/togleTheme/theme=:", theme + ":")
    changeTheme(theme)
    setSetingThemesMenuOpen(false)
    setThemesMenuOpen(false)
    if (setMobileDroopMenu) setMobileDroopMenu(false)
  }

  const themes = [
    { title: "", name: "Slate", bg: "#cbd5e1" },
    { title: "tGray", name: "Gray", bg: "#d1d5db" },
    { title: "tZinc", name: "Zinc", bg: "#d4d4d8" },
    { title: "tNeutral", name: "Neutral", bg: "#d4d4d4" },
    { title: "tStone", name: "Stone", bg: "#d6d3d1" },
    { title: "tRed", name: "Red", bg: "#fca5a5" },
    { title: "tOrange", name: "Orange", bg: "#fdba74" },
    { title: "tAmber", name: "Amber", bg: "#f3dc8c" },
    { title: "tYellow", name: "Yellow", bg: "#fde047" },
    { title: "tLime", name: "Lime", bg: "#bef264" },
    { title: "tGreen", name: "Green", bg: "#86efac" },
    { title: "tEmerald", name: "Emerald", bg: "#6ee7b7" },
    { title: "tTeal", name: "Teal", bg: "#5eead4" },
    { title: "tCyan", name: "Cyan", bg: "#67e8f9" },
    { title: "tSky", name: "Sky", bg: "#7dd3fc" },
    { title: "tBlue", name: "Blue", bg: "#93c5fd" },
    { title: "tIndigo", name: "Indigo", bg: "#a5b4fc" },
    { title: "tViolet", name: "Violet", bg: "#c4b5fd" },
    { title: "tPurple", name: "Purple", bg: "#d8b4fe" },
    { title: "tFuchsia", name: "Fuchsia", bg: "#f0abfc" },
    { title: "tPink", name: "Pink", bg: "#f9a8d4" },
    { title: "tRose", name: "Rose", bg: "#fda4af" },
  ]

  //випадаюче меню Налаштувань
  const renderMenu = () => {
    return themes.map((item, index) => {
      return (
        <button
          key={index}
          className="w-full bg-[--bg]  py-1 text-base text-lime-900 hover:text-itemHover"
          style={{ "--bg": item.bg }}
          onClick={() => togleTheme(item.title)}
        >
          {item.name}
        </button>
      )
    })
  }
  return (
    <div ref={ref_ThemesMenuDroop} className="absolute right-0 z-10 m-0 p-0 max-h-64 w-full overflow-auto">
      <div className="grid place-items-center rounded-lg border border-hBorder bg-hBg drop-shadow-md dark:border-hBorderD dark:bg-hBgD">
        <div>
          <div>{renderMenu()}</div>
        </div>
      </div>
    </div>
  )
}

export default ThemesMenuDroop
