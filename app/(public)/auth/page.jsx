//CL/(public)/auth/page.js
"use client"

import React, { useState, useTransition } from "react"
import { registerUser, loginUser } from "@/app/actions/authActions"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"

export default function AuthPage() {
  const { login } = useAuth()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
//   const [mode, setMode] = useState("register") // or "login"
  const [mode, setMode] = useState("login") // or "login"
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")

    if (form.password.length < 6) {
      setMessage("Пароль має містити щонайменше 6 символів")
      return
    }

    if (mode === "register") {
      if (form.password !== form.confirmPassword) {
        setMessage("Паролі не співпадають")
        return
      }
    }

    startTransition(async () => {
      try {
        if (mode === "register") {
          const userData = await registerUser(form.name, form.email, form.password)
          login(userData)
        } else {
          const userData = await loginUser(form.email, form.password)
          login(userData)
        }

        setForm({ name: "", email: "", password: "", confirmPassword: "" })
        router.push("/")
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{mode === "login" ? "Форма входу" : "Форма реєстрації"}</h1>

      <form onSubmit={handleSubmit} autoComplete="off" autoSave="off" className="flex flex-col gap-4">
        {mode === "register" && (
          <input
            id="name"
            name="user_name" // уникаємо автозаповнення
            type="text"
            placeholder="Ім’я"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="border rounded p-2"
            autoComplete="off"
          />
        )}

        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email/example@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="border rounded p-2"
          autoComplete="email"
        />

        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Пароль"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="border rounded p-2 w-full pr-24"
            autoComplete="new-password" // щоб уникнути браузерних підказок
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600"
          >
            {showPassword ? "Приховати" : "Показати"}
          </button>
        </div>

        {mode === "register" && (
          <>
            <input
              type="password"
              placeholder="Підтвердження пароля"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
              className="border rounded p-2"
            />
          </>
        )}

        <button type="submit" disabled={isPending} className="bg-blue-600 text-white p-2 rounded">
          {isPending ? "Обробка..." : mode === "login" ? "Увійти" : "Зареєструватись"}
        </button>
      </form>

      <p className="mt-4 text-center">
        {mode === "login" ? (
          <>
            Немає акаунту?{" "}
            <button className="underline text-blue-600" onClick={() => setMode("register")}>
              Зареєструватись
            </button>
          </>
        ) : (
          <>
            Вже є акаунт?{" "}
            <button className="underline text-blue-600" onClick={() => setMode("login")}>
              Увійти
            </button>
          </>
        )}
      </p>

      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </main>
  )
}
