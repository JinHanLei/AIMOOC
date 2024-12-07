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
  const sections = notes.split('\n\n')
  return sections
    .map((section) => {
      // 处理总结部分
      if (section.startsWith('# 总结：')) {
        const summary = section.replace('# 总结：\n', '')
        return `<div class="mb-6">
        <h3 class="font-bold text-lg mb-3">总结</h3>
        <p class="text-sm leading-relaxed text-justify text-gray-600 dark:text-gray-300">
          ${summary}
        </p>
      </div>`
      }

      // 处理要点部分
      if (section.startsWith('# 要点')) {
        const points = section.replace('# 要点\n', '').split('\n')
        return `<div>
        <h3 class="font-bold text-lg mb-4">要点</h3>
        <div class="space-y-3">
          ${points
            .map((point) => {
              const timeMatch = point.match(/\[(\d+\.\d+)\]/)
              if (timeMatch) {
                const time = parseFloat(timeMatch[1])
                const content = point.replace(/\[\d+\.\d+\] /, '')
                return `<div class="grid grid-cols-[50px_1fr] gap-2 items-start group hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-2 px-2 py-1 rounded-lg transition-colors">
                <button 
                  class="text-xs text-blue-500 hover:text-blue-600 cursor-pointer flex justify-between w-full mt-1 opacity-75 group-hover:opacity-100"
                  onclick="window.handleTimeClick(${time})"
                >
                  <span>[</span>${formatTime(time)}<span>]</span>
                </button>
                <p class="text-sm leading-relaxed text-justify">${content}</p>
              </div>`
              }
              return ''
            })
            .join('')}
        </div>
      </div>`
      }

      return section
    })
    .join('')
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
      ;(window as any).handleTimeClick = onTimeClick
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
    return <div className="flex h-full items-center justify-center text-red-500">{error}</div>
  }

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {/* AI笔记气泡 */}
        <div className="mb-4 rounded-lg bg-gray-50/80 p-4 dark:bg-gray-800/50">
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: formatNotes(notes, onTimeClick) }}
          />

          {/* 操作按钮组 */}
          <div className="mt-3 flex items-center text-xs text-gray-500">
            <Button variant="ghost" size="sm" className="h-7 shrink-0 px-2 hover:text-blue-500">
              <Edit className="mr-1 h-3 w-3" />
              修改
            </Button>
            <Button variant="ghost" size="sm" className="h-7 shrink-0 px-2 hover:text-green-500">
              <ThumbsUp className="mr-1 h-3 w-3" />
              有用
            </Button>
            <Button variant="ghost" size="sm" className="h-7 shrink-0 px-2 hover:text-red-500">
              <ThumbsDown className="mr-1 h-3 w-3" />
              无用
            </Button>
            <Button variant="ghost" size="sm" className="h-7 shrink-0 px-2 hover:text-purple-500">
              <Save className="mr-1 h-3 w-3" />
              保存
            </Button>
          </div>
        </div>
      </div>

      {/* 底部对话输入框 */}
      <div className="border-t border-gray-100 p-4 dark:border-gray-800/50">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="告诉AI你想如何改进这份笔记..."
            className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
          />
          <Button size="sm" className="shrink-0">
            <MessageCircle className="mr-1 h-4 w-4" />
            发送
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Notes
