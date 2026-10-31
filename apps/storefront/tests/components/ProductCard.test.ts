import { fireEvent, screen } from "@testing-library/vue"
import { renderSuspended } from "@nuxt/test-utils/runtime"
import { describe, expect, it, vi } from "vitest"
import ProductCard from "~/components/ProductCard.vue"

const base = { name: "Isqueiro azul clássico", to: "/produto/isqueiro", amount: 1290, stock: 12 }

describe("ProductCard", () => {
  it("links the name to the product page and shows price and stock", async () => {
    await renderSuspended(ProductCard, { props: base })

    const link = screen.getByRole("link", { name: "Isqueiro azul clássico" })
    expect(link.getAttribute("href")).toBe("/produto/isqueiro")
    expect(screen.getByText("R$ 12,90")).toBeTruthy()
    expect(screen.getByText("Em estoque")).toBeTruthy()
  })

  it("emits add when the button is clicked", async () => {
    const onAdd = vi.fn()
    await renderSuspended(ProductCard, { props: { ...base, onAdd } })

    await fireEvent.click(screen.getByRole("button", { name: "Adicionar" }))

    expect(onAdd).toHaveBeenCalledTimes(1)
  })

  it("disables the button and shows 'Esgotado' when there is no stock", async () => {
    const onAdd = vi.fn()
    await renderSuspended(ProductCard, { props: { ...base, stock: 0, onAdd } })

    const button = screen.getByRole<HTMLButtonElement>("button", { name: "Indisponível" })
    expect(button.disabled).toBe(true)
    expect(screen.getByText("Esgotado")).toBeTruthy()

    await fireEvent.click(button)
    expect(onAdd).not.toHaveBeenCalled()
  })

  it("shows the discount percentage and the old price on a promotion", async () => {
    await renderSuspended(ProductCard, {
      props: { ...base, amount: 4990, originalAmount: 5990, stock: 3 },
    })

    expect(screen.getByText("-17%")).toBeTruthy()
    expect(screen.getByText("17% de desconto")).toBeTruthy()
    expect(screen.getByText(/R\$\s59,90/)).toBeTruthy()
    expect(screen.getByText("Últimas 3 unidades")).toBeTruthy()
  })

  it("shows no discount badge without a higher original price", async () => {
    await renderSuspended(ProductCard, { props: base })

    expect(screen.queryByText(/%/)).toBeNull()
  })

  it("keeps the add button above the stretched link so both stay clickable", async () => {
    await renderSuspended(ProductCard, { props: base })

    expect(screen.getByRole("button", { name: "Adicionar" }).className).toContain("z-10")
  })
})
