import { FC } from 'react'
import { FileText, ThumbsUp, ThumbsDown, MessageCircle, Save, Edit } from 'lucide-react'
import { Button } from '~/components/ui/button'

interface NotesProps {
  // 添加需要的props
}

const Notes: FC<NotesProps> = () => {
  return (
    <div className="flex h-full flex-col min-w-0">
      <div className="flex-1 overflow-y-auto p-4">
        {/* AI笔记气泡 */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
          <div className="prose prose-sm dark:prose-invert">
            <h3>视频要点</h3>
            <ul>
              <li>这是AI生成的笔记内容</li>
              <li>包含视频的主要观点和重点</li>
              <li>以结构化的方式呈现</li>
            </ul>
          </div>
          
          {/* 操作按钮组 */}
          <div className="flex items-center mt-3 text-gray-500 text-xs">
            <Button variant="ghost" size="sm" className="h-7 shrink-0 px-2 hover:text-blue-500">
              <Edit className="h-3 w-3 mr-1" />
              修改
            </Button>
            <Button variant="ghost" size="sm" className="h-7 shrink-0 px-2 hover:text-green-500">
              <ThumbsUp className="h-3 w-3 mr-1" />
              有用
            </Button>
            <Button variant="ghost" size="sm" className="h-7 shrink-0 px-2 hover:text-red-500">
              <ThumbsDown className="h-3 w-3 mr-1" />
              无用
            </Button>
            <Button variant="ghost" size="sm" className="h-7 shrink-0 px-2 hover:text-purple-500">
              <Save className="h-3 w-3 mr-1" />
              保存
            </Button>
          </div>
        </div>
      </div>

      {/* 底部对话输入框 */}
      <div className="border-t border-gray-100 dark:border-gray-800/50 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="告诉AI你想如何改进这份笔记..."
            className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
          />
          <Button size="sm" className="shrink-0">
            <MessageCircle className="h-4 w-4 mr-1" />
            发送
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Notes 