//CL/userSwitcher.js //
"use client"
import { useState, useRef, useEffect } from "react"
// import { useAuth } from "@/app/context/AuthContext"
import { signOut, useSession } from "next-auth/react"
import { FaUserCircle } from "react-icons/fa"
import Link from "next/link"

export default function UserSwitcher({ setMobileDroopMenu }) {
//   const { user, logout } = useAuth()
  const { data: session, status } = useSession()
  const user = session?.user
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  // Закривати меню при кліку поза ним
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Визначаємо ініціали
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() || ""

  return (
    <div className="relative flex items-center h-full" ref={menuRef}>
      {/* 📱 Мобільна кнопка: вся зона клікабельна */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 py-2 text-sm sm:text-base hover:bg-hBgHov dark:hover:bg-hBgHovD focus:outline-none md:hidden"
        title={user ? user.name || user.email : "Гість"}
      >
        <div
          className="w-10 h-10 flex items-center justify-center rounded-full transition-colors bg-hText"
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          {user ? initials : <FaUserCircle size={32} />}
        </div>
        <span>Акаунт</span>
      </button>

      {/* 🖥️ Десктопна кнопка: тільки аватарка */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="hidden md:flex text-sm sm:text-base items-center justify-center w-10 h-10 rounded-full bg-hText hover:bg-hBgHov dark:hover:bg-hBgHovD transition-colors focus:outline-none"
        title={user ? user.name || user.email : "Гість"}
        style={{
          color: "#fff",
          fontWeight: "bold",
          fontSize: 20,
        }}
      >
        {user ? initials : <FaUserCircle size={32} />}
      </button>

      {/* Випадаюче меню */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded z-50 py-2 text-sm text-gray-800">
          {!user ? (
            <Link
              href="/auth"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setOpen(false)
                setMobileDroopMenu(false)
              }}
            >
              Увійти
            </Link>
          ) : (
            <>
              <div className="block px-4 py-2  border-b border-gray-200 text-sm sm:text-base">
                {user.name || user.email}
              </div>
              <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setOpen(false)}>
                Профіль
              </Link>
              <button
                onClick={() => {
                  //   logout()
                  signOut()
                  setOpen(false)
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Вийти
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
