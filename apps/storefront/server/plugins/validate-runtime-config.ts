import { publicRuntimeConfigSchema } from "../../shared/schemas/runtime-config"

// Fails the server at startup, naming the offending variables, instead of failing at the first request.
export default defineNitroPlugin(() => {
  const result = publicRuntimeConfigSchema.safeParse(useRuntimeConfig().public)
  if (result.success) return

  const problems = result.error.issues.map(
    (issue) => `public.${issue.path.join(".")}: ${issue.message}`,
  )
  throw new Error(`Invalid runtimeConfig:\n${problems.join("\n")}`)
})
