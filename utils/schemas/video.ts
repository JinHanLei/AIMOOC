import { z } from 'zod'

export const videoConfigSchema = z.object({
  enableStream: z.boolean(),
  showTimestamp: z.boolean(),
  showEmoji: z.boolean(),
  detailLevel: z.number(),
  sentenceNumber: z.number(),
  outlineLevel: z.number(),
  outputLanguage: z.string(),
})

export type VideoConfigSchema = z.infer<typeof videoConfigSchema>
