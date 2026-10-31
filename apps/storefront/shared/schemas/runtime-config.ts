import { z } from "zod"

export const publicRuntimeConfigSchema = z.object({
  apiUrl: z.url(),
  publishableKey: z.string().min(1),
  sentryDsn: z.union([z.url(), z.literal("")]),
})

export type PublicRuntimeConfig = z.infer<typeof publicRuntimeConfigSchema>
