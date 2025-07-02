//HomePage.js / Muiv4.5.1

const WordsHome = () => {
  const disabled = false //Для buton
  //   const { state } = useContext(ComponentContext)
  //   const theme = state.theme

  return (
    // <section className="home-slider-section">
    <section className="relative h-[300px] md:h-[500px]">
      {/* елемент слайдеру */}
      <div
        className="absolute bottom-0 left-0 h-full w-full animate-[slideHome_5s_linear_infinite_alternate]
        items-center justify-center bg-[url('/images/mstan/travel-the-world-monument-concept.jpg')] bg-cover bg-center bg-no-repeat text-center"
      >
        <div className="flex h-full w-full flex-col items-center justify-center px-3 text-center align-middle">
          {/* <h1 className="items-center justify-center font-serif text-[30px] font-extrabold leading-normal text-hTextImg md:text-[70px]"> */}
          <h1 className="items-center justify-center font-serif text-[30px] font-extrabold leading-normal text-hTextImg md:text-[70px]">
            Вчіть слова щоб подорожувати
          </h1>
          {/* <h2 className="inline-block font-sans text-[10px] font-bold uppercase tracking-normal text-hTextImg1 md:text-[25px]"> */}
          <h2 className="inline-block font-sans text-[10px] font-bold uppercase tracking-normal text-hTextImg1  md:text-[25px]">
           Подорожуючи вчити легше
          </h2>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 h-full w-full animate-[slideHome_5s_5s_linear_infinite_alternate] items-center
        justify-center bg-[url('/images/mstan/young-diverse-couple-hikers-checking.jpg')] bg-cover bg-center bg-no-repeat text-center"
      >
        <div className="flex h-full flex-col items-center justify-center px-3 align-middle ">
          <h1 className="h-auto items-center justify-center  font-sans text-[30px] font-extrabold leading-normal text-hTextImg md:text-[70px]">
            Вчіть слова щоб спілкуватись
          </h1>
          <h2 className="inline-block font-sans text-[10px] font-bold uppercase tracking-normal text-hTextImg1  md:text-[25px]">
            Разом вчити приємніше
          </h2>
        </div>
      </div>
    </section>
  )
}
export default WordsHome
