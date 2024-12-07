import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { extractUrl, extractPage } from '~/utils/extractUrl'
import { getVideoInfo } from '~/lib/bilibili/getVideoInfo'
import { Sidebar } from '~/components/Learn/Sidebar'
import { toast } from 'react-hot-toast'
import { AINotes } from '~/components/Learn/AIMooc'
import { VideoPlayer } from '~/components/Learn/VideoPlayer'
import type { SubtitleData, VideoInfo } from '~/lib/types'
import { getBiliVideo } from '~/lib/bilibili/getVideo'
import { VideoService } from '~/lib/types'
import { getBiliSubtitles } from '~/lib/bilibili/getSubtitles'

interface PageState {
  loading: boolean
  listLoading: boolean
  videoInfo: VideoInfo | null
  subtitles: SubtitleData[] | null
}

const LearnPage: NextPage<{
  showSignIn: (show: boolean) => void
}> = ({ showSignIn }) => {
  const router = useRouter()
  const { id } = router.query
  const videoRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<PageState>({
    loading: true,
    listLoading: true,
    videoInfo: null,
    subtitles: null,
  })
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    if (!id) return

    const savedData = localStorage.getItem(`learning_${id}`)
    if (!savedData) {
      router.push('/')
      return
    }

    const { url, config } = JSON.parse(savedData)

    async function fetchVideoInfo() {
      try {
        if (url.includes('bilibili.com')) {
          const bvid = extractUrl(url)
          const page = extractPage(url, new URLSearchParams(url.split('?')[1]))

          if (bvid) {
            try {
              // 先获取视频信息
              const info = await getVideoInfo(bvid)
              setState((prev) => ({
                ...prev,
                videoInfo: {
                  ...info,
                  service: VideoService.Bilibili,
                  videoId: bvid,
                  embedUrl: '', // 先设置为空
                  page: page ? Number(page) : 1,
                },
                listLoading: false,
              }))

              // 获取视频
              setState((prev) => ({ ...prev, loading: true }))
              const videoUrl = await getBiliVideo(url)

              // 更新视频URL
              setState((prev) => ({
                ...prev,
                loading: false,
                videoInfo: prev.videoInfo
                  ? {
                      ...prev.videoInfo,
                      embedUrl: videoUrl,
                    }
                  : null,
              }))

              // 获取字幕
              const subtitles = await getBiliSubtitles(url)
              setState((prev) => ({
                ...prev,
                subtitles,
              }))
            } catch (error) {
              setState((prev) => ({
                ...prev,
                loading: false,
                videoInfo: prev.videoInfo, // 保留已获取的视频信息
              }))
              toast.error('视频加载失败')
            }
          }
        }
      } catch (error) {
        console.error('获取视频失败:', error)
        setState((prev) => ({
          ...prev,
          loading: false,
          videoInfo: null,
        }))
        toast.error('视频加载失败')
      }
    }

    fetchVideoInfo()
  }, [id, router])

  const handlePartChange = async (page: number) => {
    // 先更新页码，实现即时高亮
    setState((prev) => ({
      ...prev,
      loading: true,
      videoInfo: prev.videoInfo
        ? {
            ...prev.videoInfo,
            page, // 立即更新页码
          }
        : null,
    }))

    try {
      const savedData = localStorage.getItem(`learning_${id}`)
      if (!savedData) return

      const { url } = JSON.parse(savedData)
      const videoUrl = await getBiliVideo(url)

      // 只更新视频URL
      setState((prev) => ({
        ...prev,
        loading: false,
        videoInfo: prev.videoInfo
          ? {
              ...prev.videoInfo,
              embedUrl: videoUrl,
            }
          : null,
      }))
    } catch (error) {
      console.error('切换课程失败:', error)
      setState((prev) => ({
        ...prev,
        loading: false,
      }))
      toast.error('视频加载失败')
    }
  }

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time)
  }

  const handleTimeClick = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar currentTime={currentTime} currentPage={state.videoInfo?.page} parts={state.videoInfo?.pages} />
      <main className="ml-[240px] flex flex-1">
        <div className="flex w-[60%] flex-col overflow-hidden">
          <VideoPlayer
            videoRef={videoRef}
            videoInfo={state.videoInfo}
            loading={state.loading}
            onTimeUpdate={handleTimeUpdate}
          />
        </div>
        <div className="w-[40%] overflow-hidden border-l border-gray-100 dark:border-gray-800/50">
          <AINotes
            subtitles={state.subtitles}
            parts={state.videoInfo?.pages}
            currentPage={state.videoInfo?.page}
            bvid={state.videoInfo?.videoId}
            onPartChange={handlePartChange}
            currentTime={currentTime}
            onTimeClick={handleTimeClick}
            loading={state.listLoading}
            learningId={id as string}
          />
        </div>
      </main>
    </div>
  )
}

export default LearnPage
