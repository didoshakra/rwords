//app/About.js

import Image from "next/image"


const pageAboutMe_text1 = `Я — розробник-ентузіаст старшого покоління. Замість відпочинку на пенсії я з азартом опановую сучасні IT-технології, створення анімацій та інструменти штучного інтелекту. Для мене це не просто хобі, а спосіб тримати розум у тонусі, створювати щось нове й ділитися цим із світом.`

const pageAboutMe_text2 = `Щоб зробити вивчення мови зручним та інтерактивним, я розробив мобільний застосунок "RWords" для Android — із голосовим керуванням, персональними словниками та тренажером знань. А цей сайт створив як єдину платформу для синхронізації контенту, обміну навчальними матеріалами й спільного розвитку проєкту.`

const pageAboutMe_text3 = `Дякую за ваш інтерес до моєї роботи!`

const pageAboutMe_text4 = `Запрошую випробувати всі можливості сайту й застосунку. Буду щиро вдячний за ваші відгуки, ідеї та допомогу у вдосконаленні RWords!`

export const item = {
  title: "сайт RWords",
  //   image: "/images/home/group-young-business-people-working.jpg",
  image: "/images/home/RomanChernivci.jpg",
}

const About = () => {
  return (
    <section className="flex flex-col space-y-4 px-4 py-6 max-w-5xl mx-auto text-pOn dark:text-pOnD text-center font-body">
      <h1 className="text-h1On text-xl sm:text-2xl lg:text-3xl italic font-bold mb-4">Про мене</h1>

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
