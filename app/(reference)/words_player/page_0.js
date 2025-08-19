//words_player/page.js// із чіткою асинхронною логікою озвучування, окремими паузами і керуванням циклом.
// Не працює speak(current.word
"use client"

import React, { useEffect, useState, useRef } from "react"
import Script from "next/script"
import { getWords } from "@/app/actions/wordActions"

const WordPlayer = () => {
  const [words, setWords] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [message, setMessage] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  // Опції (змінювані користувачем)
  const [pauseAfterWord, setPauseAfterWord] = useState(2000) // мс
  const [pauseAfterTranslation1, setPauseAfterTranslation1] = useState(1000) // мс
  const [pauseAfterTranslation2, setPauseAfterTranslation2] = useState(1000) // мс

  const [startListPhrase, setStartListPhrase] = useState("Початок списку слів")
  const [endListPhrase, setEndListPhrase] = useState("Кінець списку слів")

  const [repeatTranslation, setRepeatTranslation] = useState(true)
  const [stopAfterTranslation, setStopAfterTranslation] = useState(false)
  const [showImage, setShowImage] = useState(true)

  // Голоси для озвучки (можна замінити на конкретні голоси, які обрав користувач)
  const [voiceWord, setVoiceWord] = useState(null)
  const [voiceTranslation1, setVoiceTranslation1] = useState(null)
  const [voiceTranslation2, setVoiceTranslation2] = useState(null)

  const isCancelled = useRef(false)

  useEffect(() => {
    loadWords()
    // Очистка при демонтовані
    return () => {
      isCancelled.current = true
      window.speechSynthesis.cancel()
    }
  }, [])

  const loadWords = () => {
    getWords()
      .then((res) => {
        setWords(res)
        setCurrentIndex(0)
      })
      .catch((err) => setMessage("Помилка: " + err.message))
  }

  //   встановити голоси після завантаження
  useEffect(() => {
    const populateVoices = () => {
      const voices = speechSynthesis.getVoices()
      const ukVoice = voices.find((v) => v.lang === "uk-UA")
      const enVoice = voices.find((v) => v.lang === "en-US" || v.lang === "en-GB")

      if (ukVoice) setVoiceWord(ukVoice)
      if (ukVoice) setVoiceTranslation1(ukVoice)
      if (enVoice) setVoiceTranslation2(enVoice)
    }

    // Деякі браузери потребують тайм-ауту або слухача події
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoices
    }

    // Або викликаємо напряму
    populateVoices()
  }, [])

  // Функція для тестування responsiveVoice
  const sayHello = () => {
    if (window.responsiveVoice) {
      window.responsiveVoice.speak("Привіт, як справи?", "Ukrainian Female")
    } else {
      alert("ResponsiveVoice не завантажений")
    }
  }
  // Використовуємо responsiveVoice для озвучування
  const speakRV = (text, voice = "Ukrainian Female") => {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !window.responsiveVoice) {
        resolve()
        return
      }
      window.responsiveVoice.speak(text, voice, {
        onend: () => resolve(),
        onerror: () => resolve(),
      })
    })
  }

  // Промісна функція озвучки
  const speak = (text, voice) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) {
        setMessage("Speech Synthesis не підтримується браузером")
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

  // Затримка як проміс
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  // Основна логіка озвучування
  const playCurrentWord = async () => {
    if (!words.length) return
    const current = words[currentIndex]
    isCancelled.current = false

    setIsRunning(true)
    setMessage("")

    // Скасувати якщо відмінили
    if (isCancelled.current) return

    // await speak(current.word, voiceWord)
    await speakRV(current.word, voiceWord)
    // await speak("ми в школі", voiceWord)
    console.log("Word to speak:", current.word)
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
    if (!stopAfterTranslation) {
      nextWord()
    } else {
      setIsRunning(false)
      setMessage("Відтворення зупинено після перекладу")
    }
  }

  const nextWord = () => {
    if (currentIndex + 1 < words.length) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setIsRunning(false)
      setMessage(endListPhrase)
      speak(endListPhrase, voiceWord)
    }
  }

  const prevWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      setIsRunning(false)
      setMessage(startListPhrase)
      speak(startListPhrase, voiceWord)
    }
  }

  const goToStart = () => {
    setCurrentIndex(0)
    setIsRunning(false)
    setMessage(startListPhrase)
    speak(startListPhrase, voiceWord)
  }

  const repeatWord = () => {
    if (!isRunning) {
      playCurrentWord()
    }
  }

  // Керуємо запуском відтворення при зміні currentIndex або isRunning
  useEffect(() => {
    if (isRunning) {
      playCurrentWord()
    } else {
      isCancelled.current = true
      window.speechSynthesis.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isRunning])

  return (
    <>
      {/* <Script src="https://code.responsivevoice.org/responsivevoice.js?key=YOUR_KEY" /> */}
      <Script
        src="https://code.responsivevoice.org/responsivevoice.js?key="
        strategy="afterInteractive"
        onLoad={() => console.log("ResponsiveVoice завантажено")}
      />
      <button onClick={sayHello}>Відтворити голос</button>
      <div className="p-4 max-w-xl mx-auto text-center">
        <h2 className="text-xl font-semibold mb-4">Вивчення слів</h2>

        {message && <p className="text-red-500 mb-2">{message}</p>}

        {words.length > 0 ? (
          <>
            <div className="mb-4">
              <p className="text-2xl">{words[currentIndex].word}</p>
              <p className="text-lg text-gray-600">{words[currentIndex].translation}</p>
              {showImage && words[currentIndex].img && (
                // <img
                //   src={words[currentIndex]?.img ? words[currentIndex].img : "images/words/WordOnClauds.jpg"}
                //   alt={words[currentIndex]?.word || "Word image"}
                //   className="mx-auto my-2 max-h-48 object-contain"
                // />
                <img
                  src={
                    words[currentIndex]?.img
                      ? words[currentIndex].img.startsWith("http")
                        ? words[currentIndex].img
                        : `/images/words/${words[currentIndex].img}`
                      : "/images/words/WordOnClauds.jpg"
                  }
                  onError={(e) => {
                    e.currentTarget.src = "/images/words/WordOnClauds.jpg"
                  }}
                  alt={words[currentIndex]?.word || "Word image"}
                  className="mx-auto my-2 max-h-48 object-contain"
                />
              )}
            </div>

            <div className="flex justify-center gap-3 mb-4">
              <button onClick={goToStart} className="btn">
                На початок
              </button>
              <button onClick={prevWord} className="btn">
                Назад
              </button>
              <button onClick={repeatWord} className="btn">
                Повторити
              </button>
              <button onClick={() => setIsRunning(true)} disabled={isRunning} className="btn btn-primary">
                Відтворити
              </button>
              <button onClick={() => setIsRunning(false)} disabled={!isRunning} className="btn btn-secondary">
                Пауза
              </button>
              <button onClick={nextWord} className="btn">
                Далі
              </button>
            </div>

            {/* Тут можна додати UI для зміни опцій */}
            <div className="text-left max-w-md mx-auto border p-4 rounded">
              <h3 className="font-semibold mb-2">Опції озвучування</h3>
              <label>
                Пауза після слова (мс):{" "}
                <input
                  type="number"
                  value={pauseAfterWord}
                  onChange={(e) => setPauseAfterWord(Number(e.target.value))}
                  min={0}
                  className="input"
                />
              </label>
              <br />
              <label>
                Пауза після перекладу 1 (мс):{" "}
                <input
                  type="number"
                  value={pauseAfterTranslation1}
                  onChange={(e) => setPauseAfterTranslation1(Number(e.target.value))}
                  min={0}
                  className="input"
                />
              </label>
              <br />
              <label>
                Пауза після перекладу 2 (мс):{" "}
                <input
                  type="number"
                  value={pauseAfterTranslation2}
                  onChange={(e) => setPauseAfterTranslation2(Number(e.target.value))}
                  min={0}
                  className="input"
                />
              </label>
              <br />
              <label>
                Повторювати переклад:{" "}
                <input
                  type="checkbox"
                  checked={repeatTranslation}
                  onChange={(e) => setRepeatTranslation(e.target.checked)}
                />
              </label>
              <br />
              <label>
                Зупиняти після перекладу:{" "}
                <input
                  type="checkbox"
                  checked={stopAfterTranslation}
                  onChange={(e) => setStopAfterTranslation(e.target.checked)}
                />
              </label>
              <br />
              <label>
                Показувати картинку:{" "}
                <input type="checkbox" checked={showImage} onChange={(e) => setShowImage(e.target.checked)} />
              </label>
              <br />
              <label>
                Фраза початку списку:{" "}
                <input
                  type="text"
                  value={startListPhrase}
                  onChange={(e) => setStartListPhrase(e.target.value)}
                  className="input"
                />
              </label>
              <br />
              <label>
                Фраза кінця списку:{" "}
                <input
                  type="text"
                  value={endListPhrase}
                  onChange={(e) => setEndListPhrase(e.target.value)}
                  className="input"
                />
              </label>
            </div>
          </>
        ) : (
          <p>Завантаження слів...</p>
        )}
      </div>
    </>
  )
}

export default WordPlayer
