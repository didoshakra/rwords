// Dropdown.js
import MenuItems from "./MenuItems"
const Dropdown = ({ submenus, dropdown, depthLevel, setDrawerOpen }) => {
  depthLevel = depthLevel + 1

  const dropdownSubmenuClass =
    // "absolute left-full top-[-7px] text-${depthLevel} bg-3";
    ""
  const dropdownClass0 = "z-10 ml-4 min-w-[10rem] rounded-sm text-sm shadow "
  const dropdownClass = depthLevel > 1 ? dropdownSubmenuClass : ""

  //Кольори для різних рівнів  //https://stackoverflow.com/questions/75565164/cannot-change-tailwind-styles-using-variables-in-react
  const colorLevel = {
    1: "text-[#0906f7]",
    2: "text-[#0a5ced]",
    // 3: "text-[#0c5ccf]",
    // 3: "text-[#0d5cba]",
    3: "text-[#0969ae]",
    4: "text-[#0c6998]",
    // 1: "text-[#0c6983]",
    // 5: "text-[#0c696c]",
    5: "text-[#0e6955]",
  }
  const colorStyle = colorLevel[depthLevel]

  return (
    //show-показати
    // <ul className={`dropdown ${dropdownClass} ${dropdown ? "show" : ""}`}>
    <ul className={`${dropdownClass0} ${dropdownClass} ${dropdown ? "block" : "hidden"} ${colorStyle}`}>
      {submenus.map((submenu, index) => (
        <MenuItems items={submenu} key={index} idKey={index} depthLevel={depthLevel} setDrawerOpen={setDrawerOpen} />
      ))}
    </ul>
  )
}

export default Dropdown
