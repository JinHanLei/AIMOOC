import { FC, useState, useRef, useEffect } from 'react'
import { List, Download } from 'lucide-react'
import type { CommonSubtitleItem } from '~/lib/types'
import { formatTime } from '~/utils/formatTime'
import { downloadSubtitles } from '~/utils/subtitleConverter'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Button } from "~/components/ui/button"
import { cn } from '~/lib/utils'

interface SubtitlesProps {
  subtitles: {
    lan: string
    subtitle: CommonSubtitleItem[]
  }[] | null
  loading?: boolean
  currentTime?: number
  onTimeClick?: (time: number) => void
}

const Subtitles: FC<SubtitlesProps> = ({ subtitles, loading, currentTime = 0, onTimeClick }) => {
  const [selectedLan, setSelectedLan] = useState<string>('')
  const subtitlesRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  useEffect(() => {
    if (!subtitles || !currentTime) return

    const currentSubtitles = subtitles.find(s => s.lan === selectedLan)?.subtitle || []
    
    const newActiveIndex = currentSubtitles.findIndex(
      (sub) => currentTime >= sub.from && currentTime <= sub.to
    )

    if (newActiveIndex !== -1 && newActiveIndex !== activeIndex) {
      setActiveIndex(newActiveIndex)
      
      const subtitleElement = subtitlesRef.current?.children[0]?.children[newActiveIndex] as HTMLElement
      if (subtitleElement) {
        subtitleElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }
  }, [currentTime, selectedLan, subtitles, activeIndex])

  const handleDownload = (format: 'txt' | 'json' | 'srt') => {
    const currentSubtitles = subtitles?.find(s => s.lan === selectedLan)
    if (!currentSubtitles) return

    const filename = `subtitles_${selectedLan}_${new Date().toISOString().split('T')[0]}`
    downloadSubtitles(currentSubtitles.subtitle, format, filename)
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">加载字幕中...</p>
      </div>
    )
  }

  if (!subtitles || subtitles.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">暂无字幕</p>
      </div>
    )
  }

  if (!selectedLan && subtitles.length > 0) {
    setSelectedLan(subtitles[0].lan)
  }

  const currentSubtitles = subtitles.find(s => s.lan === selectedLan)?.subtitle || []

  return (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <Select value={selectedLan} onValueChange={setSelectedLan}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择字幕语言" />
            </SelectTrigger>
            <SelectContent>
              {subtitles?.map((sub) => (
                <SelectItem key={sub.lan} value={sub.lan}>
                  {sub.lan}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDownload('txt')}>
                下载为 TXT
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('json')}>
                下载为 JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('srt')}>
                下载为 SRT
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4" ref={subtitlesRef}>
        <div className="space-y-4">
          {currentSubtitles.map((subtitle, index) => (
            <div 
              key={index}
              onClick={() => onTimeClick?.(subtitle.from)}
              className={cn(
                "rounded-lg border p-3 transition-colors duration-200 cursor-pointer hover:border-blue-400",
                index === activeIndex
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900"
              )}
            >
              <div className="mb-1 text-xs text-gray-500">
                {formatTime(subtitle.from)} - {formatTime(subtitle.to)}
              </div>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {subtitle.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Subtitles 