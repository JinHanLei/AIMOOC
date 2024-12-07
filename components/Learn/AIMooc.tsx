import { useState } from 'react'
import { FileText, GitBranch, BookOpen, List, ListVideo, ChevronDown } from 'lucide-react'
import { cn } from '~/lib/utils'
import Notes from '~/components/Learn/Notes'
import Mindmap from '~/components/Learn/Mindmap'
import Quiz from '~/components/Learn/Quiz'
import Subtitles from './Subtitles'
import VideoPartList from './VideoPartList'
import type { CommonSubtitleItem, VideoPage, SubtitleData } from '~/lib/types'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'

interface AINotesProps {
  subtitles: SubtitleData[] | null
  className?: string
  parts?: VideoPage[]
  currentPage?: number
  bvid?: string
  onPartChange?: (page: number) => void
  currentTime?: number
  onTimeClick?: (time: number) => void
  loading?: boolean
  learningId?: string
}

type TabType = 'notes' | 'mindmap' | 'quiz' | 'subtitles' | 'parts'

export function AINotes({
  subtitles,
  className,
  parts,
  currentPage,
  bvid,
  onPartChange,
  currentTime,
  onTimeClick,
  loading,
  learningId,
}: AINotesProps) {
  const [activeTab, setActiveTab] = useState<TabType>('notes')

  const mainTabs = [
    { id: 'notes', label: 'AI笔记', icon: FileText, component: Notes },
    { id: 'quiz', label: 'AI练习', icon: BookOpen, component: Quiz },
    { id: 'parts', label: '课程选集', icon: ListVideo, component: VideoPartList },
  ]

  const dropdownTabs = [
    { id: 'mindmap', label: '思维导图', icon: GitBranch, component: Mindmap },
    { id: 'subtitles', label: '字幕列表', icon: List, component: Subtitles },
  ]

  // 获取当前激活的组件
  const ActiveComponent = [...mainTabs, ...dropdownTabs].find((tab) => tab.id === activeTab)?.component

  return (
    <div className={cn('flex h-full flex-col bg-white dark:bg-gray-900', className)}>
      {/* 顶部标签栏 */}
      <div className="flex shrink-0 border-b border-gray-100 dark:border-gray-800/50">
        {mainTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                'flex min-w-[120px] flex-1 items-center justify-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium',
                'hover:bg-gray-50 dark:hover:bg-gray-800',
                activeTab === tab.id && 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400',
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}

        {/* 下拉菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'flex min-w-[120px] items-center justify-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium',
                'hover:bg-gray-50 dark:hover:bg-gray-800',
                dropdownTabs.some((tab) => tab.id === activeTab) &&
                  'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400',
              )}
            >
              <span>更多功能</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            {dropdownTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <DropdownMenuItem
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={cn(
                    'flex cursor-pointer items-center gap-2',
                    activeTab === tab.id && 'bg-blue-50 text-blue-600 dark:bg-blue-900/20',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 内容区域 - 添加 h-0 以启用滚动 */}
      <div className="min-h-0 flex-1">
        {activeTab === 'notes' ? (
          <Notes url={learningId} onTimeClick={onTimeClick} />
        ) : activeTab === 'subtitles' ? (
          <Subtitles subtitles={subtitles} currentTime={currentTime} onTimeClick={onTimeClick} />
        ) : activeTab === 'parts' ? (
          <VideoPartList
            parts={parts}
            currentPage={currentPage}
            bvid={bvid}
            onPartChange={onPartChange}
            loading={loading}
          />
        ) : (
          ActiveComponent && <ActiveComponent subtitles={subtitles} />
        )}
      </div>
    </div>
  )
}
