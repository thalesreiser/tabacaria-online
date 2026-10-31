import { parseEnv } from "../env"

const strongSecret = "x".repeat(32)

const production = {
  NODE_ENV: "production",
  DATABASE_URL: "postgres://user:pass@db.example:5432/store",
  STORE_CORS: "https://loja.example",
  ADMIN_CORS: "https://admin.example",
  AUTH_CORS: "https://loja.example",
  JWT_SECRET: strongSecret,
  COOKIE_SECRET: strongSecret,
}

describe("parseEnv", () => {
  it("fills local defaults outside production", () => {
    const env = parseEnv({ NODE_ENV: "development" })

    expect(env.STORE_CORS).toBe("http://localhost:3000")
    expect(env.JWT_SECRET.length).toBeGreaterThanOrEqual(32)
  })

  it("treats empty values as missing", () => {
    const env = parseEnv({ NODE_ENV: "development", JWT_SECRET: "" })

    expect(env.JWT_SECRET).not.toBe("")
  })

  it("requires CORS and secrets in production", () => {
    expect(() => parseEnv({ NODE_ENV: "production" })).toThrow(
      /STORE_CORS[\s\S]*JWT_SECRET[\s\S]*COOKIE_SECRET/,
    )
  })

  it("rejects short secrets in production without echoing the value", () => {
    const env = { ...production, JWT_SECRET: "short-secret-value" }

    expect(() => parseEnv(env)).toThrow(/JWT_SECRET: must have at least 32 characters/)
    expect(() => parseEnv(env)).not.toThrow(/short-secret-value/)
  })

  it("accepts a complete production environment", () => {
    expect(parseEnv(production).NODE_ENV).toBe("production")
  })

  it("rejects a malformed database URL", () => {
    expect(() => parseEnv({ DATABASE_URL: "not a url" })).toThrow(/DATABASE_URL/)
  })
})
