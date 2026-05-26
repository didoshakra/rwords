//HeaderThemesDroopMenu.js/Claude
"use client"
import ThemesDropdown from "./ThemesDropdown"

const HeaderThemesDroopMenu = ({ setMobileDroopMenu }) => {
  return <ThemesDropdown onClose={setMobileDroopMenu} />
}

export default HeaderThemesDroopMenu