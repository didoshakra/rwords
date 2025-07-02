//CL/userSwitcher.js //
"use client"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/app/context/AuthContext"
import { FaUserCircle } from "react-icons/fa"
import Link from "next/link"

export default function UserSwitcher() {
  const { user, logout } = useAuth()
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
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center focus:outline-none transition-colors bg-hText hover:bg-hBgHov dark:hover:bg-hBgHovD"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          //   background: user ? "#1976d2" : "transparent",
          color: "#fff",
          fontWeight: "bold",
          fontSize: 20,
        }}
        title={user ? user.name || user.email : "Гість"}
      >
        {user ? initials : <FaUserCircle size={32} />}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded z-50 py-2 text-sm text-gray-800">
          {!user ? (
            <Link href="/auth" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setOpen(false)}>
              Увійти
            </Link>
          ) : (
            <>
              <div className="block px-4 py-2 font-semibold border-b border-gray-200">{user.name || user.email}</div>
              <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setOpen(false)}>
                Профіль
              </Link>
              <button
                onClick={() => {
                  logout()
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