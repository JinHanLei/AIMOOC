export async function downloadBiliVideo(url: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:3001/bili', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    })

    if (!response.ok) {
      throw new Error('视频下载失败')
    }

    // 创建 Blob URL
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('下载视频失败:', error)
    throw error
  }
} 