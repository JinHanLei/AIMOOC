import React from 'react'
import { TypeAnimation } from 'react-type-animation'
import SquigglyLines from '~/components/ui/SquigglyLines'

export function TypingSlogan() {
  return (
    <>
      <h1 className="h-[5rem] w-full text-center text-4xl font-bold sm:w-[64rem] sm:text-7xl">
        一键总结{' '}
        <span className="relative whitespace-nowrap	text-blue-400">
          <SquigglyLines />
          <TypeAnimation
            sequence={[
              '哔哩哔哩',
              2000,
              'YouTube',
              2000,
              '慕课',
              2000,
              '会议',
              2000,
              '本地文件',
              3000,
              () => {
                console.log('Done typing!') // Place optional callbacks anywhere in the array
              },
            ]}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
            className="relative text-blue-600"
          />
        </span>{' '}
        音视频内容 <br />
      </h1>

      <h2 className="mt-4 w-full text-center text-lg font-medium text-gray-600 dark:text-gray-400 sm:text-xl">
        Powered by AIZC Team
      </h2>
    </>
  )
}
