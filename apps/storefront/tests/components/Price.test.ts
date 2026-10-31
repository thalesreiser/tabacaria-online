import { screen } from "@testing-library/vue"
import { renderSuspended } from "@nuxt/test-utils/runtime"
import { describe, expect, it } from "vitest"
import Price from "~/components/Price.vue"
import { formatPrice } from "~/lib/price"

describe("formatPrice", () => {
  it("formats cents as Brazilian reais", () => {
    expect(formatPrice(1290)).toMatch(/^R\$\s12,90$/)
    expect(formatPrice(0)).toMatch(/^R\$\s0,00$/)
    expect(formatPrice(123456)).toMatch(/^R\$\s1\.234,56$/)
  })
})

describe("Price", () => {
  it("shows the amount in reais", async () => {
    await renderSuspended(Price, { props: { amount: 1290 } })

    expect(screen.getByText("R$ 12,90")).toBeTruthy()
  })

  it("shows the original price struck through and reads it as 'de ... por'", async () => {
    const { container } = await renderSuspended(Price, {
      props: { amount: 4990, originalAmount: 5990 },
    })

    const struck = container.querySelector("s")
    expect(struck?.textContent?.replace(/\s+/g, " ").trim()).toBe("de R$ 59,90")
    expect(screen.getByText("R$ 49,90")).toBeTruthy()
    expect(container.textContent?.replace(/\s+/g, " ")).toContain("por")
  })

  it("ignores an original price that is not higher than the amount", async () => {
    const { container } = await renderSuspended(Price, {
      props: { amount: 4990, originalAmount: 4990 },
    })

    expect(container.querySelector("s")).toBeNull()
  })
})
