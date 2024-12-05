import { FC, useEffect, useState } from 'react'
import { FileText, ThumbsUp, ThumbsDown, MessageCircle, Save, Edit, Loader2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { getBiliNotes } from '~/lib/bilibili/getNotes'
import { formatTime } from '~/utils/formatTime'

interface NotesProps {
  url?: string
  onTimeClick?: (time: number) => void
}

const formatNotes = (notes: string, onTimeClick?: (time: number) => void) => {
  return notes.split('\n').map((line, index) => {
    // 处理标题
    if (line.startsWith('总结：')) {
      return `<h3 class="font-bold text-lg mb-4">${line.replace('总结：', '')}</h3>`
    }
    // 处理时间戳项目
    if (line.startsWith('[')) {
      const timeMatch = line.match(/\[(\d+\.\d+)\]/)
      if (timeMatch) {
        const time = parseFloat(timeMatch[1])
        const content = line.replace(/- \[\d+\.\d+\] /, '')
        return `<div class="grid grid-cols-[50px_1fr] gap-2 mb-2 items-start">
          <button 
            class="text-xs text-blue-500 hover:text-blue-600 cursor-pointer flex justify-between w-full mt-1"
            onclick="window.handleTimeClick(${time})"
          >
            <span>[</span>${formatTime(time)}<span>]</span>
          </button>
          <p class="text-sm leading-relaxed text-justify">${content}</p>
        </div>`
      }
    }
    // 其他行
    return `<p class="mb-2 text-justify">${line}</p>`
  }).join('')
}

const Notes: FC<NotesProps> = ({ url, onTimeClick }) => {
  const [notes, setNotes] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchNotes() {
      if (!url) return
      
      setLoading(true)
      try {
        const savedData = localStorage.getItem(`learning_${url}`)
        if (!savedData) return
        
        const { url: videoUrl } = JSON.parse(savedData)
        const notesContent = await getBiliNotes(videoUrl)
        setNotes(notesContent)
      } catch (err) {
        console.error('获取笔记失败:', err)
        setError('获取笔记失败，请重试')
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [url])

  useEffect(() => {
    if (onTimeClick) {
      (window as any).handleTimeClick = onTimeClick
    }
    return () => {
      delete (window as any).handleTimeClick
    }
  }, [onTimeClick])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>正在为您生成笔记...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col min-w-0">
      <div className="flex-1 overflow-y-auto p-4">
        {/* AI笔记气泡 */}
        <div className="bg-gray-50/80 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
          <div 
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: formatNotes(notes, onTimeClick) }}
          />
          
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