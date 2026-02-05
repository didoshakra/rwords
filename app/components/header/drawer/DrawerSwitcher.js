//components/header/drawer/DrawerSwitcher.js
"use client"

import { useState } from "react"
import DrawerDroop from "./DrawerDroop"
import BackShadow from "../BackShadow" //Затемнення екрану

export default function DrawerSwitcher({ thrme }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="relative flex justify-start ">
      <button
        className="flex items-center justify-center rounded-full p-1 hover:bg-hBgHov dark:hover:bg-hBgHovD md:p-2"
        onClick={(e) => setDrawerOpen(!drawerOpen)}
        aria-label="Відкрити меню навігації"
      >
        <svg
          className="h-8 w-8 text-hOn hover:text-hOnHov dark:text-hOnD dark:hover:text-hOnHovD"
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
          <path stroke="none" d="M0 0h24v24H0z" /> <line x1="4" y1="6" x2="20" y2="6" />{" "}
          <line x1="4" y1="12" x2="20" y2="12" /> <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>
      {/*Затемнення екрану */}
      {drawerOpen && <BackShadow setDrawerOpen={setDrawerOpen} />}
      <DrawerDroop drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
    </div>
  )
}
