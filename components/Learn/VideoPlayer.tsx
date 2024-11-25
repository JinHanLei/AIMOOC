import { useEffect } from 'react'
import { VideoService } from '~/lib/types'

interface VideoInfo {
  service: VideoService | 'local' | 'icourse'
  videoId: string
  embedUrl: string
  title?: string
  description?: string
  owner?: {
    name: string
    face: string
  }
  duration?: number
  pubdate?: number
  page?: number
  courseId?: string
  termId?: string
}

interface VideoPlayerProps {
  videoInfo: VideoInfo | null
  loading?: boolean
}

export function VideoPlayer({ videoInfo, loading }: VideoPlayerProps) {
  useEffect(() => {
    return () => {
      if (videoInfo?.service === 'local' && videoInfo.embedUrl) {
        URL.revokeObjectURL(videoInfo.embedUrl)
      }
    }
  }, [videoInfo])

  return (
    <div className="w-full flex-shrink-0 bg-white p-4 dark:bg-gray-900">
      <div className="mx-auto max-w-[720px] rounded-lg border border-gray-100 bg-white dark:border-gray-800/50 dark:bg-gray-800">
        <div className="p-4">
          {videoInfo?.embedUrl ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              {videoInfo.service === 'local' ? (
                <video
                  src={videoInfo.embedUrl}
                  className="absolute inset-0 h-full w-full"
                  controls
                  autoPlay={false}
                />
              ) : videoInfo.service === 'icourse' ? (
                <iframe
                  src={`https://www.icourse163.org/mob/course/learn/content?courseId=${videoInfo.courseId}&tid=${videoInfo.termId}&_trace_c_p_k2_=1#/learn/content?type=detail&id=${videoInfo.videoId}`}
                  className="absolute inset-0 h-full w-full"
                  allowFullScreen
                  allow="fullscreen"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
                  frameBorder="0"
                />
              ) : (
                <iframe
                  src={videoInfo.embedUrl}
                  className="absolute inset-0 h-full w-full"
                  allowFullScreen
                  allow="fullscreen"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
                  frameBorder="0"
                />
              )}
            </div>
          ) : (
            <div className="aspect-video w-full rounded-lg bg-gray-100 dark:bg-gray-800">
              <div className="flex h-full items-center justify-center text-gray-500">
                {loading ? '加载中...' : '无法加载视频'}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800/50">
          <div className="max-h-[180px] overflow-y-auto p-4">
            <div className="space-y-4">
              {videoInfo?.title && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {videoInfo.title}
                  </h1>
                  {videoInfo.description && (
                    <p className="mt-2 whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                      {videoInfo.description}
                    </p>
                  )}
                </div>
              )}

              <div className="grid gap-2 border-t border-gray-100 pt-4 dark:border-gray-800/50">
                <p>平台：{
                  videoInfo?.service === VideoService.Youtube ? 'YouTube' : 
                  videoInfo?.service === 'local' ? '本地视频' : 
                  videoInfo?.service === 'icourse' ? '中国大学MOOC' :
                  '哔哩哔哩'
                }</p>
                {videoInfo?.videoId !== 'local' && (
                  <>
                    <p>视频ID：{videoInfo?.videoId}</p>
                    {videoInfo?.service === VideoService.Bilibili && videoInfo.page && (
                      <p>分P：P{videoInfo.page}</p>
                    )}
                    {videoInfo?.owner && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">UP主：</span>
                        <div className="flex items-center gap-2">
                          <img 
                            src={videoInfo.owner.face}
                            alt={videoInfo.owner.name}
                            className="h-6 w-6 rounded-full"
                            referrerPolicy="no-referrer"
                          />
                          <span>{videoInfo.owner.name}</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 