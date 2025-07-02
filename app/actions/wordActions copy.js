// app/actions/wordActions.js
export async function getWords() {
  return await sql`SELECT * FROM words ORDER BY pn`
}

export async function createWord(word, translation, img = "", pn = 0, topic_id, user_id) {
  if (!user_id) throw new Error("Неавторизований запит")

  const result = await sql`
      INSERT INTO words (word, translation, img, pn, topic_id, user_id)
      VALUES (${word}, ${translation}, ${img}, ${pn}, ${topic_id}, ${user_id})
      RETURNING *
    `
  return result[0]
}

export async function updateWord(id, word, translation, img, pn, topic_id, currentUser) {
  if (!currentUser) throw new Error("Неавторизовано")

  const record = await sql`SELECT user_id FROM words WHERE id = ${id}`
  if (record.length === 0 || (record[0].user_id !== currentUser.id && currentUser.role !== "admin")) {
    throw new Error("Недостатньо прав")
  }

  const result = await sql`
      UPDATE words
      SET word = ${word}, translation = ${translation}, img = ${img}, pn = ${pn}, topic_id = ${topic_id}
      WHERE id = ${id}
      RETURNING *
    `
  return result[0]
}

export async function deleteWord(id, currentUser) {
  if (!currentUser) throw new Error("Неавторизовано")

  const word = await sql`SELECT user_id FROM words WHERE id = ${id}`
  if (word.length === 0 || (word[0].user_id !== currentUser.id && currentUser.role !== "admin")) {
    throw new Error("Недостатньо прав")
  }

  await sql`DELETE FROM words WHERE id = ${id}`
  return true
}