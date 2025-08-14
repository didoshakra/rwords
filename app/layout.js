// app/layout.jsx
//Так як layout є серверним компонентом — він отримає статистику і передасть її в HeaderTape і не треба створювати обгортку HeaderTapeWrapper.js
import "./globals.css"
import { Inter } from "next/font/google"
import { headers } from "next/headers"
import { Providers } from "./providers"
import Header from "@/app/components/header/Header"
import SiteFooter from "./components/header/SiteFooter"
import HeaderTape from "./components/header/HeaderTape"
import { getStats } from "@/app/actions/statsActions"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "RWords",
  description: "Мобільний додаток RWords для вивчення іноземних слів",
  icons: {
    icon: "/favicon.ico?v=2",
  },
}

// Робимо layout async
export default async function RootLayout({ children }) {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") || ""
  const isFromApp = userAgent.includes("RWords/1.0.0 (ReactNative)") // твій унікальний підпис
  const stats = await getStats() // Server action

  return (
    <html lang="en" className="light">
      <body suppressHydrationWarning className={`${inter.className} bg-bodyBg dark:bg-bodyBgD`}>
        {/* Передаємо прапорець isFromApp у Providers */}
        <Providers isFromApp={isFromApp}>
          {/* <HeaderTapeWrapper /> */}
          <HeaderTape stats={stats} />
          <Header />
          {/* Головний контейнер */}
          <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}
