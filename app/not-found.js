//not-found.js
import Link from "next/link"

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-300 to-yellow-200 text-center p-8">
      <h1 className="text-6xl font-bold text-blue-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-blue-900 mb-2">Сторінку не знайдено</h2>
      <p className="text-lg text-gray-800 mb-6 max-w-md">
        Йой... Здається, такої сторінки не існує або вона в розробці. Перевір адресу або повернись назад.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-blue-600 text-yellow-100 font-semibold rounded-full shadow-md hover:bg-blue-700 transition"
      >
        Повернутись на головну
      </Link>

      <div className="mt-12 text-sm text-gray-700 italic">🇺🇦 Все буде Україна!</div>
    </div>
  )
}
