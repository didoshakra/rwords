// app/actions/wordActions.js
"use server"

import { sql } from "@/lib/dbConfig"

export async function getWords() {
  const result = await sql`
    SELECT words.*, users.name AS user_name
    
    FROM words
    LEFT JOIN users ON words.user_id = users.id
    ORDER BY words.pn, words.id
  `
  return result // повертаємо масив рядків напряму
}

export async function createWord(form, user_id) {
  if (!user_id) throw new Error("Користувач не авторизований")

  const { word, translation = "", topic_id = 1, pn = 0, know = false, img = "" } = form

  const result = await sql`
    INSERT INTO words (word, translation, topic_id, pn, know, img, user_id)
    VALUES (${word}, ${translation}, ${topic_id}, ${pn}, ${know}, ${img}, ${user_id})
    RETURNING *
  `
  return result[0] // повертаємо вставлене слово
}

export async function updateWord(id, form, user) {
  if (!user) throw new Error("Користувач не авторизований")

  const result = await sql`SELECT user_id FROM words WHERE id = ${id}`
  const word = result[0]
  if (!word) throw new Error("Слово не знайдено")

  if (user.role !== "admin" && user.id !== word.user_id) {
    throw new Error("Недостатньо прав для редагування")
  }

  const { word: w, translation = "", topic_id = 1, pn = 0, know = false, img = "" } = form

  await sql`
    UPDATE words
    SET word = ${w}, translation = ${translation}, topic_id = ${topic_id}, pn = ${pn}, know = ${know}, img = ${img}
    WHERE id = ${id}
  `
}

export async function deleteWord(id, user) {
  if (!user) throw new Error("Користувач не авторизований")

  const result = await sql`SELECT user_id FROM words WHERE id = ${id}`
  const word = result[0]
  if (!word) throw new Error("Слово не знайдено")

  if (user.role !== "admin" && user.id !== word.user_id) {
    throw new Error("Недостатньо прав для видалення")
  }

  await sql`DELETE FROM words WHERE id = ${id}`
}

export async function deleteWords(ids, user) {
  if (!user || !user.id) throw new Error("Користувач не авторизований")
  if (!Array.isArray(ids) || ids.length === 0) return

  // Якщо не адміністратор — видаляємо тільки його власні слова
  if (user.role !== "admin") {
    await sql`
        DELETE FROM words
        WHERE id = ANY(${ids}) AND user_id = ${user.id}
      `
  } else {
    await sql`
        DELETE FROM words
        WHERE id = ANY(${ids})
      `
  }
}
// перезапис pn

export async function updateWordPn(id, pn, user) {
  if (!user) throw new Error("Користувач не авторизований")

  const [word] = await sql`SELECT user_id FROM words WHERE id = ${id}`
  if (!word) throw new Error("Слово не знайдено")

  if (user.role !== "admin" && user.id !== word.user_id) throw new Error("Недостатньо прав")

  await sql`UPDATE words SET pn = ${pn} WHERE id = ${id}`
}

//== імпорт з .csv
export async function importCSV(fileContent, user) {
  if (!user) throw new Error("Користувач не авторизований")

  const lines = fileContent
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) {
    throw new Error("Файл має містити мінімум секцію і тему!")
  }

  // 1. Парсимо секцію
  const [sectionLine, ...restLines] = lines
  const [sectionName, sectionImg = "other"] = sectionLine.split(";").map((s) => s.trim())

  // 2. Парсимо теми та слова
  let topics = []
  let currentTopic = null
  let idx = 0

  // Якщо другий рядок без *, це перша тема (старий стиль)
  if (restLines[0] && !restLines[0].startsWith("*")) {
    const [topicName, topicImg = "other"] = restLines[0].split(";").map((s) => s.trim())
    currentTopic = { name: topicName, img: topicImg, words: [] }
    idx = 1
  }

  for (; idx < restLines.length; idx++) {
    const line = restLines[idx].trim()
    if (!line) continue

    if (line.startsWith("*")) {
      // Нова тема
      const topicLine = line.substring(1).trim()
      const [topicName, topicImg = "other"] = topicLine.split(";").map((s) => s.trim())
      if (currentTopic) topics.push(currentTopic)
      currentTopic = { name: topicName, img: topicImg, words: [] }
    } else {
      // слово;img або просто слово
      const [word, img = "word"] = line.split(";").map((s) => s.trim())
      if (!word) continue
      if (currentTopic) currentTopic.words.push({ word, img })
    }
  }
  if (currentTopic) topics.push(currentTopic)

  if (topics.length === 0) {
    throw new Error("Не знайдено жодної теми для імпорту!")
  }

  let importedWordsCount = 0

  // 3. Робота з базою
  // Пошук / вставка секції
  const sectionRes = await sql`SELECT id FROM sections WHERE name = ${sectionName}`
  let sectionId
  if (sectionRes.length > 0) {
    sectionId = sectionRes[0].id
  } else {
    const maxPnRes = await sql`SELECT MAX(pn) AS maxPn FROM sections`
    const maxPn = maxPnRes[0].maxPn || 0
    // Вставляємо user_id у секції
    const insertSectionRes = await sql`
        INSERT INTO sections (name, img, pn, user_id)
        VALUES (${sectionName}, ${sectionImg}, ${maxPn + 1}, ${user.id})
        RETURNING id
      `
    sectionId = insertSectionRes[0].id
  }

  // Вставка тем і слів
  for (const topic of topics) {
    // Пошук / вставка теми
    const topicRes = await sql`SELECT id FROM topics WHERE name = ${topic.name} AND section_id = ${sectionId}`
    let topicId
    if (topicRes.length > 0) {
      topicId = topicRes[0].id
    } else {
      const maxPnTopicRes = await sql`SELECT MAX(pn) AS maxPn FROM topics WHERE section_id = ${sectionId}`
      const maxPnTopic = maxPnTopicRes[0].maxPn || 0
      // Вставляємо user_id у теми
      const insertTopicRes = await sql`
          INSERT INTO topics (name, img, section_id, pn, user_id)
          VALUES (${topic.name}, ${topic.img}, ${sectionId}, ${maxPnTopic + 1}, ${user.id})
          RETURNING id
        `
      topicId = insertTopicRes[0].id
    }

    // Вставка слів
    const maxPnWordRes = await sql`SELECT MAX(pn) AS maxPn FROM words WHERE topic_id = ${topicId}`
    let pn = maxPnWordRes[0].maxPn || 0

    for (const { word, img } of topic.words) {
      // Перевіряємо, чи слово вже є
      const wordExistRes = await sql`SELECT id FROM words WHERE word = ${word} AND topic_id = ${topicId}`
      if (wordExistRes.length === 0) {
        pn++
        await sql`
            INSERT INTO words (word, img, topic_id, pn, user_id)
            VALUES (${word}, ${img}, ${topicId}, ${pn}, ${user.id})
          `
        importedWordsCount++
      }
    }
  }

  return `Імпортовано ${importedWordsCount} слів`
}

//для перекладу одного слова
export async function translateWord(word, fromLanguage, toLanguage) {
  // Викликаємо API перекладу
  const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=${fromLanguage}|${toLanguage}`

  const res = await fetch(apiUrl)
  if (!res.ok) throw new Error("Не вдалося перекласти слово")

  const data = await res.json()
  const translated = data?.responseData?.translatedText ?? ""
  const cleaned = translated.replace(/(^-+)|(-+$)/g, "").trim()

  // Оновлюємо у базі
  await sql`
    UPDATE words SET translation = ${cleaned} WHERE word = ${word}
  `

  return cleaned
}

