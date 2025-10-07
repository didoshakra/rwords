// app/page.js
import SetVisitCookie from "@/app/components/SetVisitCookie"
import WordsHome from "@/app/components/home/WordsHome"
import LandingInfo from "@/app/components/home/LandingInfo"
import { defaultMetadata } from "@/lib/seoConfig"

export const metadata = {
  ...defaultMetadata,
  title: "Вивчення іноземних  слів прослуховуванням",
  description: "Керуйте вивченням слів з допомогою голосових команд. Викидайте вивчені слова.",
  openGraph: {
    ...defaultMetadata.openGraph,
    url: "https://rwords.vercel.app",
    title: "Вчіться іноземних слів з RWords",
    description: "Вивчайте нові слова та фрази з RWords.",
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