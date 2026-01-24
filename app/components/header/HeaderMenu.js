// HeaderMenu.js
//Ra/в роботі(MultiLevelMenu)
"use client"

import { headMenu, menuAdmin } from "../../data/dataMenu"
import MultiLevelMenu from "../MultiLevelMenu"

const headerMenuStyle = {
  top: {
    item: "text-hOn px-3 py-1 font-semibold", // верхні пункти в хедері
    itemHover: "hover:text-hOnHov hover:bg-hBgHov dark:hover:bg-hBgHovD dark:hover:text-hOnHovD",
  },
  dropdown: {
    bg: "bg-hBg dark:bg-hBgD",
    rounded: "rounded-lg",
    shadow: "shadow-lg",
    border: "border border-gray-200 dark:border-gray-700",
    item: "block px-4 py-2 text-sm text-hOn",
    itemHover: "hover:bg-hBgHov dark:hover:bg-hBgHovD hover:text-hOnHov dark:hover:text-hOnHovD",
    minW: "min-w-[14rem]",
    gap: "space-y-0.5",
  },
}
const HeaderMenu = () => {
  return (
    <div className="flex-1 min-w-0 justify-center hidden md:flex">
      {/* <MultiLevelMenu items={menuAdmin} isRowFirst={false} /> */}
      {/* <MultiLevelMenu items={headMenu} isRowFirst={true} /> */}
      <MultiLevelMenu items={headMenu} isRowFirst={true} menuStyle={headerMenuStyle} />
    </div>
  )
}

export default HeaderMenu
