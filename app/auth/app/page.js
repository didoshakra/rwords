// app/auth/app/page.js
"use client"

import React, { useState, useTransition, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"

export default function AppAuthPage() {
  const { data: session, status } = useSession()
  const [form, setForm] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [appState, setAppState] = useState("idle") // idle | importing | done | error

  // Після логіну — повідомляємо додаток
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "rwords-auth-ok", userId: session.user.id }))
    }
  }, [status, session])

  // Слухаємо postMessage від додатку з даними для імпорту
  useEffect(() => {
    const handler = async (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type !== "rwords-export") return

        setAppState("importing")

        const res = await fetch("/api/app-import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            words: data.payload.words,
            topicName: data.payload.topicName, // назва теми з додатку
          }),
        })
        const result = await res.json()

        if (result.ok) {
          setAppState("done")
          window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "rwords-done", count: result.count }))
        } else {
          throw new Error(result.error)
        }
      } catch (err) {
        setAppState("error")
        setMessage(err.message || "Щось пішло не так")
        window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "rwords-error", message: err.message }))
      }
    }

    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage("")

    if (form.password.length < 6) {
      setMessage("Пароль має містити щонайменше 6 символів")
      return
    }

    startTransition(async () => {
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      })
      if (res?.error) {
        setMessage("Невірний email або пароль")
      }
      // після успіху — спрацює useEffect вище
    })
  }

  // --- Стани UI ---

  if (status === "loading") {
    return (
      <Screen>
        <Spinner />
        <p className="text-gray-400 mt-3">Завантаження...</p>
      </Screen>
    )
  }

  if (appState === "importing") {
    return (
      <Screen>
        <Spinner />
        <p className="text-gray-300 mt-3">Імпортуємо слова...</p>
      </Screen>
    )
  }

  if (appState === "done") {
    return (
      <Screen>
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-semibold text-white">Готово!</h2>
        <p className="text-gray-400 mt-2 text-center">Слова додано у розділ «З додатку»</p>
      </Screen>
    )
  }

  if (appState === "error") {
    return (
      <Screen>
        <div className="text-5xl mb-4">❌</div>
        <h2 className="text-xl font-semibold text-white">Помилка</h2>
        <p className="text-red-400 mt-2 text-center">{message}</p>
      </Screen>
    )
  }

  if (status === "authenticated") {
    return (
      <Screen>
        <div className="text-5xl mb-4">👤</div>
        <h2 className="text-xl font-semibold text-white">{session.user.name}</h2>
        <p className="text-gray-400 mt-1">{session.user.email}</p>
        <div className="mt-6 flex items-center gap-2 text-green-400 text-sm">
          <Spinner small />
          <span>Очікуємо дані з додатку...</span>
        </div>
      </Screen>
    )
  }

  // Форма логіну
  return (
    <Screen>
      <h1 className="text-2xl font-bold text-white mb-6 text-center">Вхід до RWords</h1>

      {message && <p className="text-red-400 text-sm mb-4 text-center">{message}</p>}

      <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-3 w-full max-w-xs">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="p-2 border rounded text-fOn dark:text-fOnD border-fBorder
            bg-fBg dark:bg-fBgD hover:border-fBorHov focus:border-2
            focus:border-fBorFocus focus:outline-none"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Пароль"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="p-2 w-full pr-24 border rounded text-fOn dark:text-fOnD border-fBorder
              bg-fBg dark:bg-fBgD hover:border-fBorHov focus:border-2
              focus:border-fBorFocus focus:outline-none"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-linkOn"
          >
            {showPassword ? "Приховати" : "Показати"}
          </button>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-bt1Bg dark:bg-bt1BgD text-bt1On dark:text-bt1OnD p-2 rounded"
        >
          {isPending ? "Обробка..." : "Увійти"}
        </button>
      </form>
    </Screen>
  )
}

// Layout без хедера/футера
function Screen({ children }) {
  return <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">{children}</div>
}

function Spinner({ small = false }) {
  return (
    <div
      className={`${small ? "w-4 h-4 border-2" : "w-10 h-10 border-4"}
        border-blue-500 border-t-transparent rounded-full animate-spin`}
    />
  )
}
 