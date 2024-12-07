import { Inter as FontSans } from 'next/font/google'
import { createBrowserSupabaseClient, Session } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { TailwindIndicator } from '~/components/ui/tailwind-indicator'
import { Toaster } from '~/components/ui/toaster'
import { TooltipProvider } from '~/components/ui/tooltip'
import { cn } from '~/lib/utils'
import Header from '~/components/Header'
import '~/styles/globals.css'
import '~/styles/markdown.css'
import { supabase } from '~/lib/supabase'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  const router = useRouter()
  const [showSignIn, setShowSignIn] = useState(false)
  const isLearnPage = router.pathname?.startsWith('/learn')

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setShowSignIn(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <div className={cn('min-h-screen font-sans antialiased', 'bg-white dark:bg-slate-950', fontSans.variable)}>
            <Header showSignIn={setShowSignIn} />
            <main
              className={cn(
                'mx-auto w-full flex-1 flex-col',
                'bg-white dark:bg-slate-950',
                !isLearnPage && 'max-w-5xl',
              )}
            >
              <Component {...pageProps} showSignIn={setShowSignIn} />
              <Analytics />
            </main>
            <div className="fixed inset-0 -z-10 bg-white dark:bg-slate-950" />
          </div>
          <TailwindIndicator />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </SessionContextProvider>
  )
}

export default MyApp
