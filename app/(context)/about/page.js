//About.js

import Image from "next/image"
import { defaultMetadata } from "@/lib/seoConfig"

export const metadata = {
  ...defaultMetadata,
  title: "RWords — Про мене",
  description: "Дізнайтеся більше про автора застосунку RWords.",
  openGraph: {
    ...defaultMetadata.openGraph,
    url: "https://rwords.vercel.app/about",
    title: "RWords — Про мене",
    description: "Хто створив RWords і навіщо.",
    images: [
      {
        url: "https://rwords.vercel.app/og-default.png",
        width: 1200,
        height: 630,
        alt: "RWords Author Page",
      },
    ],
  },
}


const pageAboutMe_text1 = `Я — ентузіаст-розробник програмного забезпечення старшого (пенсійного) покоління, який "убиває" свій вільний час, вивчаючи нові технології програмування. Цей сайт і застосунок — спроба зробити щось корисне (і, можливо, не лише для себе), використовуючи JS, React, Next.js, React Native, PostgreSQL, MySQL та інші "примочки".`

const pageAboutMe_text2 = `Я створив мобільний застосунок "RWords" для Android — для вивчення іноземних слів із голосовим керуванням, персональними словниками та оцінкою знань. Він дозволяє оновлювати свій контент безпосередньо з цього сайту. Мета — ділитися контентом (словами, виразами, реченнями) з іншими користувачами й отримати допомогу у вдосконаленні додатку та створенні навчальних матеріалів.`

const pageAboutMe_text3 = `Дякую за Ваш інтерес!`

const pageAboutMe_text4 = `Запрошую випробувати всі можливості цього сайту і додатку. Надіюсь, ви не пошкодуєте!`

export const item = {
  title: "сайт RWords",
  //   image: "/images/home/group-young-business-people-working.jpg",
  image: "/images/home/RomanChernivci.jpg",
}

const About = () => {
  return (
    // <section className="flex flex-col space-y-4 px-4 py-6 max-w-5xl mx-auto text-pText dark:text-pTextD text-center font-body">
    //   <h1 className="text-h1Text text-xl sm:text-2xl lg:text-3xl italic font-bold mb-4">Про мене</h1>

    //   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left items-start">
    //     <div className="relative w-full h-48 sm:h-60 md:h-96 col-span-1 rounded-lg overflow-hidden">
    //       <Image src={item.image} alt={item.title} fill className="object-cover" style={{ objectFit: "cover" }} />
    //     </div>

    //     <div className="col-span-2 space-y-3">
    //       <p className="text-sm sm:text-base lg:text-lg leading-relaxed font-medium">{pageAboutMe_text1}</p>
    //       <p className="text-sm sm:text-base lg:text-lg leading-relaxed font-medium">{pageAboutMe_text2}</p>
    //       <p className="text-sm sm:text-base lg:text-lg leading-relaxed font-medium">{pageAboutMe_text3}</p>
    //       <p className="text-sm sm:text-base lg:text-lg font-semibold leading-relaxed">{pageAboutMe_text4}</p>
    //     </div>
    //   </div>
    // </section>
    <section className="flex flex-col space-y-4 px-4 py-6 max-w-5xl mx-auto text-pText dark:text-pTextD text-center font-body">
      <h1 className="text-h1Text text-xl sm:text-2xl lg:text-3xl italic font-bold mb-4">Про мене</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left items-start">
        <div className="relative w-full h-48 sm:h-60 md:h-96 col-span-1 rounded-lg overflow-hidden">
          <Image src={item.image} alt={item.title} fill className="object-cover" />
        </div>

        <div className="col-span-2 space-y-3">
          <p className="text-sm sm:text-base lg:text-lg leading-relaxed font-medium">{pageAboutMe_text1}</p>
          <p className="text-sm sm:text-base lg:text-lg leading-relaxed font-medium">{pageAboutMe_text2}</p>
          <p className="text-sm sm:text-base lg:text-lg leading-relaxed font-medium">{pageAboutMe_text3}</p>
          <p className="text-sm sm:text-base lg:text-lg font-semibold leading-relaxed">{pageAboutMe_text4}</p>
        </div>
      </div>
    </section>
  )
}

export default About
