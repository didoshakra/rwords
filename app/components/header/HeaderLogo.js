//HeaderLogo.js

import Link from "next/link"
import Image from "next/image"

const HeaderLogo = () => {
  return (
    // <div className="flex min-w-[200px] items-center  justify-start px-0 md:px-2  ">
    <div className="flex items-center  justify-start">
      <Link href="/" className="items-center ">
        <div className=" relative items-center h-10 w-16">
          <Image
            src="/images/home/sun_man_hands-oval-ra-red-64-41.png"
            height={41} //Завжди Avto?
            width={64} //Чомусь має пріорітет
            alt="Logo"
            priority
          />
        </div>
      </Link>
      <Link href="/">
        <div className="flex items-center justify-start px-1 text-xl sm:text-base lg:text-xl font-bold italic text-hText hover:text-hTextHov hover:bg-hBgHov dark:text-hTextD dark:hover:text-hTextHovD dark:hover:bg-hBgHovD gap-2">
          RWords
          <span style={{ fontSize: "14px"}}>(В роботі)</span>
        </div>
      </Link>
      {/* ========================================================================== */}
    </div>
  )
}
export default HeaderLogo
