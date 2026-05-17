// app / providers.jsx
"use client"

import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/app/context/AuthContext"
import { DatabaseProvider } from "@/app/context/DatabaseContext"
import ThemeProviders from "@/app/context/ThemeProviders"
import { SettingsProvider } from "@/app/context/SettingsContext"

export function Providers({ children, isFromApp }) {
  return (
    <ThemeProviders>
      <DatabaseProvider>
        <SessionProvider>
          <AuthProvider isFromApp={isFromApp}>
            <SettingsProvider>{children}</SettingsProvider>
          </AuthProvider>
        </SessionProvider>
      </DatabaseProvider>
    </ThemeProviders>
  )
}



