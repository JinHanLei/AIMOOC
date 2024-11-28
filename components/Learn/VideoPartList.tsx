import { FC } from 'react'
import { useRouter } from 'next/router'
import { cn } from '~/lib/utils'
import { VideoPage } from '~/lib/types'

interface VideoPartListProps {
  parts?: VideoPage[]
  currentPage?: number
  bvid?: string
  onPartChange?: (page: number) => void
}

const VideoPartList: FC<VideoPartListProps> = ({ parts, currentPage, bvid, onPartChange }) => {
  const router = useRouter()
  const { id } = router.query

  if (!parts || parts.length <= 1) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        没有课程列表
      </div>
    )
  }

  const handlePartClick = async (page: number) => {
    const savedData = localStorage.getItem(`learning_${id}`)
    if (!savedData) return

    const data = JSON.parse(savedData)
    const newUrl = `https://www.bilibili.com/video/${bvid}?p=${page}`
    
    // 更新 localStorage
    localStorage.setItem(`learning_${id}`, JSON.stringify({
      ...data,
      url: newUrl
    }))

    // 调用父组件的更新方法
    onPartChange?.(page)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {parts.map((part) => (
            <button
              key={part.page}
              onClick={() => handlePartClick(part.page)}
              className={cn(
                "w-full rounded-lg border p-3 text-left transition-colors",
                currentPage === part.page
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-100 hover:border-blue-500 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">P{part.page}</span>
                <span className="text-sm text-gray-500">
                  {Math.floor(part.duration / 60)}:{String(part.duration % 60).padStart(2, '0')}
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {part.part}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VideoPartList 