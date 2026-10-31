import { describe, expect, it } from "vitest"
import { createMockRepository } from "~/mocks/catalog"
import type { ProductListQuery, StoreProduct } from "~/types/catalog"

const base: ProductListQuery = { inStock: false, sort: "relevance", limit: 100, offset: 0 }
const repository = createMockRepository()
const price = (product: StoreProduct) =>
  product.variants[0]?.calculated_price.calculated_amount ?? 0

describe("mock catalog", () => {
  it("has 60 fictional products with unique handles in 4 categories", async () => {
    const { products, count } = await repository.list(base)

    expect(count).toBe(60)
    expect(new Set(products.map((p) => p.handle)).size).toBe(60)
    expect(await repository.categories()).toHaveLength(4)
  })

  it("filters by category", async () => {
    const { products, count } = await repository.list({ ...base, category: "isqueiros" })

    expect(count).toBe(15)
    expect(products.every((p) => p.categories.some((c) => c.handle === "isqueiros"))).toBe(true)
  })

  it("searches by name ignoring case and accents", async () => {
    const { products } = await repository.list({ ...base, search: "CLASSICO" })

    expect(products.length).toBeGreaterThan(0)
    expect(products.every((p) => p.title.toLowerCase().includes("clássico"))).toBe(true)
  })

  it("filters by price range in cents", async () => {
    const { products } = await repository.list({ ...base, minPrice: 2000, maxPrice: 4000 })

    expect(products.length).toBeGreaterThan(0)
    expect(products.every((p) => price(p) >= 2000 && price(p) <= 4000)).toBe(true)
  })

  it("keeps only products in stock", async () => {
    const all = await repository.list(base)
    const inStock = await repository.list({ ...base, inStock: true })

    expect(inStock.count).toBeLessThan(all.count)
    expect(inStock.products.every((p) => p.variants.some((v) => v.inventory_quantity > 0))).toBe(
      true,
    )
  })

  it("sorts by price in both directions", async () => {
    const asc = (await repository.list({ ...base, sort: "price-asc" })).products.map(price)
    const desc = (await repository.list({ ...base, sort: "price-desc" })).products.map(price)

    expect(asc).toEqual([...asc].sort((a, b) => a - b))
    expect(desc).toEqual([...desc].sort((a, b) => b - a))
  })

  it("sorts the newest first", async () => {
    const { products } = await repository.list({ ...base, sort: "newest" })
    const dates = products.map((p) => p.created_at)

    expect(dates).toEqual([...dates].sort().reverse())
  })

  it("slices by offset and limit but reports the full count", async () => {
    const page = await repository.list({ ...base, limit: 24, offset: 48 })

    expect(page.products).toHaveLength(12)
    expect(page.count).toBe(60)
  })

  it("simulates an empty list and an error on request", async () => {
    await expect(createMockRepository({ simulate: "vazio" }).list(base)).resolves.toEqual({
      products: [],
      count: 0,
    })
    await expect(createMockRepository({ simulate: "erro" }).list(base)).rejects.toThrow()
  })

  it("contains no tobacco, only accessories", async () => {
    const { products } = await repository.list(base)

    expect(products.some((p) => /tabaco|fumo|cigarro|charuto/i.test(p.title))).toBe(false)
  })
})
