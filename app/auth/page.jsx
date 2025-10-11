//CL/(public)/auth/page.js
"use client"

import React, { useState, useTransition } from "react"
import { signIn } from "next-auth/react"
import { registerUser } from "@/app/actions/authActions"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState("login")
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSocialSignIn = async (provider) => {
    try {
      //   const res = await signIn(provider, { redirect: false })
      const res = await signIn(provider, {
        callbackUrl: "/", // або інший шлях
      })
      if (res?.error) {
        setMessage(`Помилка входу через ${provider}: ${res.error}`)
      } else if (res?.url) {
        router.push(res.url)
      }
    } catch (error) {
      setMessage(`Несподівана помилка: ${error.message}`)
    }
  }

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
          // 1. Реєстрація юзера в базі через серверний екшен
          await registerUser(form.name, form.email, form.password)

          // 2. Автоматичний вхід через NextAuth credentials після реєстрації
          const res = await signIn("credentials", {
            redirect: false,
            email: form.email,
            password: form.password,
          })

          if (res?.error) {
            setMessage("Помилка входу після реєстрації: " + res.error)
            return
          }

          router.push("/")
        } else {
          // Вхід через NextAuth credentials
          const res = await signIn("credentials", {
            redirect: false,
            email: form.email,
            password: form.password,
          })

          if (res?.error) {
            setMessage("Помилка входу: " + res.error)
          } else {
            router.push("/")
          }
        }

        setForm({ name: "", email: "", password: "", confirmPassword: "" })
      } catch (err) {
        setMessage("Помилка: " + err.message)
      }
    })
  }

  const socialProviders = [
    {
      name: "google",
      label: "Google",
      color: "bg-red-700", //
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 48 48">
          <path
            fill="#fbc02d"
            d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.4-5.7 7.5-10.6 7.5-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1 7.4 2.9l5.7-5.7C33.6 8.4 29.1 6.5 24 6.5 13.8 6.5 5.5 14.8 5.5 25S13.8 43.5 24 43.5c10.2 0 18.5-8.3 18.5-18.5 0-1.6-.2-3-.4-4.5z"
          />
          <path
            fill="#e53935"
            d="M6.3 14.7l6.6 4.8C14.4 16 18.9 13.5 24 13.5c2.8 0 5.4 1 7.4 2.9l5.7-5.7C33.6 8.4 29.1 6.5 24 6.5c-7.2 0-13.4 3.8-17 9.5z"
          />
          <path
            fill="#4caf50"
            d="M24 43.5c5.1 0 9.6-1.9 13.1-5l-6-4.9c-2 1.5-4.6 2.4-7.1 2.4-4.9 0-9-3.1-10.6-7.5l-6.6 5.1c3.6 5.7 9.8 9.4 17.2 9.4z"
          />
          <path
            fill="#1565c0"
            d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.4-4.1 6.1-7.6 7.3l6 4.9C38 36.3 42 31.3 42 25c0-1.6-.2-3-.4-4.5z"
          />
        </svg>
      ),
    },
    {
      name: "github",
      label: "GitHub",
      color: "bg-gray-800",
      icon: (
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M12 .5C5.4.5 0 6 .5 12.3c.5 5.3 4 9.8 9.3 11.2.7.1 1-.3 1-.7v-2.6c-4.1.8-5-.9-5-2.2 0-.5-.3-1.1-.7-1.3-.5-.2-.5-.5 0-.5.6 0 1.1.5 1.3.7.6 1 .9 1.4 2 1.4s1.6-.3 2.2-.7c.5-.8.8-1.4 1-2-3.4-.4-6.8-1.7-6.8-7.3 0-1.4.5-2.7 1.3-3.7-.2-.3-.6-1.6.2-3 0 0 1.2-.4 3.7 1.4a13 13 0 0 1 6.6 0C18 3.5 19.2 4 19.2 4c.8 1.4.4 2.7.2 3 .8 1 1.3 2.3 1.3 3.7 0 5.6-3.4 6.9-6.8 7.3.9.7 1.4 2 1.4 3.2v3.1c0 .4.3.8 1 .7 5.3-1.4 8.8-5.9 9.3-11.2C24 6 18.6.5 12 .5z" />
        </svg>
      ),
    },
    // {
    //   name: "facebook",
    //   label: "Facebook",
    //   color: "bg-blue-700",
    //   icon: (
    //     <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
    //       <path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.5 9.9v-7H8v-3h2.5v-2.2c0-2.5 1.5-3.8 3.6-3.8 1 0 2 .1 2 .1v2.2H15c-1.2 0-1.6.8-1.6 1.6V12H17l-.5 3h-2v7c4.8-.8 8.5-4.9 8.5-9.9z" />
    //     </svg>
    //   ),
    // },
  ]

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-center text-h1On text-2xl font-bold mb-4">
        {mode === "login" ? "Форма входу" : "Форма реєстрації"}
      </h1>

      <div className="flex flex-col gap-2 mb-4">
        {socialProviders.map((p) => (
          <button
            key={p.name}
            onClick={() => handleSocialSignIn(p.name)}
            className={`${p.color} text-white py-2 px-4 rounded flex items-center justify-center gap-2 hover:opacity-90`}
          >
            <span>{p.icon}</span> <span>Увійти через {p.label}</span>
          </button>
        ))}
      </div>

      <div className="text-center my-4 text-pOn dark:text-pOnD ">або</div>

      <form onSubmit={handleSubmit} autoComplete="off" autoSave="off" className="flex flex-col gap-4">
        {mode === "register" && (
          <input
            id="name"
            name="user_name"
            type="text"
            placeholder="Ім’я"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            // className="p-2 border rounded text-fOn dark:text-fOnD bg-fBg dark:bg-fBgD border-fBorder
            //  hover:border-fBorderHov dark:hover:border-fBorderHovD
            //  focus:outline-none focus:ring-2 focus:fBorFocus"

            className="p-2 border rounded text-fOn dark:text-fOnD border-fBorder
            bg-fBg dark:bg-fBgD hover:border-fBorHov focus:border-2 focus:border-fBorFocus focus:outline-none"
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
          className="p-2 border rounded text-fOn dark:text-fOnD border-fBorder
            bg-fBg dark:bg-fBgD hover:border-fBorHov focus:border-2 focus:border-fBorFocus focus:outline-none"
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
            // className="border rounded p-2 w-full pr-24"
            className="p-2 w-full pr-24 border rounded text-fOn dark:text-fOnD border-fBorder
            bg-fBg dark:bg-fBgD hover:border-fBorHov focus:border-2 focus:border-fBorFocus focus:outline-none"
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

        {mode === "register" && (
          <input
            type="password"
            placeholder="Підтвердження пароля"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            required
            className="p-2 border rounded text-fOn dark:text-fOnD border-fBorder
            bg-fBg dark:bg-fBgD hover:border-fBorHov focus:border-2 focus:border-fBorFocus focus:outline-none"
          />
        )}

        <button
          type="submit"
          disabled={isPending}
          className="bg-bt1Bg dark:bg-bt1BgD text-bt1On dark:text-bt1OnD p-2 rounded"
        >
          {isPending ? "Обробка..." : mode === "login" ? "Увійти" : "Зареєструватись"}
        </button>
      </form>

      <p className="mt-4 text-pOn dark:text-pOnD text-center">
        {mode === "login" ? (
          <>
            Немає акаунту?{" "}
            <button className="underline linkOn" onClick={() => setMode("register")}>
              Зареєструватись
            </button>
          </>
        ) : (
          <>
            Вже є акаунт?{" "}
            <button className="underline text-linkOn" onClick={() => setMode("login")}>
              Увійти
            </button>
          </>
        )}
      </p>

      {message && <p className="mt-4 text-center text-errorMsg">{message}</p>}
    </main>
  )
}
