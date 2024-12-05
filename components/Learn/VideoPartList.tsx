import { FC } from 'react'
import { useRouter } from 'next/router'
import { cn } from '~/lib/utils'
import { VideoPage } from '~/lib/types'
import { Loader2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"

interface VideoPartListProps {
  parts?: VideoPage[]
  currentPage?: number
  bvid?: string
  onPartChange?: (page: number) => void
  loading?: boolean
}

const VideoPartList: FC<VideoPartListProps> = ({ parts, currentPage, bvid, onPartChange, loading = true }) => {
  const router = useRouter()
  const { id } = router.query

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>课程列表加载中...</span>
        </div>
      </div>
    )
  }

  if (!parts || parts.length <= 1) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        没有课程列表
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {parts.map((part) => (
            <button
              key={part.page}
              onClick={() => onPartChange?.(part.page)}
              className={cn(
                "w-full rounded-lg border p-3 text-left transition-colors",
                currentPage === part.page
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-100 hover:border-blue-500 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-[380px]">
                        {part.part}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{part.part}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-xs text-gray-500 shrink-0">
                  {Math.floor(part.duration / 60)}:{String(part.duration % 60).padStart(2, '0')}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VideoPartList 