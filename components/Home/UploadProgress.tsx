import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '~/lib/utils'

interface UploadProgressProps {
  show: boolean
  onClose: () => void
  progress: number
  fileName: string
  status: 'uploading' | 'success' | 'error'
  error?: string
}

export function UploadProgress({ show, onClose, progress, fileName, status, error }: UploadProgressProps) {
  if (!show) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-900">
      <div className="flex items-center justify-between border-b p-4 dark:border-gray-700">
        <h3 className="font-medium">文件上传</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-full p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4">
        <p className="mb-2 truncate text-sm text-gray-600 dark:text-gray-400">
          {fileName}
        </p>
        
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={cn(
              "h-full transition-all duration-300",
              status === 'error' ? 'bg-red-500' : 'bg-blue-500',
              status === 'success' ? 'bg-green-500' : ''
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mt-2 flex items-center justify-between text-sm">
          <span
            className={cn(
              status === 'error' ? 'text-red-500' : 'text-gray-600 dark:text-gray-400',
              status === 'success' ? 'text-green-500' : ''
            )}
          >
            {status === 'uploading' && `${progress}%`}
            {status === 'success' && '上传完成'}
            {status === 'error' && (error || '上传失败')}
          </span>
        </div>
      </div>
    </div>
  )
} 