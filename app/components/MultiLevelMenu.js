//MultiLevelMenu.js
// Компонент для відображення багаторівневого меню

"use client"
import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
// import { useAuth } from "@/app/context/AuthContext"
import { useSession } from "next-auth/react"
import { useDatabase } from "@/app/context/DatabaseContext"
import { useAuth } from "@/app/context/AuthContext"

const MenuItem = ({ item, depth = 0, setDrawerOpen }) => {
  const { isDatabaseReady } = useDatabase()
  const { isFromApp } = useAuth()
  const { data: session, status } = useSession()
  const user = session?.user
  console.log("MenuItem user:", user)
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // ❗️Перевірка ролі з умовою
  // Якщо у елемента є roles, перевіряємо доступ користувача

  if (item.roles) {
    // const hasAccess = user ? item.roles.includes(user.role) : !isDatabaseReady // Якщо користувача нема, то даємо доступ тільки якщо БД не готова
    const hasAccess = isFromApp ? item.roles.includes("user") : user ? item.roles.includes(user.role) : !isDatabaseReady

    if (!hasAccess) {
      console.log(`Ховаємо пункт '${item.title}' — user:`, user, " — roles:", item.roles)
      return null
    }
  }

  const hasSubmenu = item.submenu && item.submenu.length > 0

  return (
    <li ref={ref} className="py-1" style={{ paddingLeft: `${depth * 5}px` }}>
      <div
        className={`flex items-center  cursor-pointer hover:text-blue-600 text-level${depth}`}
        onClick={() => {
          if (hasSubmenu) setOpen((prev) => !prev)
          else setDrawerOpen?.(false)
        }}
      >
        {item.url ? (
          <Link href={item.url} className="no-underline" onClick={() => setDrawerOpen?.(false)}>
            {item.title}
          </Link>
        ) : (
          <span>{item.title}</span>
        )}
        {hasSubmenu && (
          <span className="ml-2">
            {open ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <polyline points="6 15 12 9 18 15" />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </span>
        )}
      </div>

      {hasSubmenu && (
        <ul className={`ml-2 transition-all duration-300 ease-in ${open ? "block" : "hidden"}`}>
          {item.submenu.map((sub, idx) => (
            <MenuItem key={`${depth}-${idx}-${sub.title}`} item={sub} depth={depth + 1} setDrawerOpen={setDrawerOpen} />
          ))}
        </ul>
      )}
    </li>
  )
}

const MultiLevelMenu = ({ items, setDrawerOpen }) => {
  return (
    <ul className="text-sm  text-level0 text-level1 text-level2 text-level3 text-level4 text-level5">
      {items.map((item, index) => (
        <MenuItem key={`menu-${index}`} item={item} depth={0} setDrawerOpen={setDrawerOpen} />
      ))}
    </ul>
  )
}

export default MultiLevelMenu
