//CL/context/AuthContext.jsx
// до новий стейт fromApp для збереження прапорця з сервера.
"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    try {
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser))
      }
    } catch (err) {
      console.error("Помилка JSON parse user:", err)
      localStorage.removeItem("user")
    }
  }, [])

  const login = (userData) => {
    if (userData) {
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
    } else {
      console.warn("login called with undefined userData")
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
