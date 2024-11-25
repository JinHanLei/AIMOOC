interface VideoInfo {
  title: string
  description: string
  owner: {
    name: string
    face: string
  }
  duration: number
  pubdate: number
}

export async function getVideoInfo(bvid: string): Promise<VideoInfo> {
  try {
    // 使用API路由获取视频信息
    const response = await fetch(`/api/bilibili/video?bvid=${bvid}`)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || '获取视频信息失败')
    }
    
    return data
  } catch (error) {
    console.error('获取B站视频信息失败:', error)
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
      },
      duration: 0,  // 慕课视频通常不提供时长
      pubdate: Date.now() / 1000
    }
  } catch (error) {
    console.error('获取慕课视频信息失败:', error)
    throw error
  }
} 