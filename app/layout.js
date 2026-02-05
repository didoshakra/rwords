// app/layout.jsx
//Так як layout є серверним компонентом — він отримає статистику і передасть її в HeaderTape і не треба створювати обгортку HeaderTapeWrapper.js
/* =================== */
/* 2️⃣ Підключення тем */
/* =================== */
/* ВСЕ @import має бути тут, поза @layer */
import "@/styles/themes/tIndigo.css";
import "@/styles/themes/tPink.css";
import "@/styles/themes/tGreen.css";
import "@/styles/themes/tAmber.css";
import "@/styles/themes/tGray.css";
import "@/styles/themes/tLime.css";
import "@/styles/themes/tRed.css";
import "@/styles/themes/tYellow.css";
import "@/styles/themes/tEmerald.css";
import "@/styles/themes/tTeal.css";
import "@/styles/themes/tCyan.css";
import "@/styles/themes/tSky.css";
import "@/styles/themes/tBlue.css";
import "@/styles/themes/tViolet.css"; 
import "@/styles/themes/tPurple.css";
import "@/styles/themes/tFuchsia.css";
import "@/styles/themes/tRose.css";
import "@/styles/themes/tOrange.css";
import "@/styles/themes/tZinc.css";
import "@/styles/themes/tNeutral.css";
import "@/styles/themes/tStone.css";
import "./globals.css"
import { Inter } from "next/font/google"
import { headers } from "next/headers"
import { Providers } from "./providers"
import Header from "@/app/components/header/Header"
import SiteFooter from "./components/header/SiteFooter"
import HeaderTape from "./components/header/HeaderTape"
import { getStats } from "@/app/actions/statsActions"
import { defaultMetadata } from "@/lib/seoConfig"

export const metadata = defaultMetadata

const inter = Inter({
  subsets: ["latin"], // потрібний підмножина
  display: "swap", // зменшує FOUT/FOIT
  variable: "--font-inter", // опціонально для використання через CSS var
})

// Робимо layout async
export default async function RootLayout({ children }) {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") || ""
  const isFromApp = userAgent.includes("RWords/1.0.0 (ReactNative)") // твій унікальний підпис
  const stats = await getStats() // Server action

  return (
    <html lang="en" className="light">
      <body suppressHydrationWarning className={`${inter.className} bg-pBg dark:bg-pBgD`}>
        {/* Передаємо прапорець isFromApp у Providers */}
        <Providers isFromApp={isFromApp}>
          {/* <HeaderTapeWrapper /> */}
          <HeaderTape stats={stats} />
          <Header />
          {/* Головний контейнер */}
          <div className=" overflow-hidden">{children}</div>
          {/* <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">{children}</main> */}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}
