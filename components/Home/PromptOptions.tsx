import React from 'react'
import { UseFormGetValues, UseFormRegister } from 'react-hook-form'
import { VideoConfigSchema } from '~/utils/schemas/video'

interface PromptOptionsProps {
  getValues: UseFormGetValues<VideoConfigSchema>
  register: UseFormRegister<VideoConfigSchema>
}

export function PromptOptions({ getValues, register }: PromptOptionsProps) {
  return (
    <div className="mt-2 grid items-center gap-2">
      <div>
        <label htmlFor="detailLevel" className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
          笔记字数
          <span className="text-gray-500">(≤{getValues('detailLevel')})</span>
        </label>
        <input
          id="detailLevel"
          type="range"
          min={300}
          max={1000}
          step={100}
          className="h-2 w-full cursor-pointer rounded-lg bg-gray-200 accent-black dark:bg-gray-700"
          {...register('detailLevel', {
            valueAsNumber: true,
          })}
        />
      </div>
    </div>
  )
}
