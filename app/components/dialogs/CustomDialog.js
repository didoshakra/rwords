// Components/dialogs/CustomDialog.js//Діалогове вікно з кастомними кнопками
// Кнопки діалогу замість confirm
import React from "react"

export default function CustomDialog({ open, title, message, buttons = [], onResult, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close modal"
        >
          ×
        </button>
        {title && <h2 className="text-lg font-semibold mb-4 dark:text-white">{title}</h2>}
        <div className="mb-4 dark:text-gray-200">{message}</div>
        <div className="flex flex-col gap-2 mt-4">
          {buttons.map((btn, i) => (
            <button
              key={i}
              className={
                btn.className ||
                `px-4 py-3 rounded-lg transition-colors duration-150 w-full font-medium
                ${
                  i === 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : i === buttons.length - 1
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`
              }
              onClick={() => onResult(i)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}