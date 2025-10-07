// app/(reference)/words_player/page.js
"use client"

import { useEffect, useState, useRef } from "react"
import Script from "next/script"
import { getWords } from "@/app/actions/wordActions" // твоя функція для отримання слів
import { defaultMetadata } from "@/lib/seoConfig"

export const metadata = {
  ...defaultMetadata,
  title: "RWords — Прослуховування та запам’ятовування слів",
  description:
    " Пролуховуй  та запам’ятовуй слова, оцінюй свої знання, керуй процесом голосом. Вибирай теми і ще не вивчені слова для прослуховування.",
  openGraph: {
    ...defaultMetadata.openGraph,
    url: "https://rwords.vercel.app/words_player",
    title: "Прослуховування і оцінка знань слів в RWords",
    description: "Слухай, повторюй і запам’ятовуй іноземні (англійські) слова разом із RWords. Оцінюй свої знання. Керуй процесом голосом.",
    images: [
      {
        url: "https://rwords.vercel.app/og-default.png",
        width: 1200,
        height: 630,
        alt: "RWords Author Page",
      },
    ],
  },
}

export default function WordsPage() {
  const [isStarted, setIsStarted] = useState(false)
  const [words, setWords] = useState([])
  const [wordIndex, setWordIndex] = useState(0)
  const [showImg, setShowImg] = useState(true)
  const [showTranslation, setShowTranslation] = useState(true)
  const [message, setMessage] = useState("")

  const isCancelled = useRef(false)
  const [isRunning, setIsRunning] = useState(false)

  const [pauseAfterWord, setPauseAfterWord] = useState(2000)
  const [pauseAfterTranslation1, setPauseAfterTranslation1] = useState(1000)
  const [pauseAfterTranslation2, setPauseAfterTranslation2] = useState(1000)
  const [repeatTranslation, setRepeatTranslation] = useState(true)
  const [stopAfterTranslation, setStopAfterTranslation] = useState(false)

  const [voiceWord, setVoiceWord] = useState(null)
  const [voiceTranslation1, setVoiceTranslation1] = useState(null)
  const [voiceTranslation2, setVoiceTranslation2] = useState(null)

  const cOutputBg = "bg-gray-100"
  const cOutputBorder = "border-gray-400"
  const cPageOn = "text-black"
  const cKnownText = "text-green-600"
  const cLoadText = "text-gray-500"

  useEffect(() => {
    loadWords()
    return () => {
      isCancelled.current = true
      window.speechSynthesis.cancel()
    }
  }, [])

  const loadWords = async () => {
    try {
      const res = await getWords()
      setWords(res)
      setWordIndex(0)
      setMessage(`Завантажено ${res.length} слів`)
    } catch (err) {
      setMessage("Помилка: " + err.message)
    }
  }

  // Ініціалізація голосів
  useEffect(() => {
    const populateVoices = () => {
      const voices = speechSynthesis.getVoices()
      const ukVoice = voices.find((v) => v.lang === "uk-UA")
      const enVoice = voices.find((v) => v.lang === "en-US" || v.lang === "en-GB")

      if (ukVoice) setVoiceWord(ukVoice)
      if (ukVoice) setVoiceTranslation1(ukVoice)
      if (enVoice) setVoiceTranslation2(enVoice)
    }

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoices
    }
    populateVoices()
  }, [])

  const speak = (text, voice) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) {
        resolve()
        return
      }
      const utterance = new SpeechSynthesisUtterance(text)
      if (voice) utterance.voice = voice
      utterance.lang = voice?.lang || "uk-UA"
      utterance.rate = 0.8
      utterance.onend = () => resolve()
      utterance.onerror = () => resolve()
      window.speechSynthesis.speak(utterance)
    })
  }

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const playCurrentWord = async () => {
    if (!words.length) return
    const current = words[wordIndex]
    isCancelled.current = false
    setIsRunning(true)
    setMessage("Відтворення...")

    await speak(current.word, voiceWord)
    if (isCancelled.current) return
    await delay(pauseAfterWord)
    if (isCancelled.current) return

    await speak(current.translation, voiceTranslation1)
    if (isCancelled.current) return
    await delay(pauseAfterTranslation1)
    if (isCancelled.current) return

    if (repeatTranslation && voiceTranslation2) {
      await speak(current.translation, voiceTranslation2)
      if (isCancelled.current) return
      await delay(pauseAfterTranslation2)
      if (isCancelled.current) return
    }

    afterPlayback()
  }

  const afterPlayback = () => {
    if (!stopAfterTranslation) nextWord()
    else {
      setIsRunning(false)
      setMessage("Відтворення зупинено після перекладу")
    }
  }

  const nextWord = () => {
    if (wordIndex + 1 < words.length) setWordIndex(wordIndex + 1)
    else {
      setIsRunning(false)
      setMessage("Кінець списку")
      speak("Кінець списку", voiceWord)
    }
  }

  const prevWord = () => {
    if (wordIndex > 0) setWordIndex(wordIndex - 1)
  }

  const goToStart = () => {
    setWordIndex(0)
    setIsRunning(false)
    setMessage("Початок списку")
    speak("Початок списку", voiceWord)
  }

  const repeatWord = () => {
    if (!isRunning) playCurrentWord()
  }

  const handleCommand = (cmd) => {
    switch (cmd) {
      case "start":
        setIsStarted(true)
        playCurrentWord()
        break
      case "restart":
        goToStart()
        break
      case "prev":
        prevWord()
        break
      case "repeat":
        repeatWord()
        break
      case "play":
        playCurrentWord()
        break
      case "pause":
        isCancelled.current = true
        setIsRunning(false)
        window.speechSynthesis.cancel()
        break
      case "next":
        nextWord()
        break
    }
  }

  const buttonList = [
    { command: "start", label: "Почати", visible: !isStarted },
    { command: "restart", label: "На початок", visible: isStarted },
    { command: "prev", label: "Назад", visible: isStarted },
    { command: "repeat", label: "Повторити", visible: isStarted },
    { command: "play", label: "Відтворити", visible: isStarted },
    { command: "pause", label: "Пауза", visible: isStarted },
    { command: "next", label: "Далі", visible: isStarted },
  ]

//   return (
//     <>
//       <Script src="https://code.responsivevoice.org/responsivevoice.js?key=" strategy="afterInteractive" />

//       <div className="flex flex-col items-center p-4">
//         <div className="flex flex-col sm:flex-row w-full max-w-2xl bg-gray-100 border border-gray-400 rounded-lg p-4 mb-4">
//           {isStarted && words.length > 0 ? (
//             <>
//               {showImg && (
//                 <div className="flex-1 flex items-center justify-center border border-gray-400 p-2">
//                   <img
//                     src={
//                       words[wordIndex]?.img?.startsWith("http")
//                         ? words[wordIndex].img
//                         : `/images/words/${words[wordIndex]?.img || "WordOnClauds.jpg"}`
//                     }
//                     alt={words[wordIndex]?.word || "Word image"}
//                     className="max-h-48 object-contain"
//                     onError={(e) => (e.currentTarget.src = "/images/words/WordOnClauds.jpg")}
//                   />
//                 </div>
//               )}

//               <div className="flex-1 flex items-center justify-center border border-gray-400 p-2">
//                 <p
//                   className={`text-2xl font-semibold ${words[wordIndex]?.know === 1 ? "text-green-600" : "text-black"}`}
//                 >
//                   {words[wordIndex]?.word}
//                 </p>
//               </div>

//               <div className="flex-1 flex items-center justify-center border border-gray-400 p-2">
//                 {showTranslation ? (
//                   <p className="text-xl">{words[wordIndex]?.translation}</p>
//                 ) : (
//                   <p className="text-xl">?</p>
//                 )}
//               </div>
//             </>
//           ) : (
//             <div className="flex flex-col items-center justify-center w-full">
//               <p className="text-gray-500">🎯 Завантажено слів: {words.length}</p>
//               <p className="text-gray-500 mt-2">{`Натисніть "Почати"`}</p>
//             </div>
//           )}
//         </div>

//         {message && <p className="text-red-500 mb-2">{message}</p>}

//         <div className="flex flex-wrap gap-2 justify-center">
//           {buttonList
//             .filter((btn) => btn.visible)
//             .map((btn) => (
//               <button
//                 key={btn.command}
//                 onClick={() => handleCommand(btn.command)}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 {btn.label}
//               </button>
//             ))}
//         </div>
//       </div>
//     </>
//   )
// }
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
                      words[wordIndex]?.img?.startsWith("http")
                        ? words[wordIndex].img
                        : `/images/words/${words[wordIndex]?.img || "WordOnClauds.jpg"}`
                    }
                    alt={words[wordIndex]?.word || "Word image"}
                    className="max-h-48 object-contain"
                    onError={(e) => (e.currentTarget.src = "/images/words/WordOnClauds.jpg")}
                  />
                </div>
              )}

              <div className={`flex-1 flex items-center justify-center border ${cOutputBorder} ${cOutputBg} p-2`}>
                <p className={`text-2xl font-semibold ${words[wordIndex].know === 1 ? cKnownText : cPageOn}`}>
                  {words[wordIndex].word}
                </p>
              </div>

              <div className={`flex-1 flex items-center justify-center border ${cOutputBorder} ${cOutputBg} p-2`}>
                {showTranslation ? (
                  <p className="text-xl">{words[wordIndex].translation}</p>
                ) : (
                  <p className="text-xl">?</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full">
              <p className={`${cLoadText}`}>🎯 Вибрано слів: {words.length}</p>
              <p className={`${cLoadText}`}>🎯 Вибрані теми: Усі</p>
              <p className={`${cLoadText}`}>🎯 Вибрані знання: Всі</p>
              <p className="text-lg mt-2">{`Натисніть "Почати"`}</p>
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
