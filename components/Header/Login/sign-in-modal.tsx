import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Image from 'next/image'
import Link from 'next/link'
import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useAnalytics } from '~/components/context/analytics'
import Modal from '~/components/shared/modal'
import { BASE_DOMAIN, CHECKOUT_URL, LOGIN_LIMIT_COUNT } from '~/utils/constants'
import { getRedirectURL } from '~/utils/getRedirectUrl'
import { isValidCredentials, login } from '~/lib/auth'
import { useToast } from '~/hooks/use-toast'
import { Button } from '~/components/ui/button'
import { Loader2, User } from 'lucide-react'

const SignInModal = ({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean
  setShowSignInModal: Dispatch<SetStateAction<boolean>>
}) => {
  const supabaseClient = useSupabaseClient()
  const { analytics } = useAnalytics()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}`
    : ''

  const handleDemoLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      const username = process.env.NEXT_PUBLIC_DEMO_USERNAME || 'demo@example.com'
      if (login(username)) {
        setIsLoading(false)
        setShowSignInModal(false)
        toast({
          title: "登录成功",
          description: "欢迎使用演示账号",
        })
      } else {
        setIsLoading(false)
        toast({
          title: "登录失败",
          description: "演示账号配置错误",
          variant: "destructive"
        })
      }
    }, 1000)
  }

  return (
    <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
      <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <a href={BASE_DOMAIN}>
            <Image src="/tv-logo.png" alt="Logo" className="h-10 w-10 rounded-full" width={20} height={20} />
          </a>
          <h3 className="font-display text-2xl font-bold">登录</h3>
        </div>

        <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
          <Auth
            supabaseClient={supabaseClient}
            redirectTo={baseUrl}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#F17EB8',
                    brandAccent: '#f88dbf',
                  },
                },
              },
            }}
            providers={['notion', 'github']}
            onlyThirdPartyProviders
            localization={{
              variables: {
                sign_up: {
                  social_provider_text: '使用 {{provider}} 注册',
                },
                sign_in: {
                  social_provider_text: '使用 {{provider}} 登录',
                },
              },
            }}
          />
          <Button
            disabled={isLoading}
            onClick={handleDemoLogin}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <User className="mr-2 h-4 w-4" />
            )}
            使用演示账号登录
          </Button>
        </div>
        <p className="pb-6 text-center text-slate-400">
          点击登录或注册，即同意
          <a href="/terms-of-use" target="_blank" className="group underline" aria-label="服务条款">
            服务条款
          </a>
          和
          <Link href="/privacy" target="_blank" className="group underline" aria-label="隐私声明">
            隐私政策
          </Link>
          。
        </p>
      </div>
    </Modal>
  )
}

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = useState(false)

  const SignInModalCallback = useCallback(() => {
    return <SignInModal showSignInModal={showSignInModal} setShowSignInModal={setShowSignInModal} />
  }, [showSignInModal, setShowSignInModal])

  return useMemo(
    () => ({ setShowSignInModal, SignInModal: SignInModalCallback }),
    [setShowSignInModal, SignInModalCallback],
  )
}
