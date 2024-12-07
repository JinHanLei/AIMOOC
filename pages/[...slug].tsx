import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import useFormPersist from 'react-hook-form-persist'
import { TypingSlogan } from '~/components/Home/TypingSlogan'
import { useToast } from '~/hooks/use-toast'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { useSummarize } from '~/hooks/useSummarize'
import { VideoService } from '~/lib/types'
import { DEFAULT_LANGUAGE } from '~/utils/constants/language'
import { extractPage, extractUrl } from '~/utils/extractUrl'
import { VideoConfigSchema, videoConfigSchema } from '~/utils/schemas/video'
import { VideoInput } from '~/components/Home/VideoInput'

interface SlugPageProps {
  showSignIn: (show: boolean) => void
  hideHeader?: boolean
}

export default function SlugPage({ showSignIn, hideHeader = false }: SlugPageProps) {
  const router = useRouter()
  const urlState = router.query.slug
  const searchParams = useSearchParams()
  const licenseKey = searchParams.get('license_key')

  const {
    register,
    handleSubmit,
    control,
    trigger,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VideoConfigSchema>({
    defaultValues: {
      enableStream: true,
      showTimestamp: true,
      showEmoji: true,
      detailLevel: 600,
      sentenceNumber: 5,
      outlineLevel: 1,
      outputLanguage: DEFAULT_LANGUAGE,
    },
    resolver: zodResolver(videoConfigSchema),
  })

  // TODO: add mobx or state manager
  const [currentVideoId, setCurrentVideoId] = useState<string>('')
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('')
  const [userKey, setUserKey] = useLocalStorage<string>('user-openai-apikey')
  const { loading, summary, resetSummary, summarize } = useSummarize(showSignIn, getValues('enableStream'))
  const { toast } = useToast()

  useFormPersist('video-summary-config-storage', {
    watch,
    setValue,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined, // default window.sessionStorage
    // exclude: ['baz']
  })
  const shouldShowTimestamp = getValues('showTimestamp')

  useEffect(() => {
    licenseKey && setUserKey(licenseKey)
  }, [licenseKey, setUserKey])

  useEffect(() => {
    if (!router.isReady) return

    const queryUrl = router.query.url as string
    if (queryUrl) {
      generateSummary(queryUrl)
    }
  }, [router.isReady, router.query.url])

  const validateUrlFromAddressBar = (url?: string) => {
    const videoUrl = url || currentVideoUrl
    if (!videoUrl.includes('bilibili.com/video') && !videoUrl.startsWith('blob:')) {
      toast({
        title: '暂不支持此视频链接',
        description: '请输入哔哩哔哩视频链接，已支持b23.tv短链接和本地视频',
      })
      return false
    }
    return true
  }

  const generateSummary = async (url?: string) => {
    const formValues = getValues()
    console.log('=======formValues=========', formValues)

    if (!url) return

    if (!validateUrlFromAddressBar(url)) {
      return
    }

    resetSummary()
    setCurrentVideoUrl(url)

    const videoUrl = url
    const videoId = extractUrl(videoUrl)
    if (!videoId) {
      return
    }

    const pageNumber = extractPage(videoUrl, new URLSearchParams(videoUrl.split('?')[1]))
    setCurrentVideoId(videoId)
    await summarize(
      { service: VideoService.Bilibili, videoId, pageNumber, ...formValues },
      { userKey, shouldShowTimestamp },
    )
  }

  const onFormSubmit: SubmitHandler<VideoConfigSchema> = async (data) => {
    // e.preventDefault();
    await generateSummary(currentVideoUrl)
  }
  const handleApiKeyChange = (e: any) => {
    setUserKey(e.target.value)
  }

  const handleInputChange = async (e: any) => {
    const value = e.target.value
    // todo: 兼容?query参数
    const regex = /((?:https?:\/\/|www\.)\S+)/g
    const matches = value.match(regex)
    if (matches && matches[0].includes('b23.tv')) {
      toast({ title: '正在自动转换此视频链接...' })
      const response = await fetch(`/api/b23tv?url=${matches[0]}`)
      const json = await response.json()
      setCurrentVideoUrl(json.url)
    } else {
      setCurrentVideoUrl(value)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full px-4 sm:px-0">
      <div className="mt-[15vh] w-full max-w-5xl">
        <TypingSlogan />
        <VideoInput onSubmit={generateSummary} getValues={getValues} register={register} showSignIn={showSignIn} />
      </div>
    </div>
  )
}
