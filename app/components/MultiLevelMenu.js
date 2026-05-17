// MultiLevelMenu.js
"use client"
import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useDatabase } from "@/app/context/DatabaseContext"
import { useAuth } from "@/app/context/AuthContext"

const MenuItem = ({ item, depth = 0, setDrawerOpen, isRowFirst, menuStyle }) => {
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

  // Верхній рядок vs інші рівні
  const layoutClass = depth === 0 && isRowFirst ? "flex items-center gap-4 px-2" : "py-1"

  return (
    <li
      ref={ref}
      className={`${layoutClass} relative px-2`}
      //   style={{ paddingLeft: depth > 0 ? `${depth * 5}px` : undefined }}
    >
      <div
        className={`flex items-center cursor-pointer font-semibold hover:text-levelHover text-level${depth % 6} dark:text-hOnD`}
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
        <ul
          className={`absolute z-50 bg-levelBg${
            (depth + 1) % 6
          } rounded-md shadow-lg border border-gray-200 dark:border-gray-700 mt-1   ${open ? "block" : "hidden"}`}
          style={{
            left: 0,
            top: "80%",
            // Let submenu size to content but cap it with maxWidth
            width: "max-content",
            maxWidth: 350,
            // marginLeft: depth > 0 ? `${depth * 5}px` : "0",
            marginLeft: "5px",
          }}
        >
          {item.submenu.map((sub, idx) => (
            <MenuItem
              key={`${depth}-${idx}-${sub.title}`}
              item={sub}
              depth={depth + 1}
              setDrawerOpen={setDrawerOpen}
              isRowFirst={isRowFirst}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

const MultiLevelMenu = ({ items, setDrawerOpen, isRowFirst = false, menuStyle = {} }) => {
  return (
    <ul className={`${isRowFirst ? "flex space-x-4" : "flex flex-col"}`}>
      {items.map((item, index) => (
        <MenuItem
          key={`menu-${index}`}
          item={item}
          depth={0}
          setDrawerOpen={setDrawerOpen}
          isRowFirst={isRowFirst}
          menuStyle={menuStyle}
        />
      ))}
    </ul>
  )
}

export default MultiLevelMenu
