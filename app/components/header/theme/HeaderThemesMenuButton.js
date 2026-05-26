//HeaderSetingDroop.js/Claude
"use client"
import ThemesDropdown from "./ThemesDropdown"

const HeaderThemesMenuButton = ({ setSetingMenuOpen }) => {
  return <ThemesDropdown onClose={setSetingMenuOpen} />
}

export default HeaderThemesMenuButton