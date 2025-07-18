//CL/context/AuthContext.jsx
"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser && storedUser !== "undefined" && storedUser !== "null" && storedUser.trim() !== "") {
        const parsed = JSON.parse(storedUser)
        setUser(parsed)
      } else {
        localStorage.removeItem("user")
      }
    } catch (err) {
      console.error("❌ Помилка JSON.parse user:", err)
      localStorage.removeItem("user")
    }
  }, [])

  const login = (userData) => {
    if (userData) {
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
    } else {
      console.warn("⚠️ login called with undefined or null userData")
      logout()
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
