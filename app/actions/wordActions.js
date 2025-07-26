"use server"

import { sql } from "@/lib/dbConfig"

export async function getWords() {
  const result = await sql`
    SELECT words.*, users.name AS user_name
    FROM words
    LEFT JOIN users ON words.user_id = users.id
    ORDER BY words.pn, words.id
  `
  return result
}

export async function createWord(form, userId) {
  if (!userId) throw new Error("Користувач не авторизований")

  const { word, translation = "", topic_id = 1, pn = 0, know = false, img = "" } = form

  const result = await sql`
    INSERT INTO words (word, translation, topic_id, pn, know, img, user_id)
    VALUES (${word}, ${translation}, ${topic_id}, ${pn}, ${know}, ${img}, ${userId})
    RETURNING *
  `
  return result[0]
}

export async function updateWord(id, form, userId, role) {
  if (!userId) throw new Error("Користувач не авторизований")

  const result = await sql`SELECT user_id FROM words WHERE id = ${id}`
  const word = result[0]
  if (!word) throw new Error("Слово не знайдено")

  if (role !== "admin" && userId !== word.user_id) {
    throw new Error("Недостатньо прав для редагування")
  }

  const { word: w, translation = "", topic_id = 1, pn = 0, know = false, img = "" } = form

  await sql`
    UPDATE words
    SET word = ${w}, translation = ${translation}, topic_id = ${topic_id}, pn = ${pn}, know = ${know}, img = ${img}
    WHERE id = ${id}
  `
}

export async function deleteWord(id, userId, role) {
  if (!userId) throw new Error("Користувач не авторизований")

  const result = await sql`SELECT user_id FROM words WHERE id = ${id}`
  const word = result[0]
  if (!word) throw new Error("Слово не знайдено")

  if (role !== "admin" && userId !== word.user_id) {
    throw new Error("Недостатньо прав для видалення")
  }

  await sql`DELETE FROM words WHERE id = ${id}`
}

export async function deleteWords(ids, userId, role) {
  if (!userId) throw new Error("Користувач не авторизований")
  if (!Array.isArray(ids) || ids.length === 0) return

  if (role !== "admin") {
    await sql`
      DELETE FROM words
      WHERE id = ANY(${ids}) AND user_id = ${userId}
    `
  } else {
    await sql`
      DELETE FROM words
      WHERE id = ANY(${ids})
    `
  }
}

export async function updateWordPn(id, pn, userId, role) {
  if (!userId) throw new Error("Користувач не авторизований")

  const [word] = await sql`SELECT user_id FROM words WHERE id = ${id}`
  if (!word) throw new Error("Слово не знайдено")

  if (role !== "admin" && userId !== word.user_id) {
    throw new Error("Недостатньо прав")
  }

  await sql`UPDATE words SET pn = ${pn} WHERE id = ${id}`
}

// export async function importCSV(fileContent, userId, role) {
export async function importCSV(fileContent, userId) {
  if (!userId) throw new Error("Користувач не авторизований")
  try {
    if (!userId) throw new Error("Користувач не авторизований")

    const lines = fileContent
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)

    if (lines.length < 2) throw new Error("Файл має містити мінімум секцію і тему!")

    const [sectionLine, ...restLines] = lines
    const [sectionName, sectionImg = "other"] = sectionLine.split(";").map((s) => s.trim())

    let topics = []
    let currentTopic = null
    let idx = 0
    let skippedTopicsCount = 0
    let skippedWordsCount = 0

    if (restLines[0] && !restLines[0].startsWith("*")) {
      const [topicName, topicImg = "other"] = restLines[0].split(";").map((s) => s.trim())
      currentTopic = { name: topicName, img: topicImg, words: [] }
      idx = 1
    }

    for (; idx < restLines.length; idx++) {
      const line = restLines[idx]
      if (!line) continue
      if (line.startsWith("*")) {
        const [topicName, topicImg = "other"] = line
          .substring(1)
          .trim()
          .split(";")
          .map((s) => s.trim())
        if (currentTopic) topics.push(currentTopic)
        currentTopic = { name: topicName, img: topicImg, words: [] }
      } else {
        const [word, img = "word"] = line.split(";").map((s) => s.trim())
        if (!word) continue
        if (currentTopic) currentTopic.words.push({ word, img })
      }
    }
    if (currentTopic) topics.push(currentTopic)

    if (topics.length === 0) throw new Error("Не знайдено жодної теми для імпорту!")

    let importedWordsCount = 0

    const sectionRes = await sql`SELECT id FROM sections WHERE name = ${sectionName}`

    let sectionId
    if (sectionRes.length > 0) {
      sectionId = sectionRes[0].id
    } else {
      const maxPnRes = await sql`SELECT MAX(pn) AS maxPn FROM sections`
      const maxPn = maxPnRes[0].maxPn || 0
      const insertSectionRes = await sql`
      INSERT INTO sections (name, img, pn, user_id)
      VALUES (${sectionName}, ${sectionImg}, ${maxPn + 1}, ${userId})
      RETURNING id
    `
      sectionId = insertSectionRes[0].id
    }

    for (const topic of topics) {
      const topicRes = await sql`
      SELECT id FROM topics WHERE name = ${topic.name} AND section_id = ${sectionId}
    `
      let topicId
      if (topicRes.length > 0) {
        topicId = topicRes[0].id
        skippedTopicsCount++
      } else {
        const maxPnTopicRes = await sql`
        SELECT MAX(pn) AS maxPn FROM topics WHERE section_id = ${sectionId}
      `
        const maxPnTopic = maxPnTopicRes[0].maxPn || 0
        const insertTopicRes = await sql`
        INSERT INTO topics (name, img, section_id, pn, user_id)
        VALUES (${topic.name}, ${topic.img}, ${sectionId}, ${maxPnTopic + 1}, ${userId})
        RETURNING id
      `
        topicId = insertTopicRes[0].id
      }

      const maxPnWordRes = await sql`
      SELECT MAX(pn) AS maxPn FROM words WHERE topic_id = ${topicId}
    `
      let pn = maxPnWordRes[0].maxPn || 0

      for (const { word, img } of topic.words) {
        const wordExistRes = await sql`
        SELECT id FROM words WHERE word = ${word} AND topic_id = ${topicId}
      `
        if (wordExistRes.length === 0) {
          pn++
          await sql`
          INSERT INTO words (word, img, topic_id, pn, user_id)
          VALUES (${word}, ${img}, ${topicId}, ${pn}, ${userId})
        `
          importedWordsCount++
        } else {
          skippedWordsCount++
        }
      }
    }
    if (importedWordsCount === 0) {
      return `Імпортовано 0 слів. Причини: ${skippedTopicsCount} тем уже існували, ${skippedWordsCount} слів уже були в базі.`
    }

    return `Імпортовано ${importedWordsCount} слів. Пропущено ${skippedTopicsCount} тем і ${skippedWordsCount} слів через дублікати.`

    // return `Імпортовано ${importedWordsCount} слів`
  } catch (error) {
    console.error("Помилка в importCSV:", error)
    throw new Error("Серверна помилка імпорту: " + error.message)
  }
}

export async function translateWord(word, fromLanguage, toLanguage) {
  const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    word
  )}&langpair=${fromLanguage}|${toLanguage}`

  const res = await fetch(apiUrl)
  if (!res.ok) throw new Error("Не вдалося перекласти слово")

  const data = await res.json()
  const translated = data?.responseData?.translatedText ?? ""
  const cleaned = translated.replace(/(^-+)|(-+$)/g, "").trim()

  await sql`
    UPDATE words SET translation = ${cleaned} WHERE word = ${word}
  `

  return cleaned
}
