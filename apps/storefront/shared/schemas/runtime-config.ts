import { z } from "zod"

export const publicRuntimeConfigSchema = z.object({
  apiUrl: z.url(),
  publishableKey: z.string().min(1),
  sentryDsn: z.union([z.url(), z.literal("")]),
  store: z.object({
    legalName: z.string(),
    cnpj: z.string(),
    address: z.string(),
    support: z.string(),
    minorsNotice: z.string(),
  }),
})

export type PublicRuntimeConfig = z.infer<typeof publicRuntimeConfigSchema>
