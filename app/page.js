// import LayoutWithSidebar from "@/components/rozet/LayoutWithSidebar";
// import HomePage from "@/components/HomePage";
import WordsHome from "@/app/components/home/WordsHome"
import LandingInfo from './components/home/LandingInfo'

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-screen px-1">
      <WordsHome />
      <LandingInfo />
    </main>
  )
}
