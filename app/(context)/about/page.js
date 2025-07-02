//About.js

import Image from "next/image"

const pageAboutMe_text1 = `"RWords" - це сайт який дозволяє обміноватись контентом для вивчення іноземних
слів за допомогою однойменного додатку для Android.  Це сайт, на якому я хотів би <p>{"об'єднати"}</p> людей, які не тільки самі вивчають іноземні мови , але і готові
ділитися своїми знаннями і інформацією, щоб допомогти іншим засвоювати іноземні слова, фрази, речення і цілі розмовні теми. Я хочу щоб всі, хто зайде на саайт, скачає додаток і попробує його у використанні, не тільки  сказали "Не погано", "Досить не погано", або просто "Лажа". Я хочу,щоб всі ви якось повідомили мене про свої враження про додаток, і допомогли мені його удосконалити, у випадку коли ви будете вважати, що він зможе принести якусь користь. Буду дуже вдячний всім за зворотній звязок, не залежно від вашої оцінки. Краще раз попробувати і, можливо, пожаліти, ніж не попробувати і потім все життя жаліти`

const pageAboutMe_text2 = `Щоро запрошуємо випробувати всі можливості нашого сайту і додатку. Надіюсь Ви не пошкодуєте!!!`

export const item = {
  title: "сайт RWords",
  image: "/images/home/group-young-business-people-working.jpg",
}

const About = () => {
  //   console.log("About/item= ", item)
  return (
    <section className="flex flex-col space-y-3 px-2 pb-5 pt-5 text-center text-hText">
      <h2 className="text-4xl italic font-bold">Про сайт і додаток RWords</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-5 text-left items-start">
        <div className="relative w-full h-60 md:h-96 col-span-1">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="rounded-lg object-cover"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="col-span-2">
          <p className="text-2xl leading-8 tracking-wide font-medium">{pageAboutMe_text1}</p>
          <p className="text-xl pt-4 font-bold leading-6 tracking-wide">{pageAboutMe_text2}</p>
        </div>
      </div>
    </section>
  )
}

export default About
