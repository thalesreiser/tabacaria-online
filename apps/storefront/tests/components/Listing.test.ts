import { fireEvent, screen } from "@testing-library/vue"
import { renderSuspended } from "@nuxt/test-utils/runtime"
import { describe, expect, it, vi } from "vitest"
import ListingFilters from "~/components/ListingFilters.vue"
import ListingPagination from "~/components/ListingPagination.vue"
import ProductCard from "~/components/ProductCard.vue"
import { parseFilters } from "~/lib/catalog"

const categories = [
  { id: "c1", handle: "isqueiros", name: "Isqueiros" },
  { id: "c2", handle: "moedores", name: "Moedores" },
]

function filtersProps(query: Record<string, string> = {}, activeCategory?: string | null) {
  return { categories, activeCategory, filters: parseFilters(query), idPrefix: "t" }
}

describe("ListingPagination", () => {
  it("renders nothing for a single page", async () => {
    const { container } = await renderSuspended(ListingPagination, { props: { page: 1, pages: 1 } })

    expect(container.querySelector("nav")).toBeNull()
  })

  it("links every other page with ?pagina and marks the current one", async () => {
    await renderSuspended(ListingPagination, { props: { page: 2, pages: 3 } })

    expect(screen.getByRole("link", { name: "Página 1" }).getAttribute("href")).not.toContain(
      "pagina",
    )
    expect(screen.getByRole("link", { name: "Página 3" }).getAttribute("href")).toContain(
      "pagina=3",
    )
    expect(screen.getByText("2").getAttribute("aria-current")).toBe("page")
    expect(screen.getByRole("link", { name: "Página anterior" })).toBeTruthy()
    expect(screen.getByRole("link", { name: "Próxima página" })).toBeTruthy()
  })

  it("disables the previous control on the first page and the next on the last", async () => {
    const first = await renderSuspended(ListingPagination, { props: { page: 1, pages: 3 } })
    expect(screen.queryByRole("link", { name: "Página anterior" })).toBeNull()
    expect(screen.getByRole("link", { name: "Próxima página" })).toBeTruthy()
    first.unmount()

    await renderSuspended(ListingPagination, { props: { page: 3, pages: 3 } })
    expect(screen.queryByRole("link", { name: "Próxima página" })).toBeNull()
  })
})

describe("ListingFilters", () => {
  it("marks the open category and links to the others", async () => {
    await renderSuspended(ListingFilters, { props: filtersProps({}, "moedores") })

    expect(screen.getByRole("link", { name: "Moedores" }).getAttribute("aria-current")).toBe("page")
    expect(screen.getByRole("link", { name: "Isqueiros" }).getAttribute("href")).toBe(
      "/categoria/isqueiros",
    )
    expect(
      screen.getByRole("link", { name: "Todos os acessórios" }).getAttribute("aria-current"),
    ).toBeNull()
  })

  it("marks 'all' only when no category is open, and nothing on the search page", async () => {
    const all = await renderSuspended(ListingFilters, { props: filtersProps() })
    expect(
      screen.getByRole("link", { name: "Todos os acessórios" }).getAttribute("aria-current"),
    ).toBe("page")
    all.unmount()

    await renderSuspended(ListingFilters, { props: filtersProps({}, null) })
    expect(
      screen.getByRole("link", { name: "Todos os acessórios" }).getAttribute("aria-current"),
    ).toBeNull()
  })

  it("emits the stock filter as soon as the checkbox changes", async () => {
    const onChange = vi.fn()
    await renderSuspended(ListingFilters, { props: { ...filtersProps(), onChange } })

    await fireEvent.click(screen.getByRole("checkbox", { name: "Só em estoque" }))

    expect(onChange).toHaveBeenCalledWith({ inStock: true })
  })

  it("emits whole-real prices when the price form is applied and drops invalid ones", async () => {
    const onChange = vi.fn()
    await renderSuspended(ListingFilters, { props: { ...filtersProps(), onChange } })

    await fireEvent.update(screen.getByLabelText("Preço mínimo, em reais"), "10")
    await fireEvent.update(screen.getByLabelText("Preço máximo, em reais"), "abc")
    await fireEvent.click(screen.getByRole("button", { name: "Aplicar" }))

    expect(onChange).toHaveBeenCalledWith({ minPrice: 10, maxPrice: undefined })
  })

  it("shows 'Limpar filtros' only while a filter is active", async () => {
    const none = await renderSuspended(ListingFilters, { props: filtersProps() })
    expect(screen.queryByRole("button", { name: "Limpar filtros" })).toBeNull()
    none.unmount()

    const onClear = vi.fn()
    await renderSuspended(ListingFilters, { props: { ...filtersProps({ estoque: "1" }), onClear } })
    await fireEvent.click(screen.getByRole("button", { name: "Limpar filtros" }))

    expect(onClear).toHaveBeenCalledTimes(1)
  })
})

describe("ProductCard in a grid", () => {
  it("renders the name as an h3 by default and as the level the page asks for", async () => {
    const props = { name: "Isqueiro", to: "/produto/x", amount: 1290, stock: 5 }

    const byDefault = await renderSuspended(ProductCard, { props })
    expect(screen.getByRole("heading", { level: 3, name: "Isqueiro" })).toBeTruthy()
    byDefault.unmount()

    await renderSuspended(ProductCard, { props: { ...props, headingLevel: 2 } })
    expect(screen.getByRole("heading", { level: 2, name: "Isqueiro" })).toBeTruthy()
  })

  it("pins the add button to the bottom so a row of cards stays aligned", async () => {
    await renderSuspended(ProductCard, {
      props: { name: "Isqueiro", to: "/produto/x", amount: 1290, stock: 5 },
    })

    expect(screen.getByRole("button", { name: "Adicionar" }).className).toContain("mt-auto")
  })
})
