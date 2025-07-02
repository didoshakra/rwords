//DrawerSocialMenuDroop.js
//Меню в Drawer з Header

"use client"
import { useState } from "react"

const DrawerSocialMenuDroop = ({ setDrawerOpen }) => {
  const [drawerSocialMenuDroop, setDrawerSocialMenuDroop] = useState(false)

  //випадаюче меню Налаштувань
  const renderMenu = () => {
    return (
      <>
        <a
          className="m-1 space-x-2 flex list-none flex-nowrap  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
          href="https://www.facebook.com/profile.php?id=100004339204236"
          title="Facebook"
        >
          {/* Facebook */}
          <svg
            className="h-6 w-6  dark:hover:text-hTextHovD "
            //   className="h-6 w-6 text-hText dark:text-hTextD"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
          <p>Facebook</p>
        </a>
        <a
          className="m-1 space-x-2 flex list-none flex-nowrap  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
          href="https://github.com/didoshakra?tab=repositories"
          title="IconGitHub"
        >
          {/* GitHub */}
          <svg
            className="h-6 w-6  dark:hover:text-hTextHovD"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
          <p>GitHub</p>
        </a>
        <a
          className="m-1 space-x-2 flex list-none flex-nowrap  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
          href="https://twitter.com/home?lang=uk"
          title="Twitter"
        >
          {/* Twitter */}
          <svg
            className="h-6 w-6  dark:hover:text-hTextHovD "
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
          </svg>
          <p>Twitter</p>
        </a>
        <a
          className="m-1 space-x-2 flex list-none flex-nowrap  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
          href="https://www.facebook.com/profile.php?id=100017742340573"
          title="Instagram"
        >
          {/* IconInstagram */}
          <svg
            className="h-6 w-6  dark:hover:text-hTextHovD"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />{" "}
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /> <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          <p>Instagram</p>
        </a>
      </>
    )
  }

  return (
    <div className="m-0 items-center">
      <div
        className="w-fullroup flex list-none flex-nowrap items-center space-x-1 text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
        onClick={() => setDrawerSocialMenuDroop(!drawerSocialMenuDroop)}
        title="меню"
      >
        {/* іконка мобільного меню */}
        <p className="pl-2 text-lg font-medium italic  text-hText">Контакти</p>
        {drawerSocialMenuDroop ? (
          // стрілка вверх
          <svg
            className="h-6 w-6"
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
            <path stroke="none" d="M0 0h24v24H0z" /> <polyline points="6 15 12 9 18 15" />
          </svg>
        ) : (
          // стрілка вниз
          <svg
            className="h-6 w-6 "
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
            <path stroke="none" d="M0 0h24v24H0z" /> <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </div>

      <div className={`${drawerSocialMenuDroop ? "relative" : "hidden"}  text-base font-normal px-2`}>
        <div>{renderMenu()}</div>
      </div>
    </div>
  )
}

export default DrawerSocialMenuDroop
