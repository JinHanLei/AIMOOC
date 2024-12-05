interface NotesResponse {
  notes: string
}

export async function getBiliNotes(url: string): Promise<string> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_ALGO_BASE_URL || 'http://localhost:3001'
    const response = await fetch(`${baseUrl}/notes`, {
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
      throw new Error('获取笔记失败')
    }

    const data: NotesResponse = await response.json()
    return data.notes
  } catch (error) {
    console.error('获取笔记失败:', error)
    throw error
  }
} 