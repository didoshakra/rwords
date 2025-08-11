// Layout
//новий стейт fromApp для збереження прапорця з сервера.
// Layout
import "./globals.css"

import { Inter } from "next/font/google"
import { Providers } from "./providers"
import HeaderTapeWrapper from "./components/header/HeaderTapeWrapper"
import Header from "@/app/components/header/Header"
import SiteFooter from "./components/header/SiteFooter"
import { headers } from "next/headers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "RWords",
  description: "Мобільний додаток RWords для вивчення іноземних слів",
  icons: {
    icon: "/favicon.ico?v=2",
  },
}

export default function RootLayout({ children }) {
  // Server Component: визначаємо user-agent
  const userAgent = headers().get("user-agent") || ""
  const isFromApp = userAgent.includes("MyAppName")

  return (
    <html lang="en" className="light">
      <body suppressHydrationWarning={true} className={`${inter.className} bg-bodyBg dark:bg-bodyBgD`}>
        <Providers isFromApp={isFromApp}>
          <HeaderTapeWrapper />
          <Header />
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}
