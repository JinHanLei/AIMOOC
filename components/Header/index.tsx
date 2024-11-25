import Link from 'next/link'
import { useEffect, useState } from 'react'
import Github from '~/components/ui/GitHub'
import { Button } from '../ui/button'
import { MessageCircle, Compass } from 'lucide-react'
import AIChat from '~/components/AIChat'
import { useRouter } from 'next/router'
import { cn } from '~/lib/utils'
import { isLoggedIn, logout } from '~/lib/auth'
import { ModeToggle } from './SwitchLight'

interface HeaderProps {
  showSignIn: (show: boolean) => void
}

export default function Header({ showSignIn }: HeaderProps) {
  const [mounted, setMounted] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)
  const router = useRouter()
  const isLearnPage = router.pathname.startsWith('/learn')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const isUserLoggedIn = isLoggedIn()

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const handleLogout = () => {
    // 清除登录状态
    logout()
    
    // 清除所有学习记录
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage)
      const learningKeys = keys.filter(key => key.startsWith('learning_'))
      learningKeys.forEach(key => localStorage.removeItem(key))
    }

    // 跳转到首页
    router.push('/')
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md">
        <div className="absolute inset-0 border-b border-slate-900/10 bg-white/75 dark:border-slate-50/[0.06] dark:bg-gray-900/75" />
        <div className={cn(
          "relative mx-auto flex h-16 items-center",
          isLearnPage ? "px-4" : "max-w-screen-xl px-4 sm:px-6",
          "transition-all duration-500 ease-in-out" // 添加过渡效果
        )}>
          {/* 左侧 Logo */}
          <div className={cn(
            "flex items-center",
            isLearnPage ? "pl-0" : "pl-0 lg:pl-4",
            "transition-all duration-500 ease-in-out" // 添加过渡效果
          )}>
            <Link href="/">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-2xl font-bold text-transparent hover:from-blue-500 hover:to-blue-300">
                EasySkill
              </span>
            </Link>
          </div>

          {/* 右侧导航项 */}
          <nav className={cn(
            "ml-auto flex items-center gap-2",
            isLearnPage ? "pr-0" : "pr-0 lg:pr-4",
            "transition-all duration-500 ease-in-out" // 添加过渡效果
          )}>
            {/* AI 对话 */}
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 px-3 hover:bg-white/50 dark:hover:bg-gray-800/50"
              onClick={() => setShowAIChat(true)}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="hidden sm:inline">AI 对话</span>
            </Button>

            {/* 课程广场 */}
            <Link href="/courses">
              <Button 
                variant="ghost"
                className="flex items-center gap-2 px-3 hover:bg-white/50 dark:hover:bg-gray-800/50"
              >
                <Compass className="h-5 w-5" />
                <span className="hidden sm:inline">课程广场</span>
              </Button>
            </Link>

            {/* 明暗模式切换按钮 */}
            <ModeToggle />

            {/* 登录按钮 */}
            {isUserLoggedIn ? (
              <Button
                className="ml-2 bg-gray-600/90 px-4 text-white backdrop-blur-sm hover:bg-gray-500/90"
                onClick={handleLogout}
              >
                退出
              </Button>
            ) : (
              <Button
                className="ml-2 bg-blue-600/90 px-4 text-white backdrop-blur-sm hover:bg-blue-500/90"
                onClick={() => showSignIn(true)}
              >
                登录
              </Button>
            )}

            {/* GitHub 链接 */}
            <Link
              href="https://github.com/yourusername/easyskill"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 hidden sm:block hover:opacity-80"
            >
              <Github width="24" height="24" />
            </Link>
          </nav>
        </div>
      </header>
      
      {/* AI 对话组件 */}
      <AIChat show={showAIChat} onClose={() => setShowAIChat(false)} />
    </>
  )
}
