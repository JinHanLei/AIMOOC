import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { AnimatePresence, motion } from 'framer-motion'
import { FADE_IN_ANIMATION_SETTINGS } from '~/utils/constants'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { LogOut, User, Github, Mail } from 'lucide-react'
import Modal from '~/components/shared/modal'
import React, { useState, useCallback, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { toast } from '~/hooks/use-toast'
import { useRouter } from 'next/router'
import { supabase } from '~/lib/supabase' // 使用自定义客户端

export function SignIn({ showSignIn: externalShowSignIn }: { showSignIn: (show: boolean) => void }) {
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const user = useUser()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      // 先清除本地存储
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith('learning_')) {
          localStorage.removeItem(key)
        }
      })

      await supabase.auth.signOut() // 使用自定义客户端

      if (router.pathname.startsWith('/learn')) {
        router.push('/')
      }

      toast({
        title: '已退出登录',
        duration: 3000,
      })
    } catch (error) {
      console.error('退出登录失败:', error)
      toast({
        title: '退出登录失败',
        variant: 'destructive',
      })
    }
  }

  const handleGithubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) {
      console.error('登录失败:', error)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: '登录成功',
        description: '欢迎回来！',
        duration: 3000,
      })
      handleModalClose()
    } catch (error: any) {
      toast({
        title: '登录失败',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // 登录按钮点击处理
  const handleSignIn = () => {
    setShowSignInModal(true)
    externalShowSignIn(true)
  }

  // 模态框关闭处理
  const handleModalClose = () => {
    setShowSignInModal(false)
    externalShowSignIn(false)
  }

  return (
    <>
      <AnimatePresence>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-2 outline-none">
              <div className="rounded-full bg-blue-100 p-0.5 dark:bg-blue-900">
                <Avatar className="h-9 w-9 transition-all hover:ring-2 hover:ring-blue-500">
                  {user.user_metadata.avatar_url ? (
                    <AvatarImage src={user.user_metadata.avatar_url} />
                  ) : (
                    <AvatarFallback className="bg-blue-600 text-base text-white">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.user_metadata.full_name || user.user_metadata.user_name || user.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600 dark:text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <motion.button
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-500"
            onClick={handleSignIn}
            {...FADE_IN_ANIMATION_SETTINGS}
          >
            <User className="h-4 w-4" />
            <span>登录</span>
          </motion.button>
        )}
      </AnimatePresence>

      <Modal showModal={showSignInModal} setShowModal={handleModalClose}>
        <div className="w-full overflow-hidden bg-white shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
            <h3 className="font-display text-2xl font-bold">登录</h3>
            <p className="text-sm text-gray-500">请使用演示账号登录</p>
          </div>

          <Tabs defaultValue="email" className="w-full bg-white">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">
                <Mail className="mr-2 h-4 w-4" />
                邮箱登录
              </TabsTrigger>
              <TabsTrigger value="github">
                <Github className="mr-2 h-4 w-4" />
                GitHub 登录
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="bg-white p-4">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="邮箱地址"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {loading ? '处理中...' : '登录'}
                </button>
              </form>
            </TabsContent>

            <TabsContent value="github" className="bg-white p-4">
              <button
                onClick={handleGithubLogin}
                className="flex w-full items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
              >
                <Github className="h-5 w-5" />
                使用 GitHub 登录
              </button>
            </TabsContent>
          </Tabs>

          <div className="bg-white pb-6 text-center text-slate-400">
            点击登录或注册，即同意
            <a href="/terms-of-use" target="_blank" className="group underline" aria-label="服务条款">
              服务条款
            </a>
            和
            <a href="/privacy" target="_blank" className="group underline" aria-label="隐私声明">
              隐私政策
            </a>
            。
          </div>
        </div>
      </Modal>
    </>
  )
}

export default SignIn
