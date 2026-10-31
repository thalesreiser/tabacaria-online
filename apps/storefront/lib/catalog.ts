import type { ProductSort, StoreProduct } from "~/types/catalog"

export const PAGE_SIZE = 24

export const SORTS: readonly ProductSort[] = ["relevance", "price-asc", "price-desc", "newest"]

const SORT_TO_PARAM: Record<ProductSort, string | undefined> = {
  relevance: undefined,
  "price-asc": "menor-preco",
  "price-desc": "maior-preco",
  newest: "novidades",
}

export interface ListingFilters {
  sort: ProductSort
  /** Whole reais, as they appear in the address. */
  minPrice?: number
  maxPrice?: number
  inStock: boolean
  search?: string
  page: number
}

type QueryValue = string | null | undefined | (string | null)[]
export type RouteQuery = Record<string, QueryValue>

function first(value: QueryValue): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value
  return raw ?? undefined
}

function wholeNumber(value: QueryValue): number | undefined {
  const raw = first(value)
  if (raw === undefined || !/^\d{1,6}$/.test(raw)) return undefined
  return Number(raw)
}

/** Reads the listing filters from the address. Anything invalid is ignored. */
export function parseFilters(query: RouteQuery): ListingFilters {
  const sortParam = first(query.ordem)
  const sort = SORTS.find((candidate) => SORT_TO_PARAM[candidate] === sortParam) ?? "relevance"

  const minPrice = wholeNumber(query.preco_min)
  let maxPrice = wholeNumber(query.preco_max)
  if (minPrice !== undefined && maxPrice !== undefined && maxPrice < minPrice) maxPrice = undefined

  const search = first(query.q)?.trim()
  const page = wholeNumber(query.pagina)

  return {
    sort,
    minPrice,
    maxPrice,
    inStock: first(query.estoque) === "1",
    search: search ? search : undefined,
    page: page && page > 0 ? page : 1,
  }
}

/** Builds the address query for the given filters. Defaults are left out. */
export function filtersToQuery(filters: Partial<ListingFilters>): Record<string, string> {
  const query: Record<string, string> = {}
  const sort = filters.sort ? SORT_TO_PARAM[filters.sort] : undefined
  if (sort) query.ordem = sort
  if (filters.minPrice !== undefined) query.preco_min = String(filters.minPrice)
  if (filters.maxPrice !== undefined) query.preco_max = String(filters.maxPrice)
  if (filters.inStock) query.estoque = "1"
  if (filters.search) query.q = filters.search
  if (filters.page && filters.page > 1) query.pagina = String(filters.page)
  return query
}

export function hasActiveFilters(filters: ListingFilters): boolean {
  return filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.inStock
}

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / PAGE_SIZE))
}

export function clampPage(page: number, total: number): number {
  return Math.min(Math.max(1, page), pageCount(total))
}

export type PageItem = { type: "page"; page: number; essential: boolean } | { type: "gap" }

/** Page numbers around the current one: 1 … 4 5 6 … 12. Neighbours are not essential on phones. */
export function pageItems(current: number, pages: number): PageItem[] {
  const wanted = new Set([1, pages, current - 1, current, current + 1])
  const numbers = [...wanted].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b)

  const items: PageItem[] = []
  numbers.forEach((n, index) => {
    const previous = numbers[index - 1]
    if (previous !== undefined && n - previous > 1) items.push({ type: "gap" })
    items.push({ type: "page", page: n, essential: n === 1 || n === pages || n === current })
  })
  return items
}

export interface ProductCardData {
  id: string
  name: string
  to: string
  amount: number
  originalAmount?: number
  stock: number
  image?: string
}

/** Maps a Medusa product to what the card shows: cheapest variant, summed stock. */
export function toProductCard(product: StoreProduct): ProductCardData {
  const cheapest = product.variants.reduce((best, variant) =>
    variant.calculated_price.calculated_amount < best.calculated_price.calculated_amount
      ? variant
      : best,
  )
  const { calculated_amount: amount, original_amount: original } = cheapest.calculated_price

  return {
    id: product.id,
    name: product.title,
    to: `/produto/${product.handle}`,
    amount,
    originalAmount: original > amount ? original : undefined,
    stock: product.variants.reduce((sum, variant) => sum + variant.inventory_quantity, 0),
    image: product.thumbnail ?? undefined,
  }
}
