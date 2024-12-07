import { NextPage } from 'next'
import { Sidebar } from '~/components/Learn/Sidebar'
import { Book, Clock } from 'lucide-react'

interface Note {
  id: string
  title: string
  lastUpdated: string
  videoTitle: string
  platform: string
}

const MOCK_NOTES: Note[] = [
  {
    id: '1',
    title: 'Python基础教程笔记',
    lastUpdated: '2024-03-20',
    videoTitle: 'Python从入门到精通',
    platform: '哔哩哔哩',
  },
  {
    id: '2',
    title: '数据结构与算法笔记',
    lastUpdated: '2024-03-19',
    videoTitle: '算法精讲',
    platform: 'MOOC',
  },
]

const NotesListPage: NextPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-[240px] flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">笔记列表</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">管理你的所有学习笔记</p>
        </div>

        <div className="space-y-4">
          {MOCK_NOTES.map((note) => (
            <div
              key={note.id}
              className="group rounded-lg border bg-white p-4 transition-all hover:border-blue-500 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="flex items-center gap-2 font-semibold group-hover:text-blue-600">
                    <Book className="h-5 w-5" />
                    {note.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    来自：{note.videoTitle} ({note.platform})
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {note.lastUpdated}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default NotesListPage
