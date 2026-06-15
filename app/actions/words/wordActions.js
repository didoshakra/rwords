// wordActions.js
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

  const { word, translation = "", topic_id = 1, know = false, img = "", group_key = "", type = "word" } = form

  // Беремо максимальний pn теми
  const maxPnRes = await sql`
    SELECT MAX(pn) AS maxpn FROM words WHERE topic_id = ${topic_id}
  `
  const pn = (maxPnRes[0].maxpn || 0) + 1

  const result = await sql`
    INSERT INTO words (word, translation, topic_id, pn, know, img, group_key, type, user_id)
    VALUES (${word}, ${translation}, ${topic_id}, ${pn}, ${know}, ${img}, ${group_key}, ${type}, ${userId})
    RETURNING *
  `
  return result[0]
}

export async function updateWord(id, form, userId, role) {
  if (!userId) throw new Error("Користувач не авторизований")

  const result = await sql`SELECT user_id, topic_id FROM words WHERE id = ${id}`
  const existing = result[0]
  if (!existing) throw new Error("Слово не знайдено")

  if (role !== "admin" && userId !== existing.user_id) {
    throw new Error("Недостатньо прав для редагування")
  }

  const { word: w, translation = "", topic_id, know = false, img = "", group_key = "", type = "word" } = form

  // Якщо тема змінилась — беремо новий pn
  let pn = null
  if (Number(topic_id) !== Number(existing.topic_id)) {
    const maxPnRes = await sql`
      SELECT MAX(pn) AS maxpn FROM words WHERE topic_id = ${topic_id}
    `
    pn = (maxPnRes[0].maxpn || 0) + 1
  }

  await sql`
    UPDATE words
    SET word = ${w},
        translation = ${translation},
        topic_id = ${topic_id},
        know = ${know},
        img = ${img},
        group_key = ${group_key},
        type = ${type}
        ${pn !== null ? sql`, pn = ${pn}` : sql``}
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

// для розбивки на куски importCSV
export async function importBatch(sections, userId, reversImportCSV = false) {
  if (!userId) throw new Error("Користувач не авторизований")

  let importedWordsCount = 0
  let skippedWordsCount = 0
  let importedTopicsCount = 0
  let importedSectionsCount = 0
  let skippedTopicsCount = 0
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
            SELECT id FROM words
            WHERE ${reversImportCSV ? sql`translation = ${translation}` : sql`word = ${word}`}
            AND topic_id = ${topicId}
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

  return {
    importedWordsCount,
    skippedWordsCount,
    importedTopicsCount,
    importedSectionsCount,
    skippedTopicsCount,
    skippedSectionsCount,
  }
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
        const rawWord = parts[0]
        if (!rawWord) continue
        const word = reversImportCSV ? "" : rawWord
        const translation = reversImportCSV ? rawWord : parts[3] || ""
        const wordCount = rawWord.trim().split(/\s+/).length
        const group_key = parts[1] !== undefined && parts[1] !== "" ? parts[1] : wordCount === 1 ? rawWord : ""
        const type =
          parts[2] !== undefined && parts[2] !== ""
            ? parts[2]
            : wordCount === 1
              ? "word"
              : /[.?!]$/.test(rawWord)
                ? "sentence"
                : "phrase"
        const img = parts[4] || ""

        currentTopic.words.push({ word, group_key, type, translation, img })
      }
    }

    if (sections.every((s) => s.topics.length === 0)) {
      throw new Error("Не знайдено жодної теми для імпорту!")
    }

    return sections

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

// Переклад api.mymemory
// export async function translateWord(id, textToTranslate, fromLanguage, toLanguage, reversTranslate = false) {
//   const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
//     textToTranslate,
//   )}&langpair=${fromLanguage}|${toLanguage}`

//   const res = await fetch(apiUrl)
//   if (!res.ok) throw new Error("Не вдалося перекласти слово")

//   const data = await res.json()
//   const translated = data?.responseData?.translatedText ?? ""
//   const cleaned = translated.replace(/(^-+)|(-+$)/g, "").trim()

//   if (reversTranslate) {
//     await sql`UPDATE words SET word = ${cleaned} WHERE id = ${id}`
//   } else {
//     await sql`UPDATE words SET translation = ${cleaned} WHERE id = ${id}`
//   }

//   return cleaned
// }

// Переклад deepl.com
export async function translateWord(id, textToTranslate, fromLanguage, toLanguage, reversTranslate = false) {
  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: [textToTranslate],
      source_lang: fromLanguage.toUpperCase(),
      target_lang: toLanguage.toUpperCase(),
    }),
  })

  if (!res.ok) throw new Error("Не вдалося перекласти слово")

  const data = await res.json()
  const translated = data?.translations?.[0]?.text ?? ""
  const cleaned = translated.replace(/(^-+)|(-+$)/g, "").trim()

  if (reversTranslate) {
    await sql`UPDATE words SET word = ${cleaned} WHERE id = ${id}`
  } else {
    await sql`UPDATE words SET translation = ${cleaned} WHERE id = ${id}`
  }

  return cleaned
}



// Перерахунок pn після переміщення рядків
export async function updateWordsPn(words) {
  if (!words || words.length === 0) return

  const ids = words.map((w) => w.id)
  const pns = words.map((w) => w.pn)

  await sql`
    UPDATE words AS w
    SET pn = v.pn
    FROM unnest(${ids}::int[], ${pns}::int[]) AS v(id, pn)
    WHERE w.id = v.id
  `
}
// функція перекладу для читача (без запису в БД):
export async function translateText(text, fromLanguage, toLanguage) {
  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: [text],
      source_lang: fromLanguage.toUpperCase(),
      target_lang: toLanguage.toUpperCase(),
    }),
  })

  if (!res.ok) throw new Error("Не вдалося перекласти")

  const data = await res.json()
  return data?.translations?.[0]?.text ?? ""
}

// Додавання слова з читача з перевіркою дублікатів
// export async function addWordFromReader(word, translation, topicId, userId, force = false) {
//   if (!userId) throw new Error("Користувач не авторизований")

//   const wordNorm = word.trim().toLowerCase()

//   if (!force) {
//     // Перевірка дубліката по ВСІХ темах юзера
//     const existing = await sql`
//       SELECT words.id, topics.name AS topic_name, sections.name AS section_name
//       FROM words
//       JOIN topics ON words.topic_id = topics.id
//       JOIN sections ON topics.section_id = sections.id
//       WHERE LOWER(words.word) = ${wordNorm}
//         AND words.user_id = ${userId}
//       LIMIT 1
//     `

//     if (existing.length > 0) {
//       return {
//         status: "duplicate",
//         existingIn: `${existing[0].section_name} → ${existing[0].topic_name}`,
//       }
//     }
//   }

//   const maxPnRes = await sql`SELECT MAX(pn) AS maxpn FROM words WHERE topic_id = ${topicId}`
//   const pn = (maxPnRes[0].maxpn || 0) + 1

//   const wordCount = word.trim().split(/\s+/).length
//   const type = wordCount === 1 ? "word" : /[.?!]$/.test(word) ? "sentence" : "phrase"

//   const result = await sql`
//     INSERT INTO words (word, translation, topic_id, pn, know, img, group_key, type, user_id)
//     VALUES (${word.trim()}, ${translation}, ${topicId}, ${pn}, false, '', ${wordNorm}, ${type}, ${userId})
//     RETURNING *
//   `
//   return { status: "added", word: result[0] }
// }

// Знаходить або створює секцію "Нові слова" + тему по назві тексту
export async function getOrCreateInboxTopic(userId, textTitle) {
  if (!userId) throw new Error("Користувач не авторизований")

  const sectionName = "Нові слова"
  const topicName = textTitle?.trim() || new Date().toLocaleDateString("uk-UA")

  // 1. Шукаємо секцію "Нові слова" юзера
  let sectionId
  const sectionRes = await sql`
    SELECT id FROM sections
    WHERE name = ${sectionName}
      AND user_id = ${userId}
    LIMIT 1
  `

  if (sectionRes.length > 0) {
    sectionId = sectionRes[0].id
  } else {
    // Створюємо секцію
    const maxPnRes = await sql`SELECT MAX(pn) AS maxpn FROM sections`
    const pn = (maxPnRes[0].maxpn || 0) + 1
    const inserted = await sql`
      INSERT INTO sections (name, img, pn, user_id, is_private)
      VALUES (${sectionName}, 'inbox', ${pn}, ${userId}, true)
      RETURNING id
    `
    sectionId = inserted[0].id
  }

  // 2. Шукаємо тему по назві тексту
  let topicId
  const topicRes = await sql`
    SELECT id FROM topics
    WHERE name = ${topicName}
      AND section_id = ${sectionId}
    LIMIT 1
  `

  if (topicRes.length > 0) {
    topicId = topicRes[0].id
  } else {
    // Створюємо тему
    const maxPnRes = await sql`SELECT MAX(pn) AS maxpn FROM topics WHERE section_id = ${sectionId}`
    const pn = (maxPnRes[0].maxpn || 0) + 1
    const inserted = await sql`
      INSERT INTO topics (name, img, section_id, pn, user_id)
      VALUES (${topicName}, 'other', ${sectionId}, ${pn}, ${userId})
      RETURNING id
    `
    topicId = inserted[0].id
  }

  return { topicId, sectionName, topicName }
}

// Додавання слова з читача з перевіркою дублікатів
export async function addWordFromReader(word, translation, topicId, userId, force = false) {
  if (!userId) throw new Error("Користувач не авторизований")

  const wordNorm = word.trim().toLowerCase()

  if (!force) {
    // Перевірка дубліката по ВСІХ темах юзера
    const existing = await sql`
      SELECT words.id, topics.name AS topic_name, sections.name AS section_name
      FROM words
      JOIN topics ON words.topic_id = topics.id
      JOIN sections ON topics.section_id = sections.id
      WHERE LOWER(words.word) = ${wordNorm}
        AND words.user_id = ${userId}
      LIMIT 1
    `

    if (existing.length > 0) {
      return {
        status: "duplicate",
        existingIn: `${existing[0].section_name} → ${existing[0].topic_name}`,
      }
    }
  }

  const maxPnRes = await sql`SELECT MAX(pn) AS maxpn FROM words WHERE topic_id = ${topicId}`
  const pn = (maxPnRes[0].maxpn || 0) + 1

  const wordCount = word.trim().split(/\s+/).length
  const type = wordCount === 1 ? "word" : /[.?!]$/.test(word) ? "sentence" : "phrase"

  const result = await sql`
    INSERT INTO words (word, translation, topic_id, pn, know, img, group_key, type, user_id)
    VALUES (${word.trim()}, ${translation}, ${topicId}, ${pn}, false, '', ${wordNorm}, ${type}, ${userId})
    RETURNING *
  `
  return { status: "added", word: result[0] }
}

// Отримати всі слова юзера для підсвічування в читачі
export async function getUserWordsSet(userId) {
  if (!userId) return []
  const result = await sql`
    SELECT word FROM words WHERE user_id = ${userId}
  `
  return result.map((r) => r.word.toLowerCase())
}
