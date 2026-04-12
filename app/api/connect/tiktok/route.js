// app/api/connect/tiktok/route.js/Цей роут перенаправляє користувача на сторінку логіну TikTok.

import { NextResponse } from "next/server"

export async function GET() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY
  // Важливо: цей URL має бути в TikTok Developer Console
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/connect/tiktok/callback`

  const authUrl =
    `https://www.tiktok.com/v2/auth/authorize/` +
    `?client_key=${clientKey}` +
    `&scope=user.info.basic,video.upload,video.publish` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=vlad_secure_state`

  return NextResponse.redirect(authUrl)
}