import { FC } from 'react'
import { List } from 'lucide-react'
import type { CommonSubtitleItem } from '~/lib/types'
import { formatTime } from '~/utils/formatTime'

interface SubtitlesProps {
  subtitles: CommonSubtitleItem[] | null
  loading?: boolean
}

const Subtitles: FC<SubtitlesProps> = ({ subtitles, loading }) => {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">加载字幕中...</p>
      </div>
    )
  }

  if (!subtitles) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">暂无字幕</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="space-y-4">
        {subtitles.map((subtitle, index) => (
          <div 
            key={index}
            className="rounded-lg border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
          >
            {subtitle.start && (
              <div className="mb-1 text-xs text-gray-500">
                {formatTime(subtitle.start)}
              </div>
            )}
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {subtitle.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Subtitles 