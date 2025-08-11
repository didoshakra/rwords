// app / providers.jsx
//новий стейт fromApp для збереження прапорця з сервера

"use client"

import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/app/context/AuthContext"
import { DatabaseProvider } from "@/app/context/DatabaseContext"
import ThemeProviders from "@/app/context/ThemeProviders"

export function Providers({ children, isFromApp }) {
  return (
    <ThemeProviders>
      <DatabaseProvider>
        <SessionProvider>
          <AuthProvider isFromApp={isFromApp}>{children}</AuthProvider>
        </SessionProvider>
      </DatabaseProvider>
    </ThemeProviders>
  )
}

