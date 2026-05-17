// app/api/video/route.js
// POST /api/video — запускає генерацію і повертає request_id
// GET /api/video?id=xxx — перевіряє статус

export async function POST(req) {
  try {
    const { prompt, duration = 10, aspectRatio = '9:16' } = await req.json()

    if (!prompt) {
      return Response.json({ error: 'Промпт відсутній' }, { status: 400 })
    }

    const apiKey = process.env.XAI_API_KEY
    if (!apiKey) {
      return Response.json({ error: 'XAI_API_KEY не знайдено' }, { status: 500 })
    }

    console.log('Starting video generation with xAI...')

    const response = await fetch('https://api.x.ai/v1/videos/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-imagine-video',
        prompt,
        duration,
        aspect_ratio: aspectRatio,
        resolution: '720p',
      }),
    })

    const rawText = await response.text()
    console.log('xAI generate response:', response.status, rawText)

    if (!response.ok) {
      return Response.json({ error: rawText }, { status: 500 })
    }

    const data = JSON.parse(rawText)
    const requestId = data.request_id || data.id

    console.log('Video generation started, request_id:', requestId)

    return Response.json({
      request_id: requestId,
      status: 'processing',
    })
  } catch (err) {
    console.error('Video route error:', err.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const requestId = searchParams.get('id')

    if (!requestId) {
      return Response.json({ error: 'ID не вказано' }, { status: 400 })
    }

    const apiKey = process.env.XAI_API_KEY

    const response = await fetch(
      `https://api.x.ai/v1/videos/${requestId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const rawText = await response.text()
    console.log('xAI status response:', response.status, rawText.substring(0, 200))

    // 202 = ще генерується
    if (response.status === 202) {
      return Response.json({ status: 'processing' })
    }

    if (!response.ok) {
      return Response.json({ error: rawText }, { status: 500 })
    }

    const data = JSON.parse(rawText)

    // 200 = готово
    if (data.status === 'done' || response.status === 200) {
      const videoUrl = data.video?.url

      if (!videoUrl) {
        // Перевіряємо модерацію
        if (data.video?.respect_moderation === false) {
          return Response.json({ error: 'Відео заблоковано модерацією' }, { status: 500 })
        }
        return Response.json({ status: 'processing' })
      }

      // Завантажуємо відео
      const videoResponse = await fetch(videoUrl)
      const arrayBuffer = await videoResponse.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')

      console.log('✅ Відео згенеровано успішно!')
      return Response.json({
        status: 'done',
        video: base64,
        mimeType: 'video/mp4',
      })
    }

    if (data.status === 'failed') {
      return Response.json({ status: 'failed', error: 'Генерація не вдалась' })
    }

    return Response.json({ status: data.status || 'processing' })
  } catch (err) {
    console.error('Video status error:', err.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
