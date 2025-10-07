// app/page.js
import SetVisitCookie from "@/app/components/SetVisitCookie"
import WordsHome from "@/app/components/home/WordsHome"
import LandingInfo from "@/app/components/home/LandingInfo"


export default function Home() {
  return (
    <>
      <SetVisitCookie />
       <div className="relative w-screen left-1/2 -translate-x-1/2">
        <WordsHome />
      </div>
      <main className="mx-auto min-h-screen px-1">
        <LandingInfo />
      </main>
    </>
  )
}