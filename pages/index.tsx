import { NextPage } from 'next'
import React from 'react'
import SlugPage from './[...slug]'

const Home: NextPage<{
  showSignIn: (show: boolean) => void
}> = ({ showSignIn }) => {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <SlugPage showSignIn={showSignIn} hideHeader={true} />
      </main>
    </div>
  )
}

export default Home
