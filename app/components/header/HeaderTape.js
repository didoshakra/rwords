//HeaderTape.js
"use client"
import { FaEye, FaDownload, FaFileAlt, FaMobileAlt } from "react-icons/fa"
import { useAuth } from "@/app/context/AuthContext"
import SocialLinks from '../SocialLinks'

const HeaderTape = ({ stats }) => {
  const { isFromApp } = useAuth()
  return (
    <div className="h-18 my-auto mt-1 flex w-full flex-col justify-start  overflow-hidden bg-hTapeBg px-1 text-sm text-hTapeOn dark:bg-hTapeBgD dark:text-hTapeOn md:h-6 md:flex-row md:justify-between md:px-2 ">
      <div className="flex justify-between space-x-1">
        <a className="flex items-center justify-start space-x-1  text-xs" href="tel:+380503739048">
          {/* <IconPhone width={iconSize} height={iconSize} colorFill="white" /> */}
          {/* phone */}
          <svg
            className="h-4 w-4 text-hTapeOn dark:text-hTapeOn"
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
          +38(050-3739048)
        </a>
        {/* <a className="flex items-center justify-start space-x-1 text-xs" href="tel:+38068-0000000">
          <svg
            className="h-4 w-4 text-hTapeOn dark:text-hTapeOn"
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
        </a> */}
      </div>

      {/* права сторона */}
      <div className="flex justify-between items-center text-center space-x-1 md:justify-end ">
        {/* Статистика */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="flex items-center space-x-1">
            {isFromApp ? <FaMobileAlt /> : <FaEye />} <span>{stats.site.visits}</span>
          </span>
          <span className="flex items-center space-x-1">
            <FaDownload /> <span>{stats.site.app_downloads}</span>
          </span>
          <span className="flex items-center space-x-1">
            <FaFileAlt /> <span>{stats.site.word_downloads}</span>
          </span>
        </div>
        {/* Соціальні мережі */}
        <SocialLinks size="sm" ids={["github", "x"]} />
      </div>
    </div>
  )
}

export default HeaderTape
