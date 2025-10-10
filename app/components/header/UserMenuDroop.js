//UserMenuDroop.js
//Саме випадаюче меню мови

import { useRef, useEffect } from "react"

const UserMenuDroop = ({ setUserMenuOpen, setSetingMenuOpen }) => {
  //    const [session] = useSession()

  //*************Для клацання поза обєктом
  const ref_UserMenuDroop = useRef(null)

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!ref_UserMenuDroop.current?.contains(event.target)) {
        // alert("Outside Clicked.");
        // console.log("Outside Clicked. ");
        // setSetingMenuOpen(false);
      }
    }

    window.addEventListener("mousedown", handleOutSideClick)

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick)
    }
  }, [ref_UserMenuDroop, setUserMenuOpen])

  const loginToggle = (e) => {
    // setLangMenuOpen(!langMenuOpen)
    e.preventDefault()
    // signIn();
    setUserMenuOpen(false)
    if (setSetingMenuOpen) setSetingMenuOpen(false)
  }
  const registrationToggle = (e) => {
    e.preventDefault()
    //  signOut()
    setUserMenuOpen(false)
    if (setSetingMenuOpen) setSetingMenuOpen(false)
  }

  const handleSignin = () => {
    console.log("UserMenuDroop.js/handleSignin")
    setUserMenuOpen(false)
    if (setSetingMenuOpen) setSetingMenuOpen(false)
  }

  return (
    <div ref={ref_UserMenuDroop} className="absolute right-0 z-10 m-0 p-0 text-base font-medium">
      <ul className="rounded-lg border border-hBorder bg-hBg  p-1 drop-shadow-md dark:border-hBorder dark:bg-hBgD">
        <li
          className="flex list-none flex-nowrap  items-center p-1  text-hOn  hover:bg-hBgHov  hover:text-hOnHov dark:text-hOnD dark:hover:bg-hBgHovD dark:hover:text-hOnHovD"
          onClick={loginToggle}
        >
          {/* {session && (
            <a href="#" onClick={loginToggle} className="btn-signin">
              Sign out/Вийти
            </a>
          )}
          {!session && (
            <a href="#" onClick={handleSignin} className="btn-signin">
              Sign in/Вхід
            </a>
          )} */}
          <a href="#" onClick={handleSignin} className="flex-nowrap">
            Sing in/ Вхід
          </a>
        </li>
        <li
          //   className="userMenuDroop__dropdown__item"
          className="flex list-none flex-nowrap  items-center p-1  text-hOn  hover:bg-hBgHov  hover:text-hOnHov dark:text-hOnD dark:hover:bg-hBgHovD dark:hover:text-hOnHovD"
          onClick={registrationToggle}
        >
          <a>Registration</a>
        </li>
        <li
          //   className="userMenuDroop__dropdown__item"
          className="flex list-none flex-nowrap  items-center p-1  text-hOn  hover:bg-hBgHov  hover:text-hOnHov dark:text-hOnD dark:hover:bg-hBgHovD dark:hover:text-hOnHovD"
          onClick={registrationToggle}
        >
          <a>Registration1</a>
        </li>
      </ul>
    </div>
  )
}

export default UserMenuDroop
