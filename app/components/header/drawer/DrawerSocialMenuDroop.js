//DrawerSocialMenuDroop.js
//Меню в Drawer з Header

"use client"
import { useState } from "react"

const DrawerSocialMenuDroop = () => {
  const [drawerSocialMenuDroop, setDrawerSocialMenuDroop] = useState(false)

  //випадаюче меню Налаштувань
  const renderMenu = () => {
    return (
      <ul className="flex space-x-4 items-center">
        <li>
          <a
            className="m-1 space-x-2 flex list-none flex-nowrap  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
            href="https://github.com/didoshakra?tab=repositories"
            title="GitHub"
          >
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
            {/* <p>GitHub</p> */}
          </a>
        </li>
        <li>
          <a
            className="m-1 space-x-2 flex list-none flex-nowrap  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
            href="https://www.facebook.com/profile.php?id=100004339204236"
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook"
          >
            <svg
              className="h-6 w-6  dark:hover:text-hTextHovD"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            {/* <p>facebook</p> */}
          </a>
        </li>
        <li>
          {/* IconInstagram */}
          <a
            className="m-1 space-x-2 flex list-none flex-nowrap  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
            href="https://www.instagram.com/didoshakr/"
            title="Instagram"
          >
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
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />{" "}
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />{" "}
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            {/* <p>Instagram</p> */}
          </a>
        </li>
        <li>
          <a
            className="m-1 space-x-2 flex list-none flex-nowrap  items-center text-base font-normal text-hText  hover:bg-hBgHov  hover:text-hTextHov dark:text-hTextD dark:hover:bg-hBgHovD dark:hover:text-hTextHovD"
            href="https://x.com/RDidosak"
            title="Х/Twitter"
          >
            <svg
              className="h-4 w-4  dark:hover:text-hTextHovD"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 1227"
              fill="currentColor"
            >
              <path d="M714.175 541.805 1182.5 0H1074.63L659.345 474.098 328.172 0H0l491.765 704.608L0 1227h107.872l436.93-493.422L888.979 1227H1217.15L714.175 541.805Zm-154.755 174.6-50.686-72.424L147.333 88.27h134.202l275.493 393.501 50.685 72.424 388.598 555.189H861.715L559.42 716.405Z" />
            </svg>
            {/* <p>Х/Twitter</p> */}
          </a>
        </li>
        {/* Додати інші соцмережі при потребі */}
      </ul>
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
