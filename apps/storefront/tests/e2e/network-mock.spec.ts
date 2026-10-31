import { expect, test } from "@playwright/test"
import { API_URL, mockNetwork } from "./support/mock-network"

// These tests protect the mocking helper itself, which every later E2E test relies on.
test.describe("network mock", () => {
  test("answers an API call from the configured handler", async ({ page }) => {
    const network = await mockNetwork(page, {
      "GET /store/products": { body: { products: [{ id: "prod_1" }] } },
    })
    await page.goto("/")

    const data = await page.evaluate(
      async (url) => (await fetch(`${url}/store/products`)).json() as Promise<unknown>,
      API_URL,
    )

    expect(data).toEqual({ products: [{ id: "prod_1" }] })
    network.assertNoUnmockedCalls()
  })

  test("fails the test when the API is called without a mock", async ({ page }) => {
    const network = await mockNetwork(page)
    await page.goto("/")

    await page.evaluate(async (url) => {
      await fetch(`${url}/store/carts`).catch(() => undefined)
    }, API_URL)

    expect(network.unmocked).toEqual(["GET /store/carts"])
    expect(() => network.assertNoUnmockedCalls()).toThrow()
  })

  test("blocks requests to hosts outside localhost", async ({ page }) => {
    await mockNetwork(page)
    await page.goto("/")

    const reachedExternalHost = await page.evaluate(async () => {
      try {
        await fetch("https://example.com/", { mode: "no-cors" })
        return true
      } catch {
        return false
      }
    })

    expect(reachedExternalHost).toBe(false)
  })
})
