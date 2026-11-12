// lib/importParser.js
// Універсальний парсер імпорту слів. Без "use server": це чиста функція.
// Формат файлу:
//   // коментар
//   **Назва секції[;посилання]
//   *Назва теми[;посилання]
//   #слово;переклад;...   <- заголовок: назви й порядок колонок саме цього файлу
//   рядки слів
// Без заголовка колонки йдуть за старою схемою: слово;група;тип;переклад;посилання
// Клітинки можуть бути в лапках ("a;b"). Розділювач (; , Tab) визначається за заголовком.
// Клітинка з переносом рядка всередині лапок не підтримується.
// Розпізнаються назви: слово/word/оригінал, переклад/translation, група/group/group_key, тип/type, посилання/link/img/image. Невідомі колонки ігноруються.
// Розділювач ;, , або Tab визначається за заголовком. Для Google Sheets експорт у CSV дає коми, це теж працює.

const COLUMN_ALIASES = {
  word: ["слово", "word", "оригінал", "original"],
  translation: ["переклад", "translation"],
  group_key: ["група", "group", "group_key", "groupkey"],
  type: ["тип", "type"],
  img: ["посилання", "link", "img", "image", "картинка"],
}

const DEFAULT_COLUMNS = ["word", "group_key", "type", "translation", "img"]

function detectDelimiter(text) {
  let best = ";"
  let max = 0
  for (const d of [";", "\t", ","]) {
    const n = text.split(d).length - 1
    if (n > max) {
      max = n
      best = d
    }
  }
  return best
}

function splitCells(line, delim) {
  const out = []
  let cur = ""
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cur += ch
      }
    } else if (ch === '"' && cur.trim() === "") {
      inQuotes = true
    } else if (ch === delim) {
      out.push(cur.trim())
      cur = ""
    } else {
      cur += ch
    }
  }
  out.push(cur.trim())
  return out
}

function parseHeader(headerText, delim) {
  const cells = splitCells(headerText, delim)
  const columns = cells.map((c) => {
    const name = c.trim().toLowerCase()
    return Object.keys(COLUMN_ALIASES).find((key) => COLUMN_ALIASES[key].includes(name)) || null
  })
  if (!columns.includes("word") && !columns.includes("translation")) {
    throw new Error(`Заголовок має містити колонку «слово» або «переклад». Знайдено: ${cells.join(" | ")}`)
  }
  return columns
}

export function parseImportText(fileContent) {
  const lines = String(fileContent || "")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.replace(/^[ \u00A0]+|[ \u00A0]+$/g, "")) // не чіпаємо Tab на краях
    .filter((l) => l.trim() !== "")

  if (lines.length < 2) throw new Error("Файл має містити мінімум секцію і тему!")

  const firstHeader = lines.find((l) => l.startsWith("#"))
  const delim = firstHeader ? detectDelimiter(firstHeader.slice(1)) : ";"

  let columns = DEFAULT_COLUMNS
  const sections = []
  let curSection = null
  let curTopic = null

  const startTopic = (cells) => {
    if (!cells[0]) throw new Error("Порожня назва теми")
    curTopic = { name: cells[0], link: cells[1] || "", words: [] }
    curSection.topics.push(curTopic)
  }

  for (const line of lines) {
    if (line.startsWith("//")) continue

    if (line.startsWith("#")) {
      columns = parseHeader(line.slice(1), delim)
      continue
    }

    if (line.startsWith("**")) {
      const cells = splitCells(line.slice(2), delim)
      if (!cells[0]) throw new Error("Порожня назва секції")
      curSection = { name: cells[0], link: cells[1] || "", topics: [] }
      sections.push(curSection)
      curTopic = null
      continue
    }

    if (line.startsWith("*")) {
      if (!curSection) throw new Error("Тема (*) не може йти до секції (**)")
      startTopic(splitCells(line.slice(1), delim))
      continue
    }

    if (!curSection) {
      throw new Error("Перший рядок (не коментар і не заголовок) має бути секцією (**НазваСекції)")
    }

    // Рядок без * одразу після секції вважаємо темою (сумісність зі старим форматом)
    if (!curTopic) {
      startTopic(splitCells(line, delim))
      continue
    }

    // Рядок слова
    const cells = splitCells(line, delim)
    const row = {}
    columns.forEach((key, idx) => {
      if (key && cells[idx] !== undefined) row[key] = cells[idx]
    })

    const word = row.word || ""
    const translation = row.translation || ""
    if (!word && !translation) continue

    const base = word || translation
    const wordCount = base.trim().split(/\s+/).length
    const group_key = row.group_key || (wordCount === 1 ? base : "")
    const type = row.type || (wordCount === 1 ? "word" : /[.?!…]$/.test(base.trim()) ? "sentence" : "phrase")
    const img = row.img || ""

    curTopic.words.push({ word, group_key, type, translation, img })
  }

  if (sections.every((s) => s.topics.length === 0)) {
    throw new Error("Не знайдено жодної теми для імпорту!")
  }

  return sections
}
