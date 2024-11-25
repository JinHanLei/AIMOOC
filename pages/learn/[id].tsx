import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import getVideoId from 'get-video-id'
import { VideoService } from '~/lib/types'
import { extractUrl, extractPage } from '~/utils/extractUrl'
import { getVideoInfo, getIcourseInfo } from '~/lib/bilibili/getVideoInfo'
import { Sidebar } from '~/components/Learn/Sidebar'
import { openDB } from 'idb'
import { toast } from 'react-hot-toast'
import { AINotes } from '~/components/Learn/AINotes'
import { VideoPlayer } from '~/components/Learn/VideoPlayer'
import { isLoggedIn } from '~/lib/auth'
import { parseIcourseUrl } from '~/utils/parseIcourseUrl'

interface VideoInfo {
  service: VideoService | 'local' | 'icourse'
  videoId: string
  embedUrl: string
  title?: string
  courseId?: string
  termId?: string
  page?: number
}

const LearnPage: NextPage<{
  showSignIn: (show: boolean) => void
}> = ({ showSignIn }) => {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    if (!id) return

    const savedData = localStorage.getItem(`learning_${id}`)
    if (!savedData) {
      router.push('/')
      return
    }

    const { url } = JSON.parse(savedData)
    
    async function fetchVideoInfo() {
      if (url.startsWith('indexeddb://')) {
        try {
          const videoId = url.replace('indexeddb://', '')
          const db = await openDB('videoDB', 1)
          const videoFile = await db.get('videos', videoId)
          
          if (!videoFile) {
            throw new Error('视频文件不存在')
          }

          const videoUrl = URL.createObjectURL(videoFile)
          setVideoInfo({
            service: 'local',
            videoId: 'local',
            embedUrl: videoUrl,
            title: videoFile.name || '本地视频'
          })
        } catch (error) {
          console.error('获取本地视频失败:', error)
          toast.error("视频文件可能已被删除")
        }
      } else if (url.includes('bilibili.com')) {
        const bvid = extractUrl(url)
        const page = extractPage(url, new URLSearchParams(url.split('?')[1]))
        
        if (bvid) {
          try {
            const info = await getVideoInfo(bvid)
            setVideoInfo({
              service: VideoService.Bilibili,
              videoId: bvid,
              embedUrl: `//player.bilibili.com/player.html?bvid=${bvid}&page=${page || 1}&high_quality=1&danmaku=0`,
              page: page ? Number(page) : 1,
              ...info
            })
          } catch (error) {
            console.error('获取视频信息失败:', error)
            setVideoInfo({
              service: VideoService.Bilibili,
              videoId: bvid,
              embedUrl: `//player.bilibili.com/player.html?bvid=${bvid}&page=${page || 1}&high_quality=1&danmaku=0`,
              page: page ? Number(page) : 1
            })
          }
        }
      } else if (url.includes('icourse163.org')) {
        const params = parseIcourseUrl(url)
        if (params) {
          try {
            if (!params.courseId || !params.termId || !params.contentId) {
              throw new Error('缺少必要的课程参数')
            }
            const info = await getIcourseInfo(params.courseId, params.termId, params.contentId)
            setVideoInfo({
              service: 'icourse',
              videoId: params.contentId || '',
              courseId: params.courseId,
              termId: params.termId,
              embedUrl: url,
              ...info
            })
          } catch (error) {
            console.error('获取慕课信息失败:', error)
            setVideoInfo({
              service: 'icourse',
              videoId: params.contentId || '',
              courseId: params.courseId,
              termId: params.termId,
              embedUrl: url,
              title: '中国大学MOOC课程'
            })
          }
        }
      } else {
        const { id: videoId, service } = getVideoId(url)
        if (videoId && service === 'youtube') {
          setVideoInfo({
            service: VideoService.Youtube,
            videoId,
            embedUrl: `https://www.youtube.com/embed/${videoId}`
          })
        }
      }
      setLoading(false)
    }

    fetchVideoInfo()
  }, [id, router])

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="ml-[240px] flex flex-1">
        <div className="flex w-[60%] flex-col overflow-hidden">
          <VideoPlayer videoInfo={videoInfo} loading={loading} />
        </div>
        <div className="w-[40%] overflow-hidden border-l border-gray-100 dark:border-gray-800/50">
          <AINotes />
        </div>
      </main>
    </div>
  )
}

export default LearnPage 