// Layout
import "./globals.css"
import ThemeProviders from "./context/ThemeProviders"
import {DatabaseProvider} from "./context/DatabaseContext"
import { Inter } from "next/font/google"
// import Script from "next/script"//Google Analytics
import { SessionProvider } from "next-auth/react"

import HeaderTapeWrapper from './components/header/HeaderTapeWrapper'
// import HeaderTape from "@/app/components/header/HeaderTape"
import Header from "@/app/components/header/Header"
import SiteFooter from './components/header/SiteFooter'
import { AuthProvider } from "./context/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "RWords",
  description: "Мобільний додаток RWords для вивчення іноземних слів",
  icons: {
    icon: "/favicon.ico?v=2",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      {/* suppressHydrationWarning={true}//https://www.slingacademy.com/article/next-js-warning-extra-attributes-from-the-server/ */}
      <body suppressHydrationWarning={true} className={`inter.className bg-bodyBg dark:bg-bodyBgD`}>
        <ThemeProviders>
          <DatabaseProvider>
            {/* <SessionProvider> */}
              <AuthProvider>
                <HeaderTapeWrapper />
                <Header />
                {children}
                {/* <Footer /> */}
                <SiteFooter />
              </AuthProvider>
            {/* </SessionProvider> */}
          </DatabaseProvider>
        </ThemeProviders>
      </body>
    </html>
  )
}
