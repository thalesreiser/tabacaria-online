import { MedusaError } from "@medusajs/framework/utils"
import { z } from "@medusajs/framework/zod"

const secret = z.string().min(32, "must have at least 32 characters")
const corsList = z.string().min(1, "must list at least one origin")

function buildSchema(isProduction: boolean) {
  /** Required in production; falls back to a local-only default elsewhere. */
  const requiredInProduction = (schema: z.ZodString, devDefault: string) =>
    isProduction ? schema : schema.default(devDefault)

  return z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.url().optional(),
    STORE_CORS: requiredInProduction(corsList, "http://localhost:3000"),
    ADMIN_CORS: requiredInProduction(corsList, "http://localhost:9000"),
    AUTH_CORS: requiredInProduction(corsList, "http://localhost:3000,http://localhost:9000"),
    JWT_SECRET: requiredInProduction(secret, "local-development-only-jwt-secret!!"),
    COOKIE_SECRET: requiredInProduction(secret, "local-development-only-cookie-secret"),
  })
}

export type Env = z.infer<ReturnType<typeof buildSchema>>

/**
 * Validates the environment at boot. The error lists variable names and rules only,
 * never the values, so it is safe to log.
 */
export function parseEnv(source: Record<string, string | undefined> = process.env): Env {
  // An empty value (e.g. `JWT_SECRET=` copied from .env.example) counts as missing.
  const present = Object.fromEntries(Object.entries(source).filter(([, value]) => value !== ""))
  const result = buildSchema(present.NODE_ENV === "production").safeParse(present)
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n  ")
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid environment variables:\n  ${issues}`,
    )
  }
  return result.data
}
