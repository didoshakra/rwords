//HeaderMenuRight.js  /Верхнє меню праве.
//щоб він не вмикав “десктопне” меню, коли мобільний телефон у горизонтальному режимі.
"use client"

import { useState, useEffect } from "react"
import UserSwitcher from "./user/UserSwitcher.js"
import HeaderSetingDroopMenu from "./HeaderMobileDroopMenu.js"
import HeaderThemesDroopMenu from "./theme/HeaderThemesMenuButton.js"

const HeaderMenuRight = () => {
  const [showDesktopMenu, setShowDesktopMenu] = useState(false)

  useEffect(() => {
    function checkScreen() {
      const isMobileAgent = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      const isWideScreen = window.innerWidth >= 768 // брейкпоінт md у Tailwind
      setShowDesktopMenu(!isMobileAgent && isWideScreen)
    }

    checkScreen()
    window.addEventListener("resize", checkScreen)
    return () => window.removeEventListener("resize", checkScreen)
  }, [])

  return (
    <div className="flex items-center justify-end h-full">
      {showDesktopMenu && (
        <div className="flex h-full">
          <UserSwitcher />
          <HeaderThemesDroopMenu />
        </div>
      )}
      <div className="headerMenuRight__mobile">
        <HeaderSetingDroopMenu />
      </div>
    </div>
  )
}

export default HeaderMenuRight

