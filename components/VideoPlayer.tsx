import React, { FC } from 'react'

interface VideoPlayerProps {
  url: string
  className?: string
}

export const VideoPlayer: FC<VideoPlayerProps> = ({ url, className }) => {
  return (
    <video 
      src={url}
      controls
      className={className}
    />
  )
} 