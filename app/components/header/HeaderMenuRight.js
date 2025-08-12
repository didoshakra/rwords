//HeaderMenuRight.js  /Верхнє меню праве.
//щоб він не вмикав “десктопне” меню, коли мобільний телефон у горизонтальному режимі.

"use client"

import { useState, useEffect } from "react"
import UserSwitcher from "./user/UserSwitcher.js"
import HeaderSetingDroopMenu from "./HeaderMobileDroopMenu.js"
import HeaderThemesDroopMenu from "./theme/HeaderThemesMenuButton.js"

const HeaderMenuRight = () => {
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  useEffect(() => {
    // Визначаємо мобільний пристрій по UserAgent
    const mobileCheck = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    setIsMobileDevice(mobileCheck)
  }, [])

  return (
    <div className="flex items-center justify-end h-full">
      {/* Десктопне меню — показуємо тільки якщо не мобільний пристрій */}
      {!isMobileDevice && (
        <div className="flex h-full">
          <UserSwitcher />
          <HeaderThemesDroopMenu />
        </div>
      )}

      {/* Мобільне меню — завжди */}
      <div className="headerMenuRight__mobile">
        <HeaderSetingDroopMenu />
      </div>
    </div>
  )
}

export default HeaderMenuRight

