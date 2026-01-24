// MultiLevelMenu.js
//GPT-стилі/не розкривається
"use client"
import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useDatabase } from "@/app/context/DatabaseContext"
import { useAuth } from "@/app/context/AuthContext"

const defaultStyles = {
  top: {
    // стиль пунктів верхнього рівня (хедер)
    item: "text-hOn px-2 py-1",
    itemHover: "hover:text-hOnHov hover:bg-hBgHov dark:hover:bg-hBgHovD dark:hover:text-hOnHovD",
  },
  dropdown: {
    // загальний контейнер dropdown
    bg: "bg-white/95 dark:bg-zinc-800/95",
    rounded: "rounded-md",
    shadow: "shadow-lg",
    border: "border border-gray-200 dark:border-gray-700",
    item: "block px-3 py-2 text-sm text-hOn",
    itemHover: "hover:bg-hBgHov dark:hover:bg-hBgHovD hover:text-hOnHov dark:hover:text-hOnHovD",
    gap: "space-y-0.5",
    minW: "min-w-[12rem]",
  },
  transitions: {
    duration: "duration-200",
    timing: "ease-out",
  },
}

// MenuItem: рекурсивний
const MenuItem = ({ item, depth = 0, setDrawerOpen, isRowFirst, menuStyle }) => {
  const { isDatabaseReady } = useDatabase()
  const { isFromApp } = useAuth()
  const { data: session } = useSession()
  const user = session?.user

  const styles = {
    top: { ...defaultStyles.top, ...(menuStyle?.top || {}) },
    dropdown: { ...defaultStyles.dropdown, ...(menuStyle?.dropdown || {}) },
    transitions: { ...defaultStyles.transitions, ...(menuStyle?.transitions || {}) },
  }

  const [open, setOpen] = useState(false)
  const [locked, setLocked] = useState(false) // зафіксувати відкриття при кліку на стрілку
  const ref = useRef(null)

  // визначаємо чи ми на десктопі (md breakpoint)
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(min-width: 768px)")
    const handler = (e) => setIsDesktop(e.matches)
    setIsDesktop(mq.matches)
    mq.addEventListener?.("change", handler)
    return () => mq.removeEventListener?.("change", handler)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        setLocked(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // ролі/доступ
  if (item.roles) {
    const hasAccess = isFromApp ? item.roles.includes("user") : user ? item.roles.includes(user.role) : !isDatabaseReady
    if (!hasAccess) return null
  }

  const hasSubmenu = item.submenu && item.submenu.length > 0

  // позиціонування submenu
  // depth 0 -> dropdown під пунктом (top-full left-0)
  // depth >0 -> праворуч (top-0 left-full)
  const submenuPositionClass = depth === 0 ? "left-0 top-full" : "left-full top-0"

  // стилі для елементу (залежно від рівня)
  const itemClass =
    depth === 0
      ? `flex items-center gap-1 ${styles.top.item} ${styles.top.itemHover} cursor-default select-none`
      : ` ${styles.dropdown.item} ${styles.dropdown.itemHover} cursor-default select-none`

  // анімація: fade + slide
  const animationClass = `${styles.transitions.duration} ${styles.transitions.timing} transform origin-top`

  // Обробники hover — працюють лише на desktop; на мобайлі будуть ігноровані
  const handleMouseEnter = () => {
    if (!isDesktop) return
    if (!locked) setOpen(true)
  }
  const handleMouseLeave = () => {
    if (!isDesktop) return
    if (!locked) setOpen(false)
  }

  // клік по стрілці — фіксувати/розфіксувати
  const toggleLock = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const nextLocked = !locked
    setLocked(nextLocked)
    setOpen(nextLocked ? true : false)
  }

  // клік по самому пункту (якщо нема submenu, закриваємо drawer)
  const handleClickItem = () => {
    if (!hasSubmenu) {
      setDrawerOpen?.(false)
    } else {
      // якщо мобільний режим (не desktop), клік повинен відкривати/закривати
      if (!isDesktop) setOpen((p) => !p)
    }
  }

  return (
    <li
      ref={ref}
      className={`relative ${depth === 0 && isRowFirst ? "flex items-center" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div onClick={handleClickItem} className={itemClass}>
        {item.url ? (
          <Link href={item.url} className="no-underline w-full">
            <span>{item.title}</span>
          </Link>
        ) : (
          <span>{item.title}</span>
        )}

        {hasSubmenu && (
          // стрілка — по ній можна клікнути, щоб зафіксувати меню
          <button
            onClick={toggleLock}
            aria-expanded={open}
            aria-haspopup="menu"
            className="ml-2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Відкрити підменю"
            type="button"
          >
            {/* прості SVG-стрілки */}
            {open ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <polyline points="6 15 12 9 18 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        )}
      </div>

      {hasSubmenu && (
        // контейнер підменю — позиціюємо absolute, додаємо фон, тінь, округлення
        <ul
          className={`absolute z-50 ${submenuPositionClass} ${styles.dropdown.minW} ${styles.dropdown.bg} ${
            styles.dropdown.rounded
          } ${styles.dropdown.shadow} ${styles.dropdown.border} ${animationClass} overflow-hidden ${
            open ? "block opacity-100 translate-y-0" : "hidden opacity-0 -translate-y-1"
          }`}
          role="menu"
        >
          <div className={`py-1 ${styles.dropdown.gap}`}>
            {item.submenu.map((sub, idx) => (
              <MenuItem
                key={`${depth}-${idx}-${sub.title}`}
                item={sub}
                depth={depth + 1}
                setDrawerOpen={setDrawerOpen}
                isRowFirst={isRowFirst}
                menuStyle={menuStyle}
              />
            ))}
          </div>
        </ul>
      )}
    </li>
  )
}

// MultiLevelMenu (головний)
const MultiLevelMenu = ({ items, setDrawerOpen, isRowFirst = false, menuStyle = {} }) => {
  // якщо потрібно — можна додати memoization або оптимізацію
  return (
    <nav>
      <ul className={`${isRowFirst ? "flex items-center gap-2" : "flex flex-col"} list-none m-0 p-0`}>
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
    </nav>
  )
}

export default MultiLevelMenu
