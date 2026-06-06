// SiteFooter.jsx
"use client"
import Image, { img } from "next/image"
import SocialLinks from "../../components/SocialLinks"

const SiteFooter = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-pBg dark:bg-pBgD text-pOn dark:text-pOnD border-t border-gray-200 dark:border-gray-700 mt-10">
      {/* <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between gap-8"> */}
      <div className="max-w-6xl px-4 py-10 flex flex-col md:flex-row justify-between gap-8">
        {/* Logo / Brand */}
        <div>
          <h1 className="text-2xl font-bold text-h1On mb-2">RWords</h1>
          <p className="text-sm max-w-xs">
            Застосунок для вивчення слів з голосовим керуванням, персональними словниками і оцінкою знань.
          </p>
        </div>

        {/* Контакти */}
        <div>
          <h3 className="text-h3On text text-lg sm:text-xl lg:text-2xl font-semibold mb-2">Контакти</h3>
          <ul className="space-y-1 text-sm">
            <li>📍 вул. Гулака, Калуш, Україна</li>
            <li>
              📞 <a href="tel:+380503739048">+38 (050) 373 90 48</a>
            </li>
            {/* <li>
              📞 <a href="tel:+380680000000">+38 (068) 000 00 00</a>
            </li> */}
            <li>
              ✉️ <a href="mailto:ra@gmail.com">ra@gmail.com</a>
            </li>
          </ul>
        </div>

        {/* Соцмережі */}
        <div>
          <h3 className="text-h3On text text-lg sm:text-xl lg:text-2xl font-semibold mb-2">Я в соцмережах</h3>
          <SocialLinks size="lg" ids={["github", "facebook", "instagram", "twitter"]} />
        </div>
      </div>

      <div className="al text-center py-4 border-t border-gray-300 dark:border-gray-600 text-sm flex flex-wrap justify-center items-center gap-1">
        <span>© {year} RWords. Усі права захищено.</span>
        <span className="inline-flex items-center gap-1 px-1">
          <Image src="/images/home/trident.png" alt="Тризуб" width={12} height={12} />
          <img src="https://flagcdn.com/w40/ua.png" alt="Прапор України" className="w-5 h-4 inline-block" />
          Все буде Україна! ❤️
        </span>
      </div>
    </footer>
  )
}

export default SiteFooter
