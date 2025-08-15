//About.js

import Image from "next/image"

const pageAboutMe_text1 = `"RWords" - це сайт, який дозволяє обмінюватись контентом для вивчення іноземних
слів за допомогою однойменного додатку для Android. Це місце, де люди, що вивчають мови, можуть ділитися знаннями та матеріалами.
Мета — отримати від користувачів реальні враження про додаток, щоб удосконалювати його та робити кориснішим. Буду вдячний за будь-який фідбек.`

const pageAboutMe_text2 = `Запрошуємо випробувати всі можливості нашого сайту і додатку. Надіюсь, ви не пошкодуєте!`

export const item = {
  title: "сайт RWords",
  image: "/images/home/group-young-business-people-working.jpg",
}

const About = () => {
  return (
    <section className="flex flex-col space-y-4 px-4 py-6 max-w-5xl mx-auto text-center font-body">
      <h2 className="text-xl sm:text-2xl lg:text-3xl italic font-bold mb-4">Про сайт і додаток RWords</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left items-start">
        <div className="relative w-full h-48 sm:h-60 md:h-96 col-span-1 rounded-lg overflow-hidden">
          <Image src={item.image} alt={item.title} fill className="object-cover" style={{ objectFit: "cover" }} />
        </div>

        <div className="col-span-2 space-y-3">
          <p className="text-sm sm:text-base lg:text-lg leading-relaxed font-medium">{pageAboutMe_text1}</p>
          <p className="text-sm sm:text-base lg:text-lg font-semibold leading-relaxed">{pageAboutMe_text2}</p>
        </div>
      </div>
    </section>
  )
}

export default About
