export async function getBiliVideo(url: string): Promise<string> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_ALGO_BASE_URL || 'http://localhost:3001'
    const response = await fetch(`${baseUrl}/bili`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        url,
        cookie: process.env.BILIBILI_SESSION_TOKEN || ''  // 同时在请求体中传递 cookie
      })
    })

    if (!response.ok) {
      throw new Error('视频获取失败')
    }

    // 创建 Blob URL
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('获取视频失败:', error)
    throw error
  }
} 