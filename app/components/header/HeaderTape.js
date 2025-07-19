//HeaderTape.js
// import IconPhone from "@/components/ui/icons/social/IconPhone";
// import { FaSun, FaMoon, FaPalette } from "react-icons/fa";

const HeaderTape = () => {
  return (
    <div className="h-18 mx-auto my-auto mt-1 flex w-full flex-col justify-start  overflow-hidden bg-hTapeBg px-1 text-sm text-hTapeText dark:bg-hTapeBgD dark:text-hTapeText md:h-6 md:flex-row md:justify-between md:px-2 ">
      <div className="flex justify-between space-x-1">
        <a className="flex items-center justify-start space-x-1 " href="tel:+380508580704">
          {/* <IconPhone width={iconSize} height={iconSize} colorFill="white" /> */}
          {/* phone */}
          <svg
            className="h-4 w-4 text-hTapeText dark:text-hTapeText"
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
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
          </svg>
          +38(050-0000000)
        </a>
        <a className="flex items-center justify-start space-x-1 text-sm" href="tel:+380687832306">
          <svg
            className="h-4 w-4 text-hTapeText dark:text-hTapeText"
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
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
          </svg>
          +38(068-0000000)
        </a>
      </div>

      {/* права сторона */}
      <div className="flex justify-between items-center text-center space-x-1 md:justify-end ">
        <div className="flex justify-start space-x-1">
          {/* GitHub */}
          <a
            className="flex items-center justify-start space-x-1 text-sm"
            href="https://github.com/didoshakra?tab=repositories"
            title="GitHub"
          >
            <svg
              className="h-4 w-4  dark:hover:text-hTextHovD"
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
          </a>
          {/* Х/Twitter */}
          <a
            className="flex items-center justify-start space-x-1 text-sm"
            href="https://x.com/RDidosak"
            title="Х/Twitter1"
          >
            <svg
              className="h-3 w-3 dark:hover:text-hTextHovD dark:group-hover:text-hTextHovD"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 1227"
              fill="currentColor"
            >
              <path d="M714.175 541.805 1182.5 0H1074.63L659.345 474.098 328.172 0H0l491.765 704.608L0 1227h107.872l436.93-493.422L888.979 1227H1217.15L714.175 541.805Zm-154.755 174.6-50.686-72.424L147.333 88.27h134.202l275.493 393.501 50.685 72.424 388.598 555.189H861.715L559.42 716.405Z" />
            </svg>
          </a>
          {/* IconInstagram */}
          <a
            className="flex items-center justify-start space-x-1 text-sm"
            href="https://www.instagram.com/didoshakr/"
            title="Instagram"
          >
            <svg
              className="h-4 w-4  dark:hover:text-hTextHovD dark:group-hover:text-hTextHovD"
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
          </a>
          {/* Facebook */}
          <a
            className="flex items-center justify-start space-x-1 text-sm"
            href="https://www.facebook.com/profile.php?id=100004339204236"
          >
            <svg
              className="h-4 w-4 "
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
          </a>
        </div>
        <span className="px-1 text-sm items-center">Next.js15/Tailwindcss/PgSQL</span>
      </div>
    </div>
  )
}

export default HeaderTape
