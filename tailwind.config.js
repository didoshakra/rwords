"use client"

import UserSwitcher from "./user/UserSwitcher.js"
import HeaderSetingDroopMenu from "./HeaderMobileDroopMenu.js"
import HeaderThemesDroopMenu from "./theme/HeaderThemesMenuButton.js"

export default function HeaderMenuRight() {
  return (
    <div className="flex items-center justify-end h-full">
      {/* Десктопне меню: видно з md і вище */}
      <div className="hidden md:flex h-full space-x-2">
        <UserSwitcher />
        <HeaderThemesDroopMenu />
      </div>

      {/* Мобільне меню: видно до md */}
      <div className="md:hidden">
        <HeaderSetingDroopMenu />
      </div>
    </div>
  )
}
