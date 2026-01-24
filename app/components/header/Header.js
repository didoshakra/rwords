//Header.js
"use client"

import HeaderLogo from "./HeaderLogo"
import HeaderMenu from "./HeaderMenu"
import HeaderMenuRight from "./HeaderMenuRight"
import DrawerSwitcher from "./drawer/DrawerSwitcher"

export default function Header() {
  return (
    <header
      className="mx-0 my-0 flex h-12  w-full items-center justify-between bg-hBg dark:bg-hBgD"
      //   className="mx-auto my-auto mt-1 flex w-full flex-col justify-start  overflow-hidden bg-hTapeBg px-1 text-sm text-hTapeOn dark:bg-hTapeBgD dark:text-hTapeOn  md:flex-row md:justify-between md:px-2 "
    >
      {/* Ліве випадаюче меню */}
      {/* <div className="flex items-center h-full justify-start"> */}
      <div className="flex items-center h-full justify-start gap-2">
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
