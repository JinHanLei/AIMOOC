import { useState } from 'react'
import { FileText, GitBranch, BookOpen, List } from 'lucide-react'
import { cn } from '~/lib/utils'
import Notes from '~/components/Learn/Notes'
import Mindmap from '~/components/Learn/Mindmap'
import Quiz from '~/components/Learn/Quiz'
import Subtitles from '~/components/Learn/Subtitles'

interface AINotesProps {
  className?: string
}

type TabType = 'notes' | 'mindmap' | 'quiz' | 'subtitles'

export function AINotes({ className }: AINotesProps) {
  const [activeTab, setActiveTab] = useState<TabType>('notes')

  const tabs = [
    { id: 'notes', label: 'AI笔记', icon: FileText, component: Notes },
    { id: 'mindmap', label: '思维导图', icon: GitBranch, component: Mindmap },
    { id: 'quiz', label: 'AI出题', icon: BookOpen, component: Quiz },
    { id: 'subtitles', label: '字幕列表', icon: List, component: Subtitles },
  ]

  // 获取当前激活的组件
  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className={cn("flex h-full flex-col bg-white dark:bg-gray-900", className)}>
      {/* 顶部标签栏 */}
      <div className="flex border-b border-gray-100 dark:border-gray-800/50">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "flex min-w-[120px] flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap",
                "hover:bg-gray-50 dark:hover:bg-gray-800",
                activeTab === tab.id && "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 内容区域 */}
      <div className="flex-1">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  )
} 