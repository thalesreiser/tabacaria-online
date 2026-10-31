import { screen } from "@testing-library/vue"
import { renderSuspended } from "@nuxt/test-utils/runtime"
import { describe, expect, it } from "vitest"
import StockBadge from "~/components/StockBadge.vue"

describe("StockBadge", () => {
  it("shows 'Em estoque' above the low stock threshold", async () => {
    await renderSuspended(StockBadge, { props: { quantity: 12 } })

    expect(screen.getByText("Em estoque").getAttribute("data-stock")).toBe("in")
  })

  it("shows the remaining units at or below the threshold (default 3)", async () => {
    await renderSuspended(StockBadge, { props: { quantity: 3 } })

    expect(screen.getByText("Últimas 3 unidades").getAttribute("data-stock")).toBe("low")
  })

  it("uses the singular for the last unit", async () => {
    await renderSuspended(StockBadge, { props: { quantity: 1 } })

    expect(screen.getByText("Última unidade")).toBeTruthy()
  })

  it("shows 'Esgotado' when there is no stock", async () => {
    await renderSuspended(StockBadge, { props: { quantity: 0 } })

    expect(screen.getByText("Esgotado").getAttribute("data-stock")).toBe("out")
  })

  it("respects a custom low stock threshold", async () => {
    await renderSuspended(StockBadge, { props: { quantity: 8, lowThreshold: 10 } })

    expect(screen.getByText("Últimas 8 unidades")).toBeTruthy()
  })
})
