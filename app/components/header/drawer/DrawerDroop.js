//Drawer.js

import Image from "next/image"
import Link from "next/link"
// import { menuAdmin, menuDocuments, menuBig } from "@/components/multiLevelMenu/dataMultilevelMenu"
// import Navbar from "@/components/multiLevelMenu/Navbar"
import DrawerHeaderMenuDroop from './DrawerHeaderMenuDroop'
import DrawerSocialMenuDroop from "@/app/components/header/drawer/DrawerSocialMenuDroop"
import DrawerAdminMenuDroop from "@/app/components/header/drawer/DrawerAdminMenuDroop"
//***************************************************************** */
export default function DrawerDroop({ drawerOpen, setDrawerOpen }) {
  //
  return (
    <div
      //Виїжджає Зправа
      //   className={`fixed right-0 top-0 z-20 flex h-full w-[35vw] flex-col overflow-y-scroll  bg-drawDropMenuBg dark:bg-headMenuBgDark ${
      //     drawerOpen ? "translate-x-0" : "translate-x-full"
      //   } duration-300 ease-in-out `}
      //Виїжджає Зліва
      className={`top-50 fixed -left-[100vw] z-20 flex h-full w-[100vw] flex-col overflow-y-scroll bg-drawDropMenuBg dark:bg-drawDropMenuBgD  md:-left-[30vw] md:w-[30vw] ${
        drawerOpen ? "translate-x-full" : "translate-x-0"
      } duration-500 ease-in-out `}
    >
      {/* <div className="w-full/5 fixed inset-0 z-20 flex max-h-[600px] max-w-[300px] flex-col overflow-y-scroll bg-drawerDropMenuBg transition-transform duration-200 ease-out dark:bg-drawDropMenuBgD"> */}
      {/* Шапка */}
      <div className="flex h-20 items-center justify-between gap-1">
        <div className="flex items-center justify-between gap-2 pl-1" onClick={(e) => setDrawerOpen(false)}>
          <Link href="/">
            <Image title="rwo" width={70} height={70} src="/images/home/sun_man_mount-380-RA-Algerian.png" alt="logo" />
          </Link>
          <Link
            href="/"
            className="justify-begin  flex items-center px-4 text-2xl font-bold italic text-hText  dark:text-hTextD md:text-2xl"
            title="RWORDS"
          >
            RWords
          </Link>
        </div>
        <div onClick={(e) => setDrawerOpen(false)} className="pr-2">
          {/* <IconCancel */}
          <svg
            className="h-6 w-6 text-hText dark:text-hTextD"
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
            <path stroke="none" d="M0 0h24v24H0z" /> <line x1="18" y1="6" x2="6" y2="18" />{" "}
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
      </div>
      {/* --- Список меню --<hr Divider/Роздільник-------------------------------- */}
      <hr className="h-0.5 min-w-full mt-2 bg-drawDropHr" />
      <DrawerHeaderMenuDroop setDrawerOpen={setDrawerOpen} />
      {/* ----------------------------------------------------------- */}
      <hr className="h-0.5 min-w-full bg-drawDropHr" />
      <DrawerAdminMenuDroop setDrawerOpen={setDrawerOpen} />
      {/* ----------------------------------------------------------- */}
      <hr className="h-0.5 min-w-full bg-drawDropHr" />
      {/* ----------------------------------------------------------- */}
      <DrawerSocialMenuDroop />
      {/* <Navbar multilevelMenu={menuBig} title={"Багаторівнневе пробне меню"} setDrawerOpen={setDrawerOpen} /> */}
      {/* <hr className="h-0.5 min-w-full bg-drawDropHr" /> */}
      {/* <hr className="h-0.5 min-w-full bg-drawDropHr" /> */}
      {/* <Navbar multilevelMenu={menuAdmin} title={"Адмін"} setDrawerOpen={setDrawerOpen} /> */}
      {/* ----------------------------------------------------------- */}
      {/* <hr className="h-0.5 min-w-full bg-drawDropHr" /> */}
      {/* <Navbar multilevelMenu={menuDocuments} title={"Документи"} setDrawerOpen={setDrawerOpen} /> */}
    </div>
  )
}
