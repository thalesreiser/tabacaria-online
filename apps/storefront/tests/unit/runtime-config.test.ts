import { describe, expect, it } from "vitest"
import { publicRuntimeConfigSchema } from "~~/shared/schemas/runtime-config"

const validConfig = {
  apiUrl: "https://api.exemplo.com",
  publishableKey: "pk_teste",
  sentryDsn: "",
  store: { legalName: "", cnpj: "", address: "", support: "", minorsNotice: "" },
}

describe("publicRuntimeConfigSchema", () => {
  it("accepts a complete config with empty optional values", () => {
    expect(publicRuntimeConfigSchema.safeParse(validConfig).success).toBe(true)
  })

  it("rejects an API URL that is not a URL and names the field", () => {
    const result = publicRuntimeConfigSchema.safeParse({ ...validConfig, apiUrl: "nao-e-url" })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path.join("."))).toContain("apiUrl")
  })

  it("rejects an empty publishable key and names the field", () => {
    const result = publicRuntimeConfigSchema.safeParse({ ...validConfig, publishableKey: "" })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path.join("."))).toContain("publishableKey")
  })

  it("rejects an invalid Sentry DSN but accepts an empty one", () => {
    expect(publicRuntimeConfigSchema.safeParse({ ...validConfig, sentryDsn: "lixo" }).success).toBe(
      false,
    )
    expect(publicRuntimeConfigSchema.safeParse({ ...validConfig, sentryDsn: "" }).success).toBe(
      true,
    )
  })
})
