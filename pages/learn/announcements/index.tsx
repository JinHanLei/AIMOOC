import { NextPage } from 'next'
import { Sidebar } from '~/components/Learn/Sidebar'
import { Bell, AlertCircle } from 'lucide-react'

interface Announcement {
  id: string
  title: string
  content: string
  date: string
  type: 'update' | 'maintenance' | 'feature'
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: '新功能上线通知',
    content: '我们很高兴地宣布，新的AI助手功能已经上线！现在您可以在学习过程中随时获得智能辅导。AI助手可以回答您的问题，提供学习建议，并帮助您更好地理解课程内容。',
    date: '2024-03-20',
    type: 'feature'
  },
  {
    id: '2',
    title: '系统维护通知',
    content: '为了给您提供更好的服务，我们将于本周六凌晨2:00-4:00进行系统维护。维护期间可能会出现短暂的服务中断，请您提前做好准备。',
    date: '2024-03-19',
    type: 'maintenance'
  }
]

const AnnouncementsPage: NextPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-[240px] flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">最新公告</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            了解平台的最新动态和更新信息
          </p>
        </div>

        <div className="space-y-4">
          {MOCK_ANNOUNCEMENTS.map((announcement) => (
            <div
              key={announcement.id}
              className="rounded-lg border bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">{announcement.title}</h3>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                {announcement.content}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">{announcement.date}</span>
                {announcement.type === 'maintenance' && (
                  <span className="flex items-center gap-1 text-sm text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    维护通知
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default AnnouncementsPage 