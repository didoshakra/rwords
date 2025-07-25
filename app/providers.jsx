// app / providers.jsx

"use client"

import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/app/context/AuthContext"
import { DatabaseProvider } from "@/app/context/DatabaseContext"
import  ThemeProviders from "@/app/context/ThemeProviders"

export function Providers({ children }) {
  return (
    <ThemeProviders>
      <DatabaseProvider>
        <SessionProvider>
          <AuthProvider>{children}</AuthProvider>
        </SessionProvider>
      </DatabaseProvider>
    </ThemeProviders>
  )
}
