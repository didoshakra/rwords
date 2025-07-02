import { useRef, useEffect } from "react"
import MenuSeting from "./MenuSeting"

export default function MenuSetingDrop({ setIsMenuSetingDrop, pSeting, setPSeting }) {
  //*************Для клацання поза обєктом
  const ref_MenuSetingDrop = useRef(null)

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref_MenuSetingDrop.current?.contains(event.target)) {
        // alert("Outside Clicked./MenuSetingDrop");
        // setSetingMenuOpen(false);
        setIsMenuSetingDrop(false)
      }
    }

    window.addEventListener("mousedown", handleOutSideClick)

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick)
    }
  }, [ref_MenuSetingDrop, setIsMenuSetingDrop])
  //
  return (
    <div
      ref={ref_MenuSetingDrop}
      className="absolute right-2  z-10 m-0 p-3 text-base font-medium bg-fBg1 dark:bg-fBgD  rounded-lg border border-hBorder dark:border-hBorderD"
    >
      <MenuSeting setPSeting={setPSeting} pSeting={pSeting} />
    </div>
  )
}
