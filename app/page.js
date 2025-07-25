// app/page.js
import SetVisitCookie from "@/app/components/SetVisitCookie"
import WordsHome from "@/app/components/home/WordsHome"
import LandingInfo from "@/app/components/home/LandingInfo"

export default function Home() {
  return (
    <>
      <SetVisitCookie />
      <main className="mx-auto min-h-screen w-screen px-1">
        <WordsHome />
        <LandingInfo />
      </main>
    </>
  )
}