import { FC, useState, useEffect } from 'react'
import { 
  Play, Pause, Volume2, VolumeX, 
  Settings, Maximize, SkipBack, SkipForward,
  ChevronDown
} from 'lucide-react'
import { cn } from '~/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>
  onFullscreen: () => void
  className?: string
  isPlaying: boolean
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2]

export const VideoControls: FC<VideoControlsProps> = ({ 
  videoRef, 
  onFullscreen,
  className,
  isPlaying 
}) => {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [seekTime, setSeekTime] = useState<number | null>(null)
  const [previewTime, setPreviewTime] = useState<number | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleDurationChange = () => setDuration(video.duration)
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1))
      }
    }
    const handleVolumeChange = () => {
      setVolume(video.volume)
      setMuted(video.muted)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('progress', handleProgress)
    video.addEventListener('volumechange', handleVolumeChange)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [videoRef])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handlePlayPause = async () => {
    const video = videoRef.current
    if (!video) return

    try {
      if (video.paused) {
        await video.play()
      } else {
        video.pause()
      }
    } catch (error) {
      console.error('播放/暂停出错:', error)
    }
  }

  const handleSeek = (clientX: number, container: HTMLElement) => {
    const progressBarRect = container.querySelector('.progress-bar')?.getBoundingClientRect()
    if (!progressBarRect) return

    const percent = Math.max(0, Math.min((clientX - progressBarRect.left) / progressBarRect.width, 1))
    const newTime = percent * duration

    setSeekTime(newTime)
    setCurrentTime(newTime)

    if (!isDragging) {
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = newTime
          setSeekTime(null)
        }
      })
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const container = document.querySelector('.progress-container') as HTMLElement
        if (container) {
          handleSeek(e.clientX, container)
        }
      }
    }

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        if (seekTime !== null && videoRef.current) {
          videoRef.current.currentTime = seekTime
          setSeekTime(null)
        }
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, seekTime])

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.volume = value
      videoRef.current.muted = value === 0
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted
    }
  }

  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      const wasPlaying = !videoRef.current.paused
      videoRef.current.playbackRate = rate
      setPlaybackRate(rate)
      if (wasPlaying) {
        videoRef.current.play()
      }
    }
  }

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  const handlePreviewMove = (clientX: number, container: HTMLElement) => {
    const rect = container.getBoundingClientRect()
    const percent = Math.max(0, Math.min((clientX - rect.left) / rect.width, 1))
    setPreviewTime(percent * duration)
  }

  return (
    <div className={cn(
      "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4",
      className,
      showSpeedMenu && "!opacity-100"
    )}>
      {/* 进度条容器 */}
      <div 
        className="progress-container group relative h-6 w-full cursor-pointer py-2"
        onMouseDown={(e) => {
          setIsDragging(true)
          handleSeek(e.clientX, e.currentTarget)
        }}
        onMouseMove={(e) => {
          handlePreviewMove(e.clientX, e.currentTarget.querySelector('.progress-bar') as HTMLElement)
        }}
        onMouseLeave={() => {
          setPreviewTime(null)
        }}
      >
        <div className="progress-bar absolute left-0 right-0 top-1/2 -translate-y-1/2">
          {/* 底层进度条（已加载部分） */}
          <div className="absolute inset-0 h-1 rounded-full bg-white/20">
            <div 
              className="absolute inset-y-0 left-0 rounded-full bg-white/40 transition-all"
              style={{ width: `${(buffered / duration * 100) || 0}%` }}
            />
          </div>
          
          {/* 播放进度条 */}
          <div 
            className="absolute inset-y-0 left-0 h-1 rounded-full bg-blue-500"
            style={{ 
              width: `${((seekTime ?? currentTime) / duration * 100) || 0}%`,
              transition: isDragging ? 'none' : 'all'
            }}
          />

          {/* 预览时间 */}
          {previewTime !== null && (
            <div 
              className="absolute -top-8 rounded bg-black/80 px-2 py-1 text-xs text-white select-none pointer-events-none transform -translate-x-1/2"
              style={{ 
                left: `${(previewTime / duration * 100) || 0}%`
              }}
            >
              {formatTime(previewTime)}
            </div>
          )}

          {/* 进度条拖动点 */}
          <div 
            className={cn(
              "absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-blue-500 -translate-x-1/2",
              "opacity-0 transition-opacity group-hover:opacity-100",
              isDragging && "opacity-100 scale-125"
            )}
            style={{ 
              left: `${((seekTime ?? currentTime) / duration * 100) || 0}%`
            }}
          />
        </div>

        {/* 悬停时显示的放大效果 */}
        <div className="absolute inset-0 top-1/2 h-1 -translate-y-1/2 scale-y-100 rounded-full opacity-0 transition-all group-hover:scale-y-150 group-hover:opacity-100" />
      </div>

      <div className="mt-2 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          

          {/* 快退按钮 */}
          <button onClick={() => handleSkip(-10)} className="hover:text-blue-400">
            <SkipBack className="h-4 w-4" />
          </button>
          {/* 播放/暂停按钮 */}
          <button 
            onClick={(e) => {
              e.stopPropagation()  // 防止事件冒泡
              handlePlayPause()
            }} 
            className="hover:text-blue-400"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button onClick={() => handleSkip(10)} className="hover:text-blue-400">
            <SkipForward className="h-4 w-4" />
          </button>

          {/* 时间显示 */}
          <span className="text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* 音量控制移到右侧 */}
          <div className="flex items-center gap-2">
            <button onClick={handleMuteToggle} className="hover:text-blue-400">
              {muted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 cursor-pointer appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-white/20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>

          {/* 倍速控制 */}
          <DropdownMenu
            open={showSpeedMenu}
            onOpenChange={setShowSpeedMenu}
          >
            <DropdownMenuTrigger asChild>
              <button 
                className="flex items-center gap-1 rounded px-2 py-1 hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm">{playbackRate}x</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              onClick={(e) => e.stopPropagation()}
            >
              {PLAYBACK_RATES.map((rate) => (
                <DropdownMenuItem
                  key={rate}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePlaybackRateChange(rate)
                  }}
                  className={cn(
                    "cursor-pointer",
                    rate === playbackRate && "bg-blue-50 text-blue-600"
                  )}
                >
                  {rate}x
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 全屏按钮 */}
          <button onClick={onFullscreen} className="hover:text-blue-400">
            <Maximize className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
} 