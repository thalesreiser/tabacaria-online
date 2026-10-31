import { describe, expect, it } from "vitest"
import { publicRuntimeConfigSchema } from "~~/shared/schemas/runtime-config"

const validConfig = {
  apiUrl: "https://api.exemplo.com",
  publishableKey: "pk_teste",
  sentryDsn: "",
  appEnv: "production",
  dataSource: "mock",
  store: { legalName: "", cnpj: "", address: "", support: "", minorsNotice: "" },
}

describe("publicRuntimeConfigSchema", () => {
  it("accepts a complete config with empty optional values", () => {
    expect(publicRuntimeConfigSchema.safeParse(validConfig).success).toBe(true)
  })

  it("accepts only the mock and api data sources and names the field", () => {
    for (const dataSource of ["mock", "api"]) {
      expect(publicRuntimeConfigSchema.safeParse({ ...validConfig, dataSource }).success).toBe(true)
    }

    const result = publicRuntimeConfigSchema.safeParse({ ...validConfig, dataSource: "csv" })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path.join("."))).toContain("dataSource")
  })

  it("accepts only the known app environments and names the field", () => {
    for (const appEnv of ["development", "preview", "production"]) {
      expect(publicRuntimeConfigSchema.safeParse({ ...validConfig, appEnv }).success).toBe(true)
    }

    const result = publicRuntimeConfigSchema.safeParse({ ...validConfig, appEnv: "staging" })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path.join("."))).toContain("appEnv")
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
