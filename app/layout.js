// Layout
//новий стейт fromApp для збереження прапорця з сервера.
// Layout
// app/layout.jsx
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

// Робимо layout async
export default async function RootLayout({ children }) {
  const headersList = headers()
  const userAgent = headersList.get("user-agent") || ""
  const isFromApp = userAgent.includes("MyAppName") // твій унікальний підпис

  return (
    <html lang="en" className="light">
      <body suppressHydrationWarning className={`${inter.className} bg-bodyBg dark:bg-bodyBgD`}>
        {/* Передаємо прапорець isFromApp у Providers */}
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
