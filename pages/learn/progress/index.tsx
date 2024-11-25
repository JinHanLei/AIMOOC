import { NextPage } from 'next'
import { Sidebar } from '~/components/Learn/Sidebar'
import { BarChart2, Clock, BookOpen, Trophy } from 'lucide-react'

interface ProgressStats {
  totalProgress: number
  completedCourses: number
  totalHours: number
  streak: number
}

const MOCK_STATS: ProgressStats = {
  totalProgress: 75,
  completedCourses: 12,
  totalHours: 36,
  streak: 7
}

const ProgressPage: NextPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-[240px] flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">学习进度</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            追踪你的学习历程
          </p>
        </div>

        <div className="space-y-6">
          {/* 总体进度卡片 */}
          <div className="rounded-lg border bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <BarChart2 className="h-5 w-5 text-blue-600" />
              总体进度
            </h3>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span>完成度</span>
                <span>{MOCK_STATS.totalProgress}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div 
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${MOCK_STATS.totalProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* 统计卡片网格 */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <BookOpen className="h-5 w-5" />
                已完成课程
              </div>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {MOCK_STATS.completedCourses}
              </p>
            </div>

            <div className="rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="h-5 w-5" />
                学习时长
              </div>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {MOCK_STATS.totalHours}小时
              </p>
            </div>

            <div className="rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Trophy className="h-5 w-5" />
                连续学习
              </div>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {MOCK_STATS.streak}天
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProgressPage 