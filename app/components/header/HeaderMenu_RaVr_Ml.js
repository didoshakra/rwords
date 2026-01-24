// HeaderMenu.js
//Ra/в роботі(MultiLevelMenu)
"use client"

import { headMenu, menuAdmin } from "../../data/dataMenu"
import MultiLevelMenu from "../MultiLevelMenu"

const HeaderMenu = () => {
  return (
    <div className="flex-1 min-w-0 justify-center hidden md:flex">
      {/* <MultiLevelMenu items={menuAdmin} isRowFirst={false} /> */}
      <MultiLevelMenu items={headMenu} isRowFirst={true} />
    </div>
  )
}

export default HeaderMenu
