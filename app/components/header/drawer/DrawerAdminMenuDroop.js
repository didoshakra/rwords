//GPT/drawerAdminMenuDroop.js
//MultiLevelMenu
"use client"
import { useState } from "react"
import MultiLevelMenu from "@/app/components/MultiLevelMenu"
import { menuAdmin } from "@/app/data/dataMenu"

const DrawerAdminMenuDroop = ({ setDrawerOpen }) => {
  const [drawerAdminMenuDroopOpen, setDrawerAdminMenuDroopOpen] = useState(false)

  return (
    <div className="m-0 items-center pb-2">
      <div
        className="w-full flex items-center space-x-1 text-hText hover:bg-hBgHov hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
        onClick={() => setDrawerAdminMenuDroopOpen(!drawerAdminMenuDroopOpen)}
        title="меню"
      >
        <p className="pl-2 text-lg font-medium italic text-hText dark:text-hTextD">Меню Адміністратора</p>
        {drawerAdminMenuDroopOpen ? (
          <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <polyline points="6 15 12 9 18 15" />
          </svg>
        ) : (
          <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </div>

      {drawerAdminMenuDroopOpen && (
        <div className="relative pl-4">
          <MultiLevelMenu items={menuAdmin} setDrawerOpen={setDrawerOpen} />
        </div>
      )}
    </div>
  )
}

export default DrawerAdminMenuDroop
