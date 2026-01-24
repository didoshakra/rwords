//MultiLevelMenu.js
//Робоче без стилів багато рівневе меню з ролями
"use client"
import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useDatabase } from "@/app/context/DatabaseContext"
import { useAuth } from "@/app/context/AuthContext"

const MenuItem = ({ item, depth = 0, setDrawerOpen, isRowFirst }) => {
  const { isDatabaseReady } = useDatabase()
  const { isFromApp } = useAuth()
  const { data: session } = useSession()
  const user = session?.user
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

  if (item.roles) {
    const hasAccess = isFromApp ? item.roles.includes("user") : user ? item.roles.includes(user.role) : !isDatabaseReady

    if (!hasAccess) return null
  }

  const hasSubmenu = item.submenu && item.submenu.length > 0

  // 👉 ВАЖЛИВО: міняємо тільки display верхнього рівня!
  const layoutClass =
    depth === 0 && isRowFirst
      ? "flex items-center gap-4 px-2" // верхній рівень в рядок
      : "py-1" // інші рівні — як було

  return (
    <li
      ref={ref}
      className={`py-1 ${depth === 0 && isRowFirst ? "flex-1" : ""}`}
      style={{ paddingLeft: depth > 0 ? `${depth * 5}px` : undefined }}
    >
      {/* <li ref={ref} className={layoutClass} style={{ paddingLeft: `${depth * 5}px` }}> */}
      <div
        className={`flex items-center cursor-pointer hover:text-levelHover text-level${depth}`}
        onClick={() => {
          if (hasSubmenu) setOpen((p) => !p)
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
          <span className="ml-1">
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
        <ul className={`ml-1 transition-all duration-300 ease-in ${open ? "block" : "hidden"}`}>
          {item.submenu.map((sub, idx) => (
            <MenuItem
              key={`${depth}-${idx}-${sub.title}`}
              item={sub}
              depth={depth + 1}
              setDrawerOpen={setDrawerOpen}
              isRowFirst={isRowFirst} // передаємо далі
            />
          ))}
        </ul>
      )}
    </li>
  )
}

const MultiLevelMenu = ({ items, setDrawerOpen, isRowFirst = false }) => {
  return (
    <ul
      className={`text-sm text-level0 text-level1 text-level2 text-level3 text-level4 text-level5 ${
        isRowFirst ? "flex space-x-4" : ""
      }`}
    >
      {items.map((item, index) => (
        <MenuItem
          key={`menu-${index}`}
          item={item}
          depth={0}
          setDrawerOpen={setDrawerOpen}
          isRowFirst={isRowFirst} // передаємо для верхнього рівня
        />
      ))}
    </ul>
  )
}

export default MultiLevelMenu
