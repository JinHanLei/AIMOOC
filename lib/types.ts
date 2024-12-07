import { VideoConfigSchema } from '~/utils/schemas/video'

export type SummarizeParams = {
  videoConfig: VideoConfig
  userConfig: UserConfig
}
export type UserConfig = {
  userKey?: string
  shouldShowTimestamp?: boolean
}
export type VideoConfig = {
  videoId: string
  service?: VideoService
  pageNumber?: null | string
} & VideoConfigSchema

export enum VideoService {
  Bilibili = 'bilibili',
  Icourse = 'icourse',
  Meeting = 'meeting',
  LocalVideo = 'local-video',
  LocalAudio = 'local-audio',
}

export interface CommonSubtitleItem {
  from: number
  to: number
  location: number
  content: string
}

interface VideoDimension {
  width: number
  height: number
  rotate: number
}

export interface VideoPage {
  cid: number
  page: number
  from: string
  part: string
  duration: number
  vid: string
  weblink: string
  dimension: VideoDimension
  first_frame?: string
}

export interface VideoInfo {
  service: VideoService
  videoId: string
  embedUrl: string
  title?: string
  courseId?: string
  termId?: string
  page?: number
  description?: string
  owner?: {
    name: string
    face: string
  }
  pages?: VideoPage[]
}

export interface SubtitleData {
  lan: string
  subtitle: CommonSubtitleItem[]
}

export interface PageState {
  loading: boolean
  videoInfo: VideoInfo | null
  subtitles: SubtitleData[] | null
}
