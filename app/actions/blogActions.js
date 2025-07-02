// app/actions/blogActions.js
"use server"

import { sql } from "@/lib/dbConfig"

export async function getPosts() {
  return await sql`
     SELECT posts.*, users.name AS user_name
    FROM posts
    LEFT JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
  `
}

export async function getPost(id) {
  const post = await sql`
   SELECT posts.*, users.name AS user_name
    FROM posts
    LEFT JOIN users ON posts.user_id = users.id
    WHERE posts.id = ${id}
    LIMIT 1
  `
  const comments = await sql`
    SELECT comments.*, users.name AS user_name
    FROM comments
    LEFT JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = ${id}
    ORDER BY comments.created_at ASC
  `
  return { post: post[0], comments }
}

export async function createPost(user_id, title, content) {
  await sql`
    INSERT INTO posts (user_id, title, content)
    VALUES (${user_id}, ${title}, ${content})
  `
}

export async function getPostById(id) {
  const result = await sql`
    SELECT posts.*, users.name
    FROM posts
    LEFT JOIN users ON posts.user_id = users.id
    WHERE posts.id = ${id}
  `
  return result[0]
}

export async function getCommentsByPostId(postId) {
  const comments = await sql`
    SELECT
      comments.id,
      comments.content,
      comments.created_at,
      users.name AS user_name
    FROM comments
    LEFT JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = ${postId}
    ORDER BY comments.created_at ASC
  `
  return comments
}

export async function addComment(post_id, user_id, content) {
  await sql`
    INSERT INTO comments (post_id, user_id, content)
    VALUES (${post_id}, ${user_id}, ${content})
  `
}
export async function deletePost(id) {
  await sql`
      DELETE FROM posts WHERE id = ${id}
    `
}

export async function updatePost(id, title, content) {
  await sql`
      UPDATE posts
      SET title = ${title}, content = ${content}
      WHERE id = ${id}
    `
}
export async function updateComment(id, content) {
  await sql`
      UPDATE comments
      SET content = ${content}
      WHERE id = ${id}
    `
}
export async function deleteComment(id) {
  await sql`
      DELETE FROM comments
      WHERE id = ${id}
    `
}