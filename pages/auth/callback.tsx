import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function AuthCallback() {
  const router = useRouter()
  const supabaseClient = useSupabaseClient()

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // 直接关闭当前窗口，回到原页面
        window.close()
      }
    })
  }, [router, supabaseClient.auth])

  return null
}