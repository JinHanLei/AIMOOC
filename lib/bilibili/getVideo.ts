export async function getBiliVideo(url: string): Promise<string> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_ALGO_BASE_URL || 'http://localhost:3001'
    const response = await fetch(`${baseUrl}/video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        cookie: process.env.BILIBILI_SESSION_TOKEN || '',
      }),
    })

    if (!response.ok) {
      throw new Error('视频获取失败')
    }

    // 使用 Response.blob() 替代直接创建 Blob
    try {
      const blob = await response.blob()
      return URL.createObjectURL(blob)
    } catch (error) {
      console.warn('流式加载中，请稍候...', error)
      // 如果第一次失败，给一个短暂延迟后重试
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const retryBlob = await response.blob()
      return URL.createObjectURL(retryBlob)
    }
  } catch (error) {
    console.error('获取视频失败:', error)
    throw error
  }
}
