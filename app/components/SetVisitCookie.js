// components/SetVisitCookie.js
"use client"

import { useEffect } from "react"

export default function SetVisitCookie() {
    console
  useEffect(() => {
    // Перевіряємо сесійну куку
    const hasVisited = sessionStorage.getItem("hasVisited")

    if (!hasVisited) {
      // Ставимо куку сесії
      sessionStorage.setItem("hasVisited", "true")

      // Викликаємо API роут
      fetch("/api/visit", {
        method: "POST",
      }).catch((err) => {
        console.error("Error incrementing visit:", err)
      })
    }
  }, [])

  return null
}
