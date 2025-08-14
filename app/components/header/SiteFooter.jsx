// SiteFooter.jsx
"use client"
import {img} from "next/image"

const SiteFooter = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-bodyBg dark:bg-bodyBgD text-hText dark:text-hTextD border-t border-gray-200 dark:border-gray-700 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between gap-8">
        {/* Logo / Brand */}
        <div>
          <h2 className="text-2xl font-bold text-hText dark:text-hTextD mb-2">RWords</h2>
          <p className="text-sm max-w-xs">
            Додаток для вивчення слів з голосовим керуванням і персональними словниками.
          </p>
        </div>

        {/* Контакти */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Контакти</h3>
          <ul className="space-y-1 text-sm">
            <li>📍 вул. Гулака, Калуш, Україна</li>
            <li>
              📞 <a href="tel:+380500000000">+38 (050) 000 00 00</a>
            </li>
            <li>
              📞 <a href="tel:+380680000000">+38 (068) 000 00 00</a>
            </li>
            <li>
              ✉️ <a href="mailto:ra@gmail.com">ra@gmail.com</a>
            </li>
          </ul>
        </div>

        {/* Соцмережі */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Ми в соцмережах</h3>
          <ul className="flex space-x-4 items-center">
            <li>
              {/* GitHub */}
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
                href="https://www.facebook.com/profile.php?id=100004339204236"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-hTextHov dark:hover:text-hTextHovD"
              >
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </li>
            <li>
              {/* IconInstagram */}
              <a
                className="flex items-center justify-start space-x-1 text-sm"
                href="https://www.instagram.com/didoshakr/"
                title="Instagram"
              >
                <svg
                  className="h-6 w-6  dark:hover:text-hTextHovD dark:group-hover:text-hTextHovD"
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
            </li>
            <li>
              <a
                className="flex items-center justify-start space-x-1 text-sm"
                href="https://x.com/RDidosak"
                title="Х/Twitter"
              >
                <svg
                  className="h-5 w-5 dark:hover:text-hTextHovD dark:group-hover:text-hTextHovD"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1200 1227"
                  fill="currentColor"
                >
                  <path d="M714.175 541.805 1182.5 0H1074.63L659.345 474.098 328.172 0H0l491.765 704.608L0 1227h107.872l436.93-493.422L888.979 1227H1217.15L714.175 541.805Zm-154.755 174.6-50.686-72.424L147.333 88.27h134.202l275.493 393.501 50.685 72.424 388.598 555.189H861.715L559.42 716.405Z" />
                </svg>
              </a>
            </li>
            {/* Додати інші соцмережі при потребі */}
          </ul>
        </div>
      </div>

      <div className="text-center py-4 border-t border-gray-300 dark:border-gray-600 text-sm">
        © {year} RWords. Усі права захищено.
        <span className="inline-flex items-center gap-1 px-1">
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 417" width="20" height="33" fill="#005BBB">
            <path d="M127.88 0l-9.1 43.17-37.32 14.42v30.87L70 88l-14 11-7.4 39 14 12 20-20 19-1-4 24-12 16-35 20-7 16 15 13 40-25 39 25 15-13-7-16-36-20-12-16-4-24 19 1 20 20 14-12-7-39-14-11 17-7 8-7v-30l-38-15z" />
          </svg> */}
          <img src="/images/home/trident.png" alt="Тризуб" width={12} height={12} />
          <img src="https://flagcdn.com/w40/ua.png" alt="Прапор України" className="w-5 h-4 inline-block" />
          {"  "}Все буде Україна! ❤️
        </span>
        {/* <span className="mt-12 text-sm text-gray-700 italic">🇺🇦 Все буде Україна!</span> */}
      </div>
    </footer>
  )
}

export default SiteFooter
