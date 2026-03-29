// auth/tiktok/Цей роут перенаправляє користувача на сторінку логіну TikTok.
export default function handler(req, res) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY
  const redirectUri = encodeURIComponent("https://rwords.vercel.app/api/auth/callback/tiktok")
  const scope = "user.info.basic,video.upload,video.publish"

  // Унікальний стан для захисту від CSRF та прив'язки до юзера в майбутній БД
  const state = Math.random().toString(36).substring(7)

  const authUrl =
    `https://www.tiktok.com/v2/auth/authorize/` +
    `?client_key=${clientKey}` +
    `&scope=${scope}` +
    `&response_type=code` +
    `&redirect_uri=${redirectUri}` +
    `&state=${state}`

  res.redirect(authUrl)
}
