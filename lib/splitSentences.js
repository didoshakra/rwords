// lib/splitSentences.js
// Спільне розбиття тексту на речення: імпорт тексту, плеєр, читалка.
// minLength: відкидати речення коротші за N символів (0 = не відкидати).
// keepWhitespace: true = зберігати пробіли й переноси після речення (для підсвітки на екрані).

const ABBR = /\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs|etc|i\.e|e\.g)\./gi
const SINGLE_CAP = /\b([A-Z])\./g
// Речення закінчується на . ! ? … (з можливими лапками), після яких пробіл чи кінець, або порожнім рядком
const SENTENCE_RE = /[\s\S]*?(?:[.!?…]+["'”’)\]]*(?=\s|$)|\n[ \t]*\n|$)\s*/g

export function splitSentences(text, { minLength = 0, keepWhitespace = false } = {}) {
  const raw = text || ""
  if (!raw.trim()) return []

  const prot = raw.replace(ABBR, "$1<DOT>").replace(SINGLE_CAP, "$1<DOT>")
  const parts = prot.match(SENTENCE_RE) || [prot]

  const out = []
  for (const part of parts) {
    const s = part.replace(/<DOT>/g, ".")
    const core = s.trim()
    if (!core || core.length < minLength) continue
    out.push(keepWhitespace ? s : core.replace(/\s+/g, " "))
  }
  return out
}
