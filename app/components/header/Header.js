//CL/Header.js
"use client"

import HeaderLogo from "./HeaderLogo"
import HeaderMenu from './HeaderMenu'
import HeaderMenuRight from './HeaderMenuRight'
import DrawerSwitcher from './drawer/DrawerSwitcher'

export default function Header() {
  return (
    <header className="mx-0 my-0 flex h-12 md:h-14 max-w-full items-center justify-between bg-hBg dark:bg-hBgD">
      {/* Ліве випадаюче меню */}
      <div className="flex items-center h-full justify-start">
        <DrawerSwitcher />
        <HeaderLogo />
      </div>
      <HeaderMenu />
      <div className="flex items-center h-full justify-end">
        <HeaderMenuRight />
      </div>
    </header>
  )
}
