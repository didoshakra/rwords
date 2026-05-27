// wordActions.jswordActions.js
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

  const { word, translation = "", topic_id = 1, pn = 0, know = false, img = "", group_key = "", type = "word" } = form

  const result = await sql`
    INSERT INTO words (word, translation, topic_id, pn, know, img, group_key, type, user_id)
    VALUES (${word}, ${translation}, ${topic_id}, ${pn}, ${know}, ${img}, ${group_key}, ${type}, ${userId})
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

  const {
    word: w,
    translation = "",
    topic_id = 1,
    pn = 0,
    know = false,
    img = "",
    group_key = "",
    type = "word",
  } = form

  await sql`
    UPDATE words
    SET word = ${w},
        translation = ${translation},
        topic_id = ${topic_id},
        pn = ${pn},
        know = ${know},
        img = ${img},
        group_key = ${group_key},
        type = ${type}
    WHERE id = ${id}
  `
}


export async function deleteWords(ids, userId, role) {
  console.log("wordActions/deleteWords/ids=", ids)
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


export async function importCSV(fileContent, reversImportCSV, userId) {
  if (!userId) throw new Error("Користувач не авторизований")

  const isUrl = (img) => img.startsWith("http://") || img.startsWith("https://")

  try {
    const lines = fileContent
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)

    if (lines.length < 2) throw new Error("Файл має містити мінімум секцію і тему!")

    // --- 1. Знаходимо першу секцію (пропускаємо коментарі //) ---
    let sectionLineIdx = 0
    while (sectionLineIdx < lines.length && lines[sectionLineIdx].startsWith("//")) {
      sectionLineIdx++
    }

    if (!lines[sectionLineIdx]?.startsWith("**")) {
      throw new Error("Перший рядок (не коментар) має бути секцією (**НазваСекції)")
    }

    // --- 2. Парсимо першу секцію ---
    const firstSectionLine = lines[sectionLineIdx].substring(2).trim()
    let [currentSectionName, currentSectionImgRaw = "other"] = firstSectionLine.split(";").map((s) => s.trim())
    const firstSectionImg = isUrl(currentSectionImgRaw) ? null : currentSectionImgRaw

    // --- 3. Знаходимо першу тему ---
    let topicLineIdx = sectionLineIdx + 1
    while (topicLineIdx < lines.length && lines[topicLineIdx].startsWith("//")) {
      topicLineIdx++
    }

    if (!lines[topicLineIdx] || lines[topicLineIdx].startsWith("**")) {
      throw new Error("Після секції має йти тема (*НазваТеми)")
    }

    const firstTopicLine = lines[topicLineIdx].startsWith("*")
      ? lines[topicLineIdx].substring(1).trim()
      : lines[topicLineIdx]
    const [firstTopicName, firstTopicImgRaw = "other"] = firstTopicLine.split(";").map((s) => s.trim())
    const firstTopicImg = isUrl(firstTopicImgRaw) ? null : firstTopicImgRaw

    // --- 4. Будуємо структуру секцій ---
    let sections = [
      {
        name: currentSectionName,
        img: firstSectionImg,
        topics: [{ name: firstTopicName, img: firstTopicImg, words: [] }],
      },
    ]
    let currentSection = sections[0]
    let currentTopic = currentSection.topics[0]

    // --- 5. Парсимо решту рядків ---
    for (let i = topicLineIdx + 1; i < lines.length; i++) {
      const line = lines[i]
      if (!line || line.startsWith("//")) continue

      if (line.startsWith("**")) {
        // Нова секція
        const [secName, secImgRaw = "other"] = line
          .substring(2)
          .trim()
          .split(";")
          .map((s) => s.trim())
        const secImg = isUrl(secImgRaw) ? null : secImgRaw
        currentSection = { name: secName, img: secImg, topics: [] }
        sections.push(currentSection)
        currentTopic = null
      } else if (line.startsWith("*")) {
        // Нова тема
        const [topicName, topicImgRaw = "other"] = line
          .substring(1)
          .trim()
          .split(";")
          .map((s) => s.trim())
        const topicImg = isUrl(topicImgRaw) ? null : topicImgRaw
        currentTopic = { name: topicName, img: topicImg, words: [] }
        currentSection.topics.push(currentTopic)
      } else {
        // Слово: word;group_key;type;translation;img
        if (!currentTopic) continue
        const parts = line.split(";").map((s) => s.trim())
        const word = reversImportCSV ? parts[3] : parts[0]
        if (!word) continue
        const wordCount = word.trim().split(/\s+/).length
        const group_key = parts[1] !== undefined && parts[1] !== "" ? parts[1] : wordCount === 1 ? word : ""
        const type =
          parts[2] !== undefined && parts[2] !== ""
            ? parts[2]
            : wordCount === 1
              ? "word"
              : /[.?!]$/.test(word)
                ? "sentence"
                : "phrase"

        const translation = reversImportCSV ? parts[0] || "" : parts[3] || ""
        const img = parts[4] || ""

        currentTopic.words.push({ word, group_key, type, translation, img })
      }
    }

    if (sections.every((s) => s.topics.length === 0)) {
      throw new Error("Не знайдено жодної теми для імпорту!")
    }

    // --- 6. Зберігаємо в БД ---
    let importedWordsCount = 0
    let skippedTopicsCount = 0
    let skippedWordsCount = 0
    let importedTopicsCount = 0
    let importedSectionsCount = 0
    let skippedSectionsCount = 0

    for (const section of sections) {
      const sectionRes = await sql`SELECT id FROM sections WHERE name = ${section.name}`
      let sectionId

      if (sectionRes.length > 0) {
        sectionId = sectionRes[0].id
        skippedSectionsCount++
      } else {
        const maxPnRes = await sql`SELECT MAX(pn) AS maxPn FROM sections`
        const maxPn = maxPnRes[0].maxPn || 0
        const insertSectionRes = await sql`
          INSERT INTO sections (name, img, pn, user_id)
          VALUES (${section.name}, ${section.img || "other"}, ${maxPn + 1}, ${userId})
          RETURNING id
        `
        sectionId = insertSectionRes[0].id
        importedSectionsCount++
      }

      for (const topic of section.topics) {
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
            VALUES (${topic.name}, ${topic.img || "other"}, ${sectionId}, ${maxPnTopic + 1}, ${userId})
            RETURNING id
          `
          topicId = insertTopicRes[0].id
          importedTopicsCount++
        }

        const maxPnWordRes = await sql`
          SELECT MAX(pn) AS maxPn FROM words WHERE topic_id = ${topicId}
        `
        let pn = maxPnWordRes[0].maxPn || 0

        for (const { word, group_key, type, translation, img } of topic.words) {
          const wordExistRes = await sql`
            SELECT id FROM words WHERE word = ${word} AND topic_id = ${topicId}
          `
          if (wordExistRes.length === 0) {
            pn++
            await sql`
              INSERT INTO words (word, group_key, type, translation, img, topic_id, pn, user_id)
              VALUES (${word}, ${group_key}, ${type}, ${translation}, ${img}, ${topicId}, ${pn}, ${userId})
            `
            importedWordsCount++
          } else {
            skippedWordsCount++
          }
        }
      }
    }

    if (importedWordsCount === 0) {
      return `Імпортовано 0 слів. Секцій пропущено: ${skippedSectionsCount}, тем пропущено: ${skippedTopicsCount}, слів пропущено: ${skippedWordsCount}.`
    }

    return (
      `Імпортовано: ${importedSectionsCount} секцій, ${importedTopicsCount} тем, ${importedWordsCount} слів. ` +
      `Пропущено дублікатів: ${skippedSectionsCount} секцій, ${skippedTopicsCount} тем, ${skippedWordsCount} слів.`
    )
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
