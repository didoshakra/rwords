//UserMenuDroop.js
//Саме випадаюче меню мови

import { useRef, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"

const UserMenuDroop = ({ setUserMenuOpen, setSetingMenuOpen }) => {
  //*************Для клацання поза обєктом
  const ref_UserMenuDroop = useRef(null)
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref_UserMenuDroop.current?.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }

    window.addEventListener("mousedown", handleOutSideClick)

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick)
    }
  }, [ref_UserMenuDroop, setUserMenuOpen])

  return (
    <div ref={ref_UserMenuDroop} className="absolute right-0 z-10 m-0 p-0 text-base font-medium">
      <ul className="rounded-lg border border-hBorder bg-hBg  p-1 drop-shadow-md dark:border-hBorder dark:bg-hBgD">
        <li
          className="flex list-none flex-nowrap  items-center p-1  text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
        >
          {!user ? (
            <Link href="/auth" className="text-blue-600 underline">
              Увійти
            </Link>
          ) : (
            // <Link href="/auth" className="text-blue-600 underline">
            //   Вийти
            // </Link>
            <div className="flex items-center gap-4">
            <span className="text-gray-700">👤 {user.name}</span>
            <button onClick={logout} className="text-red-600 underline">
              Вийти
            </button>
          </div>
          )}
        </li>
      </ul>
    </div>
  )
}

export default UserMenuDroop
