import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { bvid } = req.query

  if (!bvid || typeof bvid !== 'string') {
    return res.status(400).json({ error: '缺少必要的 bvid 参数' })
  }

  try {
    const response = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    const data = await response.json()
    
    if (data.code === 0 && data.data) {
      const { title, desc, owner, duration, pubdate, pages } = data.data
      return res.status(200).json({
        title,
        description: desc,
        owner: {
          name: owner.name,
          face: owner.face
        },
        duration,
        pubdate,
        pages
      })
    } else {
      throw new Error(data.message || '获取视频信息失败')
    }
  } catch (error) {
    console.error('获取B站视频信息失败:', error)
    return res.status(500).json({ error: '获取视频信息失败' })
  }
} 