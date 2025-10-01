// DatabaseContext.jsx
// Контекст для роботи з базою даних
"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { checkConnection } from "@/app/actions/dbActions" // імпорт функції перевірки

const DatabaseContext = createContext({
  isDatabaseReady: false,
  setIsDatabaseReady: () => {},
  checkDatabaseConnection: async () => false,
})

export function DatabaseProvider({ children }) {
  const [isDatabaseReady, setIsDatabaseReady] = useState(false)

  // Функція перевірки підключення
  const checkDatabaseConnection = async () => {
    try {
      const res = await checkConnection()
      setIsDatabaseReady(res)
      return res
    } catch (error) {
      setIsDatabaseReady(false)
      return false
    }
  }

  // При завантаженні можна одразу перевірити БД
  useEffect(() => {
    checkDatabaseConnection()
  }, [])

  return (
    <DatabaseContext.Provider
      value={{
        isDatabaseReady,
        setIsDatabaseReady,
        checkDatabaseConnection,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  )
}

export function useDatabase() {
  return useContext(DatabaseContext)
}
