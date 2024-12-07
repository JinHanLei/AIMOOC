import { useEffect, useRef, useState } from 'react'
import { VideoService, VideoInfo } from '~/lib/types'
import { Loader2 } from 'lucide-react'
import { cn } from '~/lib/utils'
import { VideoControls } from './VideoControls'

interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>
  videoInfo: VideoInfo | null
  loading?: boolean
  onTimeUpdate?: (time: number) => void
}

export function VideoPlayer({ videoRef, videoInfo, loading, onTimeUpdate }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [showControls, setShowControls] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const hideControlsTimer = useRef<NodeJS.Timeout>()

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        containerRef.current.requestFullscreen()
      }
    }
  }

  useEffect(() => {
    if (loading) {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
        videoRef.current.style.visibility = 'hidden'
      }
      if (iframeRef.current) {
        iframeRef.current.style.visibility = 'hidden'
      }
    } else {
      if (videoRef.current) {
        videoRef.current.style.visibility = 'visible'
      }
      if (iframeRef.current) {
        iframeRef.current.style.visibility = 'visible'
      }
    }
  }, [loading])

  useEffect(() => {
    return () => {
      if (videoInfo?.embedUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(videoInfo.embedUrl)
      }
    }
  }, [videoInfo?.embedUrl])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      console.log('play event') // 调试用
      setIsPlaying(true)
    }

    const handlePause = () => {
      console.log('pause event') // 调试用
      setIsPlaying(false)
    }

    const handleEnded = () => {
      console.log('ended event') // 调试用
      setIsPlaying(false)
    }

    // 添加事件监听
    video.addEventListener('play', handlePlay)
    video.addEventListener('playing', handlePlay) // 添加 playing 事件监听
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('waiting', handlePause) // 添加 waiting 事件监听

    // 初始状态设置
    setIsPlaying(!video.paused)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('playing', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('waiting', handlePause)
    }
  }, [videoRef.current])

  const handleContainerClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.video-controls')) {
      return
    }

    const video = videoRef.current
    if (video) {
      if (video.paused) {
        video
          .play()
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error('播放失败:', error)
            setIsPlaying(false)
          })
      } else {
        video.pause()
        setIsPlaying(false)
      }
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    resetHideControlsTimer()
  }

  const handleMouseLeave = () => {
    setShowControls(false)
  }

  const resetHideControlsTimer = () => {
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current)
    }
    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 2000)
  }

  useEffect(() => {
    return () => {
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current)
      }
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      onTimeUpdate?.(video.currentTime)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [videoRef, onTimeUpdate])

  return (
    <div className="w-full flex-shrink-0 bg-white px-2 dark:bg-gray-900">
      <div className="mx-auto rounded-lg border border-gray-100 bg-white dark:border-gray-800/50 dark:bg-gray-800">
        <div className="p-4">
          <div
            ref={containerRef}
            className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg bg-black"
            onClick={handleContainerClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-20" />
                    <div className="relative rounded-full bg-blue-500 p-3">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  </div>
                  <div className="text-sm font-medium text-white drop-shadow-lg">正在加载视频...</div>
                </div>
              </div>
            )}

            {videoInfo?.embedUrl ? (
              videoInfo.embedUrl.startsWith('blob:') ? (
                <>
                  <video
                    ref={videoRef}
                    src={videoInfo.embedUrl}
                    className="absolute inset-0 h-full w-full"
                    playsInline
                  />
                  <VideoControls
                    videoRef={videoRef}
                    onFullscreen={handleFullscreen}
                    isPlaying={isPlaying}
                    className={cn(
                      'video-controls transition-opacity duration-300',
                      showControls ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </>
              ) : (
                <iframe
                  ref={iframeRef}
                  src={videoInfo.embedUrl}
                  className="absolute inset-0 h-full w-full"
                  allowFullScreen
                  allow="fullscreen"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              )
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">无法加载视频</div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800/50">
          <div className="max-h-[180px] overflow-y-auto p-4">
            <div className="space-y-4">
              {videoInfo?.title && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{videoInfo.title}</h1>
                  {videoInfo.description && (
                    <p className="mt-2 whitespace-pre-wrap text-gray-600 dark:text-gray-400">{videoInfo.description}</p>
                  )}
                </div>
              )}

              <div className="grid gap-2 border-t border-gray-100 pt-4 dark:border-gray-800/50">
                <p>
                  平台：
                  {
                    // videoInfo?.service === VideoService.Youtube ? 'YouTube' :
                    videoInfo?.service === VideoService.LocalVideo
                      ? '本地视频'
                      : videoInfo?.service === VideoService.Icourse
                      ? '中国大学MOOC'
                      : videoInfo?.service === VideoService.Bilibili
                      ? '哔哩哔哩'
                      : '未知'
                  }
                </p>
                {videoInfo?.videoId !== 'local' && (
                  <>
                    <p>视频ID：{videoInfo?.videoId}</p>
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
