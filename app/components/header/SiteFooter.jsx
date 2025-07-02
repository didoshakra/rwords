// SiteFooter.jsx
"use client"

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
          <ul className="flex space-x-4">
            <li>
              <a
                href="https://www.facebook.com/profile.php?id=100017742340573"
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
            {/* Додати інші соцмережі при потребі */}
          </ul>
        </div>
      </div>

      <div className="text-center py-4 border-t border-gray-300 dark:border-gray-600 text-sm">
        © {year} RWords. Усі права захищено.
        <span className="inline-block px-1">❤️</span>
      </div>
    </footer>
  )
}

export default SiteFooter
