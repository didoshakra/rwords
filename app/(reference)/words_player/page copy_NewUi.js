// pages/words.js
//words_player/page.js// із чіткою асинхронною логікою озвучування, окремими паузами і керуванням циклом.
// Не працює speak(current.word
"use client"

import { useState } from "react"
import Script from "next/script"

export default function WordsPage() {
  const [isStarted, setIsStarted] = useState(false)
  const [wordData, setWordData] = useState([
    { word: "apple", translation: "яблуко", img: "apple.jpg", know: 1 },
    { word: "dog", translation: "пес", img: "dog.jpg", know: 0 },
  ])
  const [wordIndex, setWordIndex] = useState(0)
  const [showImg, setShowImg] = useState(true)
  const [showTranslation, setShowTranslation] = useState(true)
  const [message, setMessage] = useState("")

  const cOutputBg = "bg-gray-100"
  const cOutputBorder = "border-gray-400"
  const cPageOn = "text-black"
  const cKnownText = "text-green-600"
  const cLoadText = "text-gray-500"

  const buttonList = [
    { command: "start", label: "Почати", visible: !isStarted },
    { command: "restart", label: "На початок", visible: isStarted },
    { command: "prev", label: "Назад", visible: isStarted },
    { command: "repeat", label: "Повторити", visible: isStarted },
    { command: "play", label: "Відтворити", visible: isStarted },
    { command: "pause", label: "Пауза", visible: isStarted },
    { command: "next", label: "Далі", visible: isStarted },
  ]

  const handleCommand = (cmd) => {
    switch (cmd) {
      case "start":
        setIsStarted(true)
        break
      case "restart":
        setWordIndex(0)
        break
      case "prev":
        setWordIndex((i) => Math.max(0, i - 1))
        break
      case "repeat":
        sayHello()
        break
      case "play":
        console.log("Play words")
        break
      case "pause":
        console.log("Pause playback")
        break
      case "next":
        setWordIndex((i) => Math.min(wordData.length - 1, i + 1))
        break
    }
  }

  const sayHello = () => {
    if (typeof window !== "undefined" && window.responsiveVoice) {
      window.responsiveVoice.speak("Hello world", "Ukrainian Female")
    } else {
      setMessage("ResponsiveVoice не завантажено")
    }
  }

  return (
    <>
      <Script
        src="https://code.responsivevoice.org/responsivevoice.js?key="
        strategy="afterInteractive"
        onLoad={() => console.log("ResponsiveVoice завантажено")}
      />

      <div className="flex flex-col items-center p-4">
        {/* Контейнер слів */}
        <div
          className={`flex flex-col sm:flex-row w-full max-w-2xl ${cOutputBg} border ${cOutputBorder} rounded-lg p-4 mb-4`}
        >
          {isStarted ? (
            <>
              {showImg && (
                <div className={`flex-1 flex items-center justify-center border ${cOutputBorder} ${cOutputBg} p-2`}>
                  <img
                    src={
                      wordData[wordIndex]?.img?.startsWith("http")
                        ? wordData[wordIndex].img
                        : `/images/words/${wordData[wordIndex]?.img || "WordOnClauds.jpg"}`
                    }
                    alt={wordData[wordIndex]?.word || "Word image"}
                    className="max-h-48 object-contain"
                    onError={(e) => (e.currentTarget.src = "/images/words/WordOnClauds.jpg")}
                  />
                </div>
              )}

              <div className={`flex-1 flex items-center justify-center border ${cOutputBorder} ${cOutputBg} p-2`}>
                <p className={`text-2xl font-semibold ${wordData[wordIndex].know === 1 ? cKnownText : cPageOn}`}>
                  {wordData[wordIndex].word}
                </p>
              </div>

              <div className={`flex-1 flex items-center justify-center border ${cOutputBorder} ${cOutputBg} p-2`}>
                {showTranslation ? (
                  <p className="text-xl">{wordData[wordIndex].translation}</p>
                ) : (
                  <p className="text-xl">?</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full">
              <p className={`${cLoadText}`}>🎯 Вибрано слів: {wordData.length}</p>
              <p className={`${cLoadText}`}>🎯 Вибрані теми: Усі</p>
              <p className={`${cLoadText}`}>🎯 Вибрані знання: Всі</p>
              <p className="text-lg mt-2">Натисніть "Почати"</p>
            </div>
          )}
        </div>

        {message && <p className="text-red-500 mb-2">{message}</p>}

        <div className="flex flex-wrap gap-2 justify-center">
          {buttonList
            .filter((btn) => btn.visible)
            .map((btn) => (
              <button
                key={btn.command}
                onClick={() => handleCommand(btn.command)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {btn.label}
              </button>
            ))}
        </div>
      </div>
    </>
  )
}
