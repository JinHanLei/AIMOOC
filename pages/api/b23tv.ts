import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: '缺少必要的 url 参数' })
  }

  try {
    // 发送请求到 b23.tv 获取重定向 URL
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    // 获取重定向的 URL
    const redirectUrl = response.headers.get('location')
    
    if (!redirectUrl) {
      throw new Error('无法获取重定向链接')
    }

    return res.status(200).json({ url: redirectUrl })
  } catch (error) {
    console.error('转换短链接失败:', error)
    return res.status(500).json({ error: '转换短链接失败' })
  }
} 