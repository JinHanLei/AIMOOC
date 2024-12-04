import { useUser } from '@supabase/auth-helpers-react'
import { AnimatePresence, motion } from 'framer-motion'
import { FADE_IN_ANIMATION_SETTINGS } from '~/utils/constants'
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { LogOut, User } from 'lucide-react'

export default function SignIn({ showSignIn }: { showSignIn: (show: boolean) => void }) {
  const user = useUser()
  const supabaseClient = useSupabaseClient()

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut()
  }

  function handleSignIn() {
    showSignIn(true)
  }

  return (
    <div>
      <AnimatePresence>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar className="h-8 w-8 hover:ring-2 hover:ring-blue-500 transition-all">
                {user.user_metadata.avatar_url ? (
                  <AvatarImage src={user.user_metadata.avatar_url} />
                ) : (
                  <AvatarFallback className="bg-blue-600 text-white">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.user_metadata.full_name || user.user_metadata.user_name || user.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
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
    </div>
  )
}
