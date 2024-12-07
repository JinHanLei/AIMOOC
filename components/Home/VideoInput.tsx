import { useState, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { Upload, Settings, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/router'
import { PromptOptions } from '~/components/Home/PromptOptions'
import { useToast } from '~/hooks/use-toast'
import { cn } from '~/lib/utils'
import { UseFormGetValues, UseFormRegister } from 'react-hook-form'
import { VideoConfigSchema } from '~/utils/schemas/video'
import { openDB } from 'idb' // 需要安装: npm install idb
import { useUser } from '@supabase/auth-helpers-react'

interface VideoInputProps {
  onSubmit: (url: string) => void
  getValues: UseFormGetValues<VideoConfigSchema>
  register: UseFormRegister<VideoConfigSchema>
  showSignIn: (show: boolean) => void
}

type UploadStatus = 'uploading' | 'success' | 'error'

interface UploadState {
  show: boolean
  progress: number
  fileName: string
  status: UploadStatus
  error: string
  uploadedUrl?: string // 添加上传后的URL
}

// 验证链接的正则表达式
const URL_PATTERNS = {
  BILIBILI: /^https?:\/\/(www\.)?(bilibili\.com\/video\/([AaBb][Vv][0-9]+)|b23\.tv\/[A-Za-z0-9]+)/,
  ICOURSE: /^https?:\/\/(www\.)?icourse163\.org\/learn\/.*$/,
}

// 初始化 IndexedDB
const initDB = async () => {
  return await openDB('videoDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos')
      }
    },
  })
}

export function VideoInput({ onSubmit, getValues, register, showSignIn }: VideoInputProps) {
  // const [showOptions, setShowOptions] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [uploadState, setUploadState] = useState<UploadState>({
    show: false,
    progress: 0,
    fileName: '',
    status: 'uploading',
    error: '',
  })
  const router = useRouter()
  const { toast } = useToast()
  const user = useUser()

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      toast({
        title: '请输入视频链接',
        variant: 'destructive',
      })
      return false
    }

    if (url.startsWith('blob:')) {
      return true
    }

    const isBilibili = URL_PATTERNS.BILIBILI.test(url)
    const isIcourse = URL_PATTERNS.ICOURSE.test(url)

    if (!isBilibili && !isIcourse && !uploadState.show) {
      toast({
        title: '不支持的视频链接',
        description: '目前仅支持哔哩哔哩、中国大学MOOC视频链接或本地视频',
        variant: 'destructive',
      })
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: '请先登录',
        description: '登录后即可开始学习',
        variant: 'destructive',
      })
      showSignIn(true)
      return
    }

    const urlToUse = uploadState.uploadedUrl || inputValue
    if (!validateUrl(urlToUse)) return

    // 使用视频URL生成固定的id
    const id = btoa(urlToUse)
      .replace(/[^a-zA-Z0-9]/g, '') // 移除特殊字符
      .substring(0, 9) // 取前9位

    // 存储完整数据到 localStorage
    localStorage.setItem(
      `learning_${id}`,
      JSON.stringify({
        url: urlToUse,
        timestamp: Date.now(),
        config: getValues(),
      }),
    )

    // 直接跳转，不带查询参数
    router.push(`/learn/${id}`)
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // 如果输入的是b23.tv短链接，自动转换
    if (value.includes('b23.tv')) {
      const match = value.match(/https?:\/\/b23\.tv\/[A-Za-z0-9]+/)
      if (match) {
        try {
          toast({ title: '正在转换短链接...' })
          const response = await fetch(`/api/b23tv?url=${encodeURIComponent(match[0])}`)

          if (!response.ok) {
            throw new Error('转换失败')
          }

          const data = await response.json()
          if (data.url) {
            setInputValue(data.url)
            toast({
              title: '链接转换成功',
              description: '已自动更新为完整链接',
            })
          }
        } catch (error) {
          console.error('转换短链接失败:', error)
          toast({
            title: '短链接转换失败',
            description: '请尝试直接使用完整链接',
            variant: 'destructive',
          })
        }
      }
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('video/')) {
      toast({
        title: '支持的文件类型',
        description: '请上传视频文件',
        variant: 'destructive',
      })
      return
    }

    setUploadState({
      show: true,
      progress: 0,
      fileName: file.name,
      status: 'uploading',
      error: '',
    })

    try {
      // 存储视频文件到 IndexedDB
      const db = await initDB()
      const videoId = `local_${Date.now()}`
      await db.put('videos', file, videoId)

      setUploadState((prev) => ({
        ...prev,
        progress: 100,
        status: 'success' as const,
        uploadedUrl: `indexeddb://${videoId}`, // 使用自定义协议标识 IndexedDB 中的视频
      }))

      // 更新输入框的值
      setInputValue(`indexeddb://${videoId}`)

      toast({
        title: '视频上传成功',
        description: '点击开始学习按钮开始观看',
      })
    } catch (error) {
      console.error('处理视频失败:', error)
      setUploadState((prev) => ({
        ...prev,
        status: 'error' as const,
        error: '处理视频失败，请重试',
      }))
      toast({
        title: '视频处理失败',
        description: '请重试或选择其他视频',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2">
          {/* 根据上传状态显示输入框或进度条 */}
          {uploadState.show ? (
            <div className="flex-1 rounded-lg border border-gray-200 bg-white/75 px-4 py-3 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/75">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate text-gray-600 dark:text-gray-400">{uploadState.fileName}</span>
                <span
                  className={cn(
                    'ml-2',
                    uploadState.status === 'error' ? 'text-red-500' : 'text-gray-600 dark:text-gray-400',
                    uploadState.status === 'success' ? 'text-green-500' : '',
                  )}
                >
                  {uploadState.status === 'uploading' && `${uploadState.progress}%`}
                  {uploadState.status === 'success' && '准备就绪'}
                  {uploadState.status === 'error' && uploadState.error}
                </span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    uploadState.status === 'error' ? 'bg-red-500' : 'bg-blue-500',
                    uploadState.status === 'success' ? 'bg-green-500' : '',
                  )}
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
            </div>
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="输入视频链接，按下「开始学习」"
              className="flex-1 rounded-lg border border-gray-200 bg-white/75 px-4 py-3 text-base shadow-sm backdrop-blur-md focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800/75"
            />
          )}

          {/* 文件上传按钮 */}
          <div className="relative">
            <input
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 cursor-pointer opacity-0"
              accept="video/*"
              disabled={uploadState.show}
            />
            <Button type="button" variant="outline" className="h-12 w-12" disabled={uploadState.show}>
              <Upload className="h-5 w-5" />
            </Button>
          </div>

          {/* 设置按钮 */}
          {/* <Button
            type="button"
            variant="outline"
            className="h-12 w-12"
            onClick={() => setShowOptions(!showOptions)}
          >
            <Settings className="h-5 w-5" />
          </Button> */}
          {/* 选项面板 */}
          {/* {showOptions && (
          <div className="absolute left-0 right-0 mt-2 rounded-lg border bg-white/75 backdrop-blur-md p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800/75">
            <PromptOptions 
              getValues={getValues} 
              register={register}
            />
          </div>
        )} */}

          {/* 开始学习按钮 */}
          <Button
            type="submit"
            className="h-12 gap-2 bg-blue-600 px-6 hover:bg-blue-500"
            disabled={!inputValue.trim() && !uploadState.uploadedUrl}
          >
            <span>开始学习</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
