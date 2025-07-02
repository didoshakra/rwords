//TableMenuDroop.js
//Саме випадаюче меню мови

"use client"
import { useRef, useEffect, useState } from "react"
import TableMenuDroopAction from "./TableMenuDroopAction"
import TableMenuDroopSeting from "./TableMenuDroopSeting"

const TableMenuDroop = ({ setIsTableMenuDroop, fAction, setPSeting, pSeting, tableFontSize, setTableFontSize }) => {
  console.log("TableMenuDroop.js")

  //*************Для клацання поза обєктом
  const ref_TableMenuDroop = useRef(null)

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref_TableMenuDroop.current?.contains(event.target)) {
        // alert("Outside Clicked./TableMenuDroop");
        // console.log("Outside Clicked. ");
        // setSetingMenuOpen(false);
        setIsTableMenuDroop(false)
      }
    }

    window.addEventListener("mousedown", handleOutSideClick)

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick)
    }
  }, [ref_TableMenuDroop, setIsTableMenuDroop])
  //

  return (
    <div
      ref={ref_TableMenuDroop}
      className="absolute left-1 z-10 m-0 p-3 text-base font-medium bg-fBg dark:bg-fBgD  rounded-lg border border-fBorder dark:border-fBorderD"
    >
      <TableMenuDroopAction setIsTableMenuDroop={setIsTableMenuDroop} fAction={fAction} />
      <hr className="mt-3 h-0.5 min-w-full bg-drawDropHr" />
      <TableMenuDroopSeting
        pSeting={pSeting}
        setPSeting={setPSeting}
        tableFontSize={tableFontSize}
        setTableFontSize={setTableFontSize}
      />
    </div>
  )
}
export default TableMenuDroop
