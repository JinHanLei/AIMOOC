import Github from '~/components/ui/GitHub'
import Link from 'next/link'
import React from 'react'
import { TypeAnimation } from 'react-type-animation'
import SquigglyLines from '~/components/ui/SquigglyLines'

export function TypingSlogan() {
  return (
    <>
      <h1 className="h-[5rem] w-full text-center text-4xl font-bold sm:text-7xl">
        一键总结{' '}
        <span className="relative whitespace-nowrap	text-blue-400">
          <SquigglyLines />
          <TypeAnimation
            sequence={[
              'B站',
              2000,
              '慕课',
              2000,
              '会议',
              2000,
              '本地',
              3000
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
        Powered by Hanlei Jin <div className="inline-block">
            {/* GitHub 链接 */}
            <Link
              href="https://github.com/JinHanLei"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 hidden sm:block hover:opacity-80"
            >
              <Github width="24" height="24" />
            </Link>
          </div>
      </h2>
    </>
  )
}
