// Subset of the Medusa v2 Store API shapes used by the catalog screens. Amounts are in cents.
// When the typed SDK arrives (BE-10.2) these are replaced by its types.

export interface StoreCategory {
  id: string
  handle: string
  name: string
}

export interface StoreVariant {
  id: string
  inventory_quantity: number
  calculated_price: { calculated_amount: number; original_amount: number }
}

export interface StoreProduct {
  id: string
  handle: string
  title: string
  thumbnail: string | null
  created_at: string
  categories: StoreCategory[]
  variants: StoreVariant[]
}

export type ProductSort = "relevance" | "price-asc" | "price-desc" | "newest"

export interface ProductListQuery {
  /** Category handle; undefined lists every category. */
  category?: string
  search?: string
  /** Prices in cents. */
  minPrice?: number
  maxPrice?: number
  inStock: boolean
  sort: ProductSort
  limit: number
  offset: number
}

export interface ProductListResult {
  products: StoreProduct[]
  count: number
}

/** The only code that knows where catalog data comes from (mock now, Medusa in FE-04.1b). */
export interface ProductRepository {
  list(query: ProductListQuery): Promise<ProductListResult>
  categories(): Promise<StoreCategory[]>
}
