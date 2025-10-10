//Для проби багаторівневого меню
import MenuItems from "./MenuItems"

export default function Navbar({ multilevelMenu, title = "", setDrawerOpen }) {
  // console.log("Navbar/multilevelMenu=", multilevelMenu);
  return (
    <nav>
      <div
        onClick={(e) => setDrawerOpen(false)}
        // className="dark:text-hOnD text-hOn  pl-2 text-base  font-bold italic"
        className="pl-2 text-lg font-medium italic  text-hOn dark:text-hOnD "
      >
        {title}
      </div>
      <ul className="bg-drawDropMenuBg gap-3 pl-4 font-bold text-[#3e77aa] dark:bg-drawDropMenuBgD">
        {/* <ul className=" gap-3 bg-green-400 pl-2 font-bold text-cyan-600  underline"> */}
        {/* {multilevelMenu.map((menu, key = menu.id) => { */}
        {multilevelMenu.map((menu, index) => {
          //   console.log("Navbar/index=", index);
          const depthLevel = 0
          return (
            <MenuItems items={menu} key={index} idKey={index} depthLevel={depthLevel} setDrawerOpen={setDrawerOpen} />
          )
        })}
      </ul>
    </nav>
  )
}
