//GPT/DrawerExtendedMenuDroop.js
//MultiLevelMenu
"use client"
import { useState } from "react"
import MultiLevelMenu from "@/app/components/MultiLevelMenu"
import { menuAdmin } from "@/app/data/dataMenu"

const DrawerExtendedMenuDroop = ({ setDrawerOpen }) => {
  const [drawerExtendedMenuDroopOpen, setDrawerExtendedMenuDroopOpen] = useState(false)

  return (
    <div className="m-0 items-center pb-2">
      <div
        className="w-full flex items-center space-x-1 text-hOn hover:bg-hBgHov hover:text-hOnHov dark:text-hOnD dark:hover:bg-hBgHovD dark:hover:text-hOnHovD"
        onClick={() => setDrawerExtendedMenuDroopOpen(!drawerExtendedMenuDroopOpen)}
        title="меню"
      >
        <p className="pl-2 text-lg font-medium italic text-hOn dark:text-hOnD">Розширене меню</p>
        {drawerExtendedMenuDroopOpen ? (
          <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <polyline points="6 15 12 9 18 15" />
          </svg>
        ) : (
          <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </div>

      {drawerExtendedMenuDroopOpen && (
        <div className="relative pl-4">
          <MultiLevelMenu items={menuAdmin} setDrawerOpen={setDrawerOpen} />
        </div>
      )}
    </div>
  )
}

export default DrawerExtendedMenuDroop
