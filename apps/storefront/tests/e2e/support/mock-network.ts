import { expect } from "@playwright/test"
import type { Page } from "@playwright/test"

// Must match NUXT_PUBLIC_API_URL in playwright.config.ts. The host does not resolve, so a request
// that is not intercepted can never reach a real service.
export const API_URL = "https://api.test"

export interface MockResponse {
  status?: number
  body: unknown
}

/** Keys are "METHOD /path", for example "GET /store/products". */
export type MockHandlers = Record<string, MockResponse>

const localHosts = new Set(["localhost", "127.0.0.1"])

/**
 * Blocks every request that leaves localhost and answers the Medusa API from `handlers`.
 * A call without a handler is aborted and recorded, and `assertNoUnmockedCalls` fails the test.
 */
export async function mockNetwork(page: Page, handlers: MockHandlers = {}) {
  const unmocked: string[] = []

  // Registered first, so it has the lowest priority: anything not handled below is blocked.
  await page.route(
    (url) => !localHosts.has(url.hostname),
    (route) => route.abort(),
  )

  await page.route(`${API_URL}/**`, async (route) => {
    const request = route.request()
    const key = `${request.method()} ${new URL(request.url()).pathname}`
    const handler = handlers[key]

    if (!handler) {
      unmocked.push(key)
      await route.abort()
      return
    }

    await route.fulfill({
      status: handler.status ?? 200,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify(handler.body),
    })
  })

  return {
    unmocked,
    assertNoUnmockedCalls() {
      expect(unmocked, "requests to the API without a mock").toEqual([])
    },
  }
}
