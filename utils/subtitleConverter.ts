import { SubtitleData, CommonSubtitleItem } from '~/lib/types'

// 转换为 SRT 格式
function toSRT(subtitles: CommonSubtitleItem[]): string {
  return subtitles
    .map((sub, index) => {
      const startTime = formatSRTTime(sub.from)
      const endTime = formatSRTTime(sub.to)
      return `${index + 1}\n${startTime} --> ${endTime}\n${sub.content}\n`
    })
    .join('\n')
}

// 转换为纯文本格式
function toTXT(subtitles: CommonSubtitleItem[]): string {
  return subtitles.map((sub) => sub.content).join('\n')
}

// SRT 时间格式化
function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 1000)

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(
    2,
    '0',
  )},${String(ms).padStart(3, '0')}`
}

// 下载文件
function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function downloadSubtitles(subtitles: CommonSubtitleItem[], format: 'txt' | 'json' | 'srt', filename: string) {
  let content: string
  let extension: string

  switch (format) {
    case 'txt':
      content = toTXT(subtitles)
      extension = 'txt'
      break
    case 'json':
      content = JSON.stringify(subtitles, null, 2)
      extension = 'json'
      break
    case 'srt':
      content = toSRT(subtitles)
      extension = 'srt'
      break
    default:
      throw new Error('Unsupported format')
  }

  downloadFile(content, `${filename}.${extension}`)
}
