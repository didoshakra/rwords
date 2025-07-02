// Коли не треба показувати меню ThemesMenuDroop (вставляти в HeaderMenuRight замість HeaderThemesDroopMenu)
"use client"
// import { useEffect, useState } from "react";
import { useTheme } from "next-themes"
// import resolveCofig from "tailwindcss/resolveConfig"; //отримання змінних з tailwind.config

const ThemeSwitcher = () => {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      className="hover:bg-hBgHov dark:hover:bg-hBgHovD flex items-center justify-center rounded-full p-2 transition-colors"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      title="тема"
    >
      {resolvedTheme === "dark" ? (
        // сонце
        <svg
          className="text-hText dark:text-hTextD h-8 w-8 "
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" /> <circle cx="12" cy="12" r="3" />{" "}
          <line x1="12" y1="5" x2="12" y2="3" /> <line x1="17" y1="7" x2="18.4" y2="5.6" />{" "}
          <line x1="19" y1="12" x2="21" y2="12" /> <line x1="17" y1="17" x2="18.4" y2="18.4" />{" "}
          <line x1="12" y1="19" x2="12" y2="21" /> <line x1="7" y1="17" x2="5.6" y2="18.4" />{" "}
          <line x1="6" y1="12" x2="4" y2="12" /> <line x1="7" y1="7" x2="5.6" y2="5.6" />
        </svg>
      ) : (
        // місяць
        <svg
          className="text-hText dark:text-hTextD h-8 w-8 "
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" /> <path d="M16.2 4a9.03 9.03 0 1 0 3.9 12a6.5 6.5 0 1 1 -3.9 -12" />
        </svg>
      )}
    </button>
  )
}

export default ThemeSwitcher
