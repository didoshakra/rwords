// Layout
import "./globals.css"
import ThemeProviders from "./context/ThemeProviders"
import { Inter } from "next/font/google"
import HeaderTape from "@/app/components/header/HeaderTape"
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
          <HeaderTape />
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
          {/* <Footer /> */}
          <SiteFooter />
        </ThemeProviders>
      </body>
    </html>
  )
}
