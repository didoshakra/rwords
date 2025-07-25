//CL/context/AuthContext.jsx
"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useSession, signOut as nextAuthSignOut } from "next-auth/react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { data: session, status } = useSession()
  const [localUser, setLocalUser] = useState(null)

  // Юзер: якщо next-auth авторизований — беремо з сесії, інакше з локального стану
  const user = status === "authenticated" ? session.user : localUser

  useEffect(() => {
    if (status === "unauthenticated") {
      // Якщо next-auth вийшов, то дивимось локальний юзер
      const storedUser = localStorage.getItem("user")
      if (storedUser && storedUser !== "undefined") {
        try {
          setLocalUser(JSON.parse(storedUser))
        } catch {
          localStorage.removeItem("user")
          setLocalUser(null)
        }
      } else {
        setLocalUser(null)
      }
    } else if (status === "authenticated") {
      setLocalUser(null) // чистимо локального, бо юзер через NextAuth
    }
  }, [status])

  const loginLocal = (userData) => {
    setLocalUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    if (status === "authenticated") {
      nextAuthSignOut()
    } else {
      setLocalUser(null)
      localStorage.removeItem("user")
    }
  }

  return (
    <AuthContext.Provider value={{ user, loginLocal, logout, isNextAuth: status === "authenticated" }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
