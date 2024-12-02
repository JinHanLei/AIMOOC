import { VideoInfo } from '~/lib/types'

// 获取视频信息
export async function getVideoInfo(bvid: string): Promise<Partial<VideoInfo>> {
  try {
    const response = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.bilibili.com'
      }
    })

    if (!response.ok) {
      throw new Error('获取视频信息失败')
    }

    const json = await response.json()
    const data = json.data

    return {
      title: data.title,
      description: data.desc,
      owner: {
        name: data.owner.name,
        face: data.owner.face
      },
      pages: data.pages
    }
  } catch (error) {
    console.error('获取视频信息失败:', error)
    throw error
  }
}

// 获取视频流
export async function getBiliVideo(url: string): Promise<string> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_ALGO_BASE_URL
    const response = await fetch(`${baseUrl}/bili`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    })

    if (!response.ok) {
      throw new Error('获取视频流失败')
    }

    // 创建 Blob URL
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('获取视频流失败:', error)
    throw error
  }
}

// 将秒数转换为时间格式
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 格式化发布时间
export function formatPublishDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 添加慕课视频信息获取函数
export async function getIcourseInfo(courseId: string, termId: string, contentId: string) {
  try {
    // 这里可以添加实际的慕课API调用
    // 目前返回一个模拟的结果
    return {
      title: '中国大学MOOC课程',
      description: '课程内容',
      owner: {
        name: '授课教师',
        face: '/default-teacher-avatar.png'  // 默认头像
      }
    }
  } catch (error) {
    console.error('获取慕课视频信息失败:', error)
    throw error
  }
} 