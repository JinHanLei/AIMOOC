import { Book, BookOpen, Bell, Crown, BarChart2 } from 'lucide-react'
import { cn } from '~/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { VideoPage } from '~/lib/types'
import { useEffect, useState } from 'react'

interface SidebarProps {
  className?: string
  currentTime?: number
  currentPage?: number
  parts?: VideoPage[]
}

export function Sidebar({ className, currentTime = 0, currentPage = 1, parts = [] }: SidebarProps) {
  const router = useRouter()
  const currentPath = router.pathname
  const learningId = router.query.id
  const [progress, setProgress] = useState(0)

  // 计算总进度
  useEffect(() => {
    if (!parts.length) return

    // 计算总时长
    const totalDuration = parts.reduce((sum, part) => sum + part.duration, 0)
    
    // 计算当前进度
    const previousPartsDuration = parts
      .filter(part => part.page < currentPage)
      .reduce((sum, part) => sum + part.duration, 0)
    
    // 当前分P的进度
    const currentPartProgress = currentTime || 0
    
    // 计算总进度百分比
    const currentProgress = ((previousPartsDuration + currentPartProgress) / totalDuration) * 100
    
    // 限制在 0-100 之间
    setProgress(Math.min(100, Math.max(0, currentProgress)))
  }, [parts, currentPage, currentTime])

  const isActive = (path: string) => {
    // 特殊处理当前笔记的路径
    if (path === '/learn') {
      // 如果是 /learn/[id] 路径或者 /learn 路径都视为当前笔记
      return currentPath === '/learn/[id]' || currentPath === '/learn'
    }
    // 其他路径的处理保持不变
    return currentPath.startsWith(path)
  }

  // 从 localStorage 获取最后一次的学习ID
  const getLastLearningId = () => {
    if (typeof window === 'undefined') return null
    const keys = Object.keys(localStorage)
    const learningKeys = keys.filter(key => key.startsWith('learning_'))
    if (learningKeys.length === 0) return null
    
    // 按时间戳排序，获取最新的
    const lastKey = learningKeys.sort((a, b) => {
      const timeA = JSON.parse(localStorage.getItem(a) || '{}').timestamp || 0
      const timeB = JSON.parse(localStorage.getItem(b) || '{}').timestamp || 0
      return timeB - timeA
    })[0]
    
    return lastKey.replace('learning_', '')
  }

  return (
    <div className={cn(
      "fixed left-0 top-0 z-30 flex h-screen w-[240px] flex-col border-r border-gray-100 bg-white pt-16 dark:border-gray-800/50 dark:bg-gray-900",
      className
    )}>
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* 课程部分 */}
        <div className="space-y-1 p-4">
          <h2 className="mb-2 px-2 text-lg font-semibold">课程</h2>
          <Link 
            href={`/learn/${learningId || getLastLearningId()}`}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
              isActive('/learn') && "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
            )}
          >
            <BookOpen className="h-5 w-5" />
            <span>当前课程</span>
          </Link>
          <Link 
            href="/learn/notes" 
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
              isActive('/learn/notes') && "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
            )}
          >
            <Book className="h-5 w-5" />
            <span>课程列表</span>
          </Link>
        </div>

        {/* 学习进度 */}
        <div className="space-y-1 p-4">
          <h2 className="mb-2 px-2 text-lg font-semibold">进度分析</h2>
          <Link href="/learn/progress" className={cn(
            "block px-2",
            isActive('/learn/progress') && "text-blue-600 dark:text-blue-400"
          )}>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <BarChart2 className="h-5 w-5" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span>当前进度</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div 
                    className="h-full rounded-full bg-blue-500 transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* 分隔线 */}
        <hr className="mx-4 border-gray-100 dark:border-gray-800/50" />

        {/* 公告 */}
        <div className="space-y-1 p-4">
          <h2 className="mb-2 px-2 text-lg font-semibold">公告</h2>
          <Link href="/learn/announcements" className={cn(
            "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
            isActive('/learn/announcements') && "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
          )}>
            <Bell className="h-5 w-5" />
            <span>最新公告</span>
          </Link>
        </div>

        {/* 订阅 */}
        <div className="mt-auto p-4">
          <Link href="/pricing" className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500">
            <Crown className="h-5 w-5" />
            <span>升级订阅</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
