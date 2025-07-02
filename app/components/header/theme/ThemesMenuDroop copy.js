//ThemesMenuDroop.js
//Саме випадаюче меню вибору палітри тем

import { useRef, useEffect } from "react"
import { changeTheme } from "@/utils/helper"

const ThemesMenuDroop = ({
  setSetingMenuOpen, //0-рівень
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
        // setSetingMenuOpen(false);
        setSetingThemesMenuOpen(false)
        setThemesMenuOpen(false)
      }
    }

    window.addEventListener("mousedown", handleOutSideClick)

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick)
    }
  }, [ref_ThemesMenuDroop, setSetingThemesMenuOpen, setThemesMenuOpen])

  const togleThemeDefault = (e) => {
    changeTheme("")
    setSetingThemesMenuOpen(false)
    setThemesMenuOpen(false)
    if (setSetingMenuOpen) setSetingMenuOpen(false)
  }
  const togleTheme1 = (e) => {
    changeTheme("theme1")
    setSetingThemesMenuOpen(false)
    setThemesMenuOpen(false)
    if (setSetingMenuOpen) setSetingMenuOpen(false)
  }
  const togleTheme2 = (e) => {
    changeTheme("theme2")
    setSetingThemesMenuOpen(false)
    setThemesMenuOpen(false)
    if (setSetingMenuOpen) setSetingMenuOpen(false)
  }
  const togleTheme3 = (e) => {
    changeTheme("theme3")
    setSetingThemesMenuOpen(false)
    setThemesMenuOpen(false)
    if (setSetingMenuOpen) setSetingMenuOpen(false)
  }

  components / header / ThemesMenuDroop.js
  return (
    <div ref={ref_ThemesMenuDroop} className="absolute right-0 z-10 m-0 p-0">
      <div className="grid place-items-center rounded-lg border border-hBorder bg-hBg drop-shadow-md dark:border-hBorderD dark:bg-hBgD">
        <div>
          <button
            className="w-full bg-themeDefBg  py-1 text-base text-hText hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
            onClick={togleThemeDefault}
          >
            Основна
          </button>
          <button
            className="w-full bg-theme1Bg  py-1 text-base text-hText hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
            onClick={togleTheme1}
          >
            Тема 1
          </button>
          <button
            className="text-typography w-full bg-theme2Bg  py-1 text-hText hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
            onClick={togleTheme2}
          >
            Тема 2
          </button>
          <button
            className="w-full bg-theme3Bg  py-1 text-base text-hText hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
            onClick={togleTheme3}
          >
            Тема 3
          </button>
        </div>
      </div>
    </div>
  )
}

export default ThemesMenuDroop
