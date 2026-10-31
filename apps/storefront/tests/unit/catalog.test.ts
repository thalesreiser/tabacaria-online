import { describe, expect, it } from "vitest"
import {
  PAGE_SIZE,
  clampPage,
  filtersToQuery,
  hasActiveFilters,
  pageCount,
  pageItems,
  parseFilters,
  toProductCard,
} from "~/lib/catalog"
import type { StoreProduct } from "~/types/catalog"

describe("parseFilters", () => {
  it("uses defaults for an empty address", () => {
    expect(parseFilters({})).toEqual({
      sort: "relevance",
      minPrice: undefined,
      maxPrice: undefined,
      inStock: false,
      search: undefined,
      page: 1,
    })
  })

  it("reads every filter from the address", () => {
    const filters = parseFilters({
      ordem: "menor-preco",
      preco_min: "10",
      preco_max: "50",
      estoque: "1",
      q: "  moedor ",
      pagina: "3",
    })

    expect(filters).toEqual({
      sort: "price-asc",
      minPrice: 10,
      maxPrice: 50,
      inStock: true,
      search: "moedor",
      page: 3,
    })
  })

  it("maps each sort name", () => {
    expect(parseFilters({ ordem: "maior-preco" }).sort).toBe("price-desc")
    expect(parseFilters({ ordem: "novidades" }).sort).toBe("newest")
  })

  it("ignores anything invalid", () => {
    const filters = parseFilters({
      ordem: "aleatorio",
      preco_min: "-5",
      preco_max: "abc",
      estoque: "sim",
      pagina: "0",
    })

    expect(filters.sort).toBe("relevance")
    expect(filters.minPrice).toBeUndefined()
    expect(filters.maxPrice).toBeUndefined()
    expect(filters.inStock).toBe(false)
    expect(filters.page).toBe(1)
  })

  it("drops a maximum price lower than the minimum", () => {
    const filters = parseFilters({ preco_min: "50", preco_max: "10" })

    expect(filters.minPrice).toBe(50)
    expect(filters.maxPrice).toBeUndefined()
  })

  it("takes the first value of a repeated parameter", () => {
    expect(parseFilters({ ordem: ["novidades", "menor-preco"] }).sort).toBe("newest")
  })
})

describe("filtersToQuery", () => {
  it("leaves defaults out of the address", () => {
    expect(filtersToQuery({ sort: "relevance", inStock: false, page: 1 })).toEqual({})
  })

  it("round-trips through parseFilters", () => {
    const original = parseFilters({
      ordem: "maior-preco",
      preco_min: "5",
      preco_max: "99",
      estoque: "1",
      q: "isqueiro",
      pagina: "2",
    })

    expect(parseFilters(filtersToQuery(original))).toEqual(original)
  })

  it("flags active filters but not sort or search", () => {
    expect(hasActiveFilters(parseFilters({ ordem: "novidades", q: "a" }))).toBe(false)
    expect(hasActiveFilters(parseFilters({ estoque: "1" }))).toBe(true)
    expect(hasActiveFilters(parseFilters({ preco_min: "1" }))).toBe(true)
  })
})

describe("pagination helpers", () => {
  it("counts pages of 24 and never returns less than one", () => {
    expect(PAGE_SIZE).toBe(24)
    expect(pageCount(0)).toBe(1)
    expect(pageCount(24)).toBe(1)
    expect(pageCount(25)).toBe(2)
    expect(pageCount(60)).toBe(3)
  })

  it("clamps a page into the valid range", () => {
    expect(clampPage(99, 60)).toBe(3)
    expect(clampPage(0, 60)).toBe(1)
    expect(clampPage(2, 60)).toBe(2)
  })

  it("lists the first, last, current and neighbouring pages with gaps", () => {
    const labels = pageItems(6, 12).map((item) => (item.type === "gap" ? "…" : item.page))

    expect(labels).toEqual([1, "…", 5, 6, 7, "…", 12])
  })

  it("has no gap when the pages are adjacent", () => {
    expect(pageItems(2, 3).map((item) => (item.type === "gap" ? "…" : item.page))).toEqual([
      1, 2, 3,
    ])
  })

  it("marks only the first, last and current page as essential on phones", () => {
    const essential = pageItems(6, 12)
      .filter((item) => item.type === "page" && item.essential)
      .map((item) => (item.type === "page" ? item.page : 0))

    expect(essential).toEqual([1, 6, 12])
  })
})

describe("toProductCard", () => {
  const product: StoreProduct = {
    id: "prod_1",
    handle: "isqueiro-azul",
    title: "Isqueiro azul",
    thumbnail: null,
    created_at: "2026-01-01T00:00:00.000Z",
    categories: [],
    variants: [
      {
        id: "v1",
        inventory_quantity: 2,
        calculated_price: { calculated_amount: 2000, original_amount: 2000 },
      },
      {
        id: "v2",
        inventory_quantity: 3,
        calculated_price: { calculated_amount: 1500, original_amount: 1800 },
      },
    ],
  }

  it("uses the cheapest variant, sums the stock and links to the product page", () => {
    expect(toProductCard(product)).toEqual({
      id: "prod_1",
      name: "Isqueiro azul",
      to: "/produto/isqueiro-azul",
      amount: 1500,
      originalAmount: 1800,
      stock: 5,
      image: undefined,
    })
  })

  it("has no original amount when the price is not discounted", () => {
    const [full] = product.variants
    const plain = { ...product, variants: full ? [full] : [] }

    expect(toProductCard(plain).originalAmount).toBeUndefined()
  })
})
