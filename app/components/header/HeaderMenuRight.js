//HeaderMenuRight.js  /Верхнє меню
"use client"

// import ThemeSwitcher from "./ThemeSwitcher"
import UserSwitcher from './user/UserSwitcher.js';
import HeaderSetingDroopMenu from './HeaderMobileDroopMenu.js';
import HeaderThemesDroopMenu from './theme/HeaderThemesDroopMenu';


const HeaderMenuRight = () => {

  return (
    // <div className=" flex h-16 items-center justify-between">
    <div className=" flex items-center justify-end  h-full">
      {/* Іконки головного меню Seting */}
      <div className="hidden md:flex  h-full">
        {/* User */}
        <UserSwitcher />
        {/*Всі теми */}
        <HeaderThemesDroopMenu />
      </div>
      {/* Випадаюче меню Seting(мобільне) */}
      <div className="headerMenuRight__mobile">
        <HeaderSetingDroopMenu />
      </div>
    </div>
  )
}

export default HeaderMenuRight
