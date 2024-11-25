import OpenAI from 'openai';
import { useState, useRef, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { X, Minimize2, Maximize2, MessageCircle } from 'lucide-react'
import Draggable from 'react-draggable'
import { cn } from '~/lib/utils'

const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: process.env.NEXT_PUBLIC_OPENAI_BASE_URL,
  dangerouslyAllowBrowser: true
});

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AIChatProps {
  show: boolean
  onClose: () => void
}

export default function AIChat({ show, onClose }: AIChatProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const chatRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      const stream = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [...messages, userMessage],
        stream: true,
      })

      let assistantMessage = ''
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        assistantMessage += content
        
        setMessages(prev => {
          const newMessages = [...prev]
          if (newMessages[newMessages.length - 1]?.role === 'assistant') {
            newMessages[newMessages.length - 1].content = assistantMessage
          } else {
            newMessages.push({ role: 'assistant', content: assistantMessage })
          }
          return newMessages
        })
      }
    } catch (error) {
      console.error('AI响应错误:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '抱歉，处理您的请求时出现错误。请稍后重试。' 
      }])
    }
  }

  if (!show) return null

  return (
    <Draggable handle=".handle" bounds="parent">
      <div
        ref={chatRef}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-80 overflow-hidden rounded-lg bg-white shadow-xl transition-all dark:bg-gray-900',
          isMinimized ? 'h-12' : 'h-96'
        )}
      >
        {/* 标题栏 */}
        <div className="handle flex h-12 cursor-move items-center justify-between bg-blue-600 px-4 text-white">
          <span className="font-medium">AI 助手</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 hover:bg-blue-500"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 hover:bg-blue-500"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 消息区域 */}
        {!isMinimized && (
          <>
            <div className="h-[calc(100%-96px)] overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg px-4 py-2',
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <form
              onSubmit={handleSubmit}
              className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex space-x-2">
                <input
                  value={input}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                  placeholder="输入消息..."
                  className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                />
                <Button 
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  发送
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Draggable>
  )
} 