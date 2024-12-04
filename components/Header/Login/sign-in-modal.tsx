import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Image from 'next/image'
import React, { Dispatch, SetStateAction, useCallback, useMemo, useEffect } from 'react'
import Modal from '~/components/shared/modal'
import { Github } from 'lucide-react'

const SignInModal = ({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean
  setShowSignInModal: Dispatch<SetStateAction<boolean>>
}) => {
  const supabaseClient = useSupabaseClient()

  const handleGithubLogin = async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    })

    if (error) {
      console.error('登录失败:', error)
    }
  }

  return (
    <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
      <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <h3 className="font-display text-2xl font-bold">登录</h3>
        </div>

        <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
          <button
            onClick={handleGithubLogin}
            className="flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
          >
            <Github className="h-5 w-5" />
            使用 GitHub 登录
          </button>
        </div>
        <p className="pb-6 text-center text-slate-400">
          点击登录或注册，即同意
          <a href="/terms-of-use" target="_blank" className="group underline" aria-label="服务条款">
            服务条款
          </a>
          和
          <a href="/privacy" target="_blank" className="group underline" aria-label="隐私声明">
            隐私政策
          </a>
          。
        </p>
      </div>
    </Modal>
  )
}

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = React.useState(false)

  const SignInModalCallback = useCallback(() => {
    return <SignInModal showSignInModal={showSignInModal} setShowSignInModal={setShowSignInModal} />
  }, [showSignInModal, setShowSignInModal])

  return useMemo(
    () => ({ setShowSignInModal, SignInModal: SignInModalCallback }),
    [setShowSignInModal, SignInModalCallback],
  )
}
