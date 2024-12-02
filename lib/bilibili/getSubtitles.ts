interface SubtitleItem {
  from: number
  to: number
  location: number
  content: string
}

interface SubtitleData {
  lan: string
  subtitle: SubtitleItem[]
}

export async function getBiliSubtitles(url: string): Promise<SubtitleData[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_ALGO_BASE_URL || 'http://localhost:3001'
    const response = await fetch(`${baseUrl}/subtitle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        url,
        cookie: process.env.BILIBILI_SESSION_TOKEN || ''
      })
    })

    if (!response.ok) {
      throw new Error('字幕获取失败')
    }

    return await response.json()
  } catch (error) {
    console.error('获取字幕失败:', error)
    throw error
  }
} 