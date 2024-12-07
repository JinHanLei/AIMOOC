import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { MessageCircle, Compass, History, Bookmark } from 'lucide-react'
import AIChat from '~/components/AIChat'
import { useRouter } from 'next/router'
import { cn } from '~/lib/utils'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import SignIn from './SignIn'
import { ModeToggle } from './SwitchLight'

interface HeaderProps {
  showSignIn: (show: boolean) => void
}

export default function Header({ showSignIn }: HeaderProps) {
  const [showAIChat, setShowAIChat] = useState(false)
  const router = useRouter()
  const isLearnPage = router.pathname.startsWith('/learn')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const user = useUser()

  // 监听路由变化，触发过渡动画
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsTransitioning(true)
    }

    const handleRouteChangeComplete = () => {
      // 给一点延迟，确保DOM已更新
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [router])

  const handleLogout = async () => {
    const supabase = useSupabaseClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        <div className="absolute inset-0 border-b border-slate-900/10 bg-white dark:border-slate-50/[0.06] dark:bg-gray-900" />
        <div
          className={cn(
            'relative mx-auto flex h-16 items-center',
            isLearnPage ? 'px-4' : 'max-w-screen-xl px-4 sm:px-6',
            'transition-all duration-500 ease-in-out', // 添加过渡效果
          )}
        >
          {/* 左侧 Logo */}
          <div
            className={cn(
              'flex items-center',
              isLearnPage ? 'pl-0' : 'pl-0 lg:pl-4',
              'transition-all duration-500 ease-in-out', // 添加过渡效果
            )}
          >
            <Link href="/">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-2xl font-bold text-transparent hover:from-blue-500 hover:to-blue-300">
                AIMOOC
              </span>
            </Link>
          </div>

          {/* 右侧导航项 */}
          <nav
            className={cn(
              'ml-auto flex items-center gap-2',
              isLearnPage ? 'pr-0' : 'pr-0 lg:pr-4',
              'transition-all duration-500 ease-in-out', // 添加过渡效果
            )}
          >
            {/* AI 对话 */}
            <Button
              variant="ghost"
              className="flex h-auto min-h-[4rem] flex-col items-center gap-0.5 px-3 py-1 hover:bg-white/50 dark:hover:bg-gray-800/50"
              onClick={() => setShowAIChat(true)}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">Chat</span>
            </Button>

            {/* 历史记录 */}
            <Link href="/history">
              <Button
                variant="ghost"
                className="flex h-auto min-h-[4rem] flex-col items-center gap-0.5 px-3 py-1 hover:bg-white/50 dark:hover:bg-gray-800/50"
              >
                <History className="h-5 w-5" />
                <span className="text-sm">历史</span>
              </Button>
            </Link>

            {/* 收藏夹 */}
            <Link href="/favorites">
              <Button
                variant="ghost"
                className="flex h-auto min-h-[4rem] flex-col items-center gap-0.5 px-3 py-1 hover:bg-white/50 dark:hover:bg-gray-800/50"
              >
                <Bookmark className="h-5 w-5" />
                <span className="text-sm">收藏</span>
              </Button>
            </Link>

            {/* 课程广场 */}
            <Link href="/courses">
              <Button
                variant="ghost"
                className="flex h-auto min-h-[4rem] flex-col items-center gap-0.5 px-3 py-1 hover:bg-white/50 dark:hover:bg-gray-800/50"
              >
                <Compass className="h-5 w-5" />
                <span className="text-sm">广场</span>
              </Button>
            </Link>

            {/* 登录按钮 */}
            <SignIn showSignIn={showSignIn} />
          </nav>
        </div>
      </header>

      {/* AI 对话组件 */}
      <AIChat show={showAIChat} onClose={() => setShowAIChat(false)} />
    </>
  )
}
