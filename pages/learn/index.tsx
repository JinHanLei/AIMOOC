import { NextPage } from 'next'
import { Sidebar } from '~/components/Learn/Sidebar'
import { VideoInput } from '~/components/Home/VideoInput'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { VideoConfigSchema, videoConfigSchema } from '~/utils/schemas/video'
import { DEFAULT_LANGUAGE } from '~/utils/constants/language'

const LearnIndexPage: NextPage<{
  showSignIn: (show: boolean) => void
}> = ({ showSignIn }) => {
  const {
    register,
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

  const handleSubmit = (url: string) => {
    // 处理提交逻辑
    console.log('Submitted URL:', url)
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-[240px] flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex min-h-[60vh] flex-col items-center justify-center">
            <div className="w-full max-w-3xl">
              <VideoInput 
                onSubmit={handleSubmit}
                getValues={getValues}
                register={register}
                showSignIn={showSignIn}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LearnIndexPage 