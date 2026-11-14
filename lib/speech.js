// lib/speech.js
// Спільні функції озвучки (speechSynthesis): вибір голосу й розбиття довгого тексту.

export const norm = (l) => (l || "").toLowerCase().replace("_", "-")

const isNatural = (v) => /natural|online/i.test(v.name)

export function pickVoice(lang, name) {
  const voices = window.speechSynthesis.getVoices()
  if (name) {
    const byName = voices.find((v) => v.name === name)
    if (byName) return byName
  }
  const l = norm(lang)
  const exact = voices.filter((v) => norm(v.lang) === l)
  const loose = voices.filter((v) => norm(v.lang).startsWith(l.slice(0, 2)))
  const pool = exact.length ? exact : loose
  return pool.find(isNatural) || pool[0] || null
}

// Довгі тексти ріжемо за реченнями (Chrome обриває довге мовлення)
export function chunkText(text, max = 180) {
  const clean = (text || "").replace(/\s+/g, " ").trim()
  if (!clean) return []
  const sentences = (clean.match(/[^.!?…]+[.!?…]*/g) || [clean]).map((s) => s.trim()).filter(Boolean)
  const out = []
  let buf = ""
  for (const s of sentences) {
    if ((buf + " " + s).trim().length <= max) {
      buf = (buf + " " + s).trim()
      continue
    }
    if (buf) out.push(buf)
    if (s.length <= max) {
      buf = s
      continue
    }
    let part = ""
    for (const w of s.split(" ")) {
      if ((part + " " + w).trim().length > max) {
        out.push(part)
        part = w
      } else {
        part = (part + " " + w).trim()
      }
    }
    buf = part
  }
  if (buf) out.push(buf)
  return out
}
