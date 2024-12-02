import { VideoInfo } from '~/lib/types'

export async function getVideoInfo(bvid: string): Promise<Partial<VideoInfo>> {
  try {
    const response = await fetch(`/api/bilibili/info?bvid=${bvid}`)

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