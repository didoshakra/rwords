//Footer.js ff
"use client"

const Footer = () => {
  return (
    <section className="mx-auto max-w-full bg-bodyBg dark:bg-bodyBgD">
      <div className=" flex items-center justify-center p-1">
        {/* стрілка */}
        <a
          href="#"
          className=" flex h-[60px] w-[60px]  items-center justify-center  rounded-full border-0 border-current bg-hBg  hover:bg-hBgHov dark:bg-hBg dark:hover:bg-hBgHovD"
        >
          <svg
            className="h-10 w-10 text-hText"
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
        </a>
      </div>
      <div className="flex w-full flex-col items-start justify-between pt-10 md:flex-row">
        <div className="relative flex flex-col items-start justify-start text-left">
          <h2 className="flex flex-row items-center justify-center px-4 text-lg font-bold text-hText dark:text-hTextD">
            RAtest
          </h2>
          <ul className="flex items-center justify-between">
            <li className="flex  flex-row items-center justify-start px-4">
              <a
                className="group flex list-none flex-nowrap items-center space-x-1 p-1 text-hText  hover:text-hTextHov dark:text-hTextD  dark:hover:text-hTextHovD"
                href="https://www.facebook.com/profile.php?id=100017742340573"
              >
                {/* Facebook */}
                <svg
                  className="h-6 w-6 "
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
            </li>
          </ul>
        </div>

        <div className="relative flex flex-col items-start justify-start py-2 text-left">
          <h2 className="flex  flex-row items-center justify-center px-4 text-lg font-bold text-hText dark:text-hTextD">
            Є запитання?
          </h2>
          <ul className="text-hText dark:text-hTextD">
            <li className="flex  flex-row items-center justify-start px-4 text-sm">
              <svg className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="px-2"> вул. Гулака , Калуш, Україна</span>
            </li>
            <li className="flex  flex-row items-center justify-start px-4 text-sm">
              {/* phone */}
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
                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
              </svg>
              <a className="px-2" href="tel:+380500000000">
                + 38(050-0000000)
              </a>
            </li>
            <li className="flex  flex-row items-center justify-start px-4 text-sm">
              {/* phone */}
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
                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
              </svg>
              <a className="px-2" href="tel:+380680000000">
                + 38(068-0000000)
              </a>
            </li>
            <li className="flex  flex-row items-center justify-start px-4 text-sm">
                {/* почна */}
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
                <path stroke="none" d="M0 0h24v24H0z" /> <rect x="3" y="5" width="18" height="14" rx="2" />{" "}
                <polyline points="3 7 12 13 21 7" />
              </svg>
              <span type="button" className="px-2">ra@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex w-full flex-row items-center justify-center pt-10 text-hText dark:text-hTextD">
        Copyright © {new Date().getFullYear()}-{new Date().getMonth()}-{new Date().getDate()}
        {/* Серце*/}
        <svg
          className=" h-6 w-6"
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
          <path d="M12 20l-7 -7a4 4 0 0 1 6.5 -6a.9 .9 0 0 0 1 0a4 4 0 0 1 6.5 6l-7 7" />
        </svg>
      </div>
    </section>
  )
}
export default Footer
