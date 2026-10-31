// Sample catalog for the interface tasks (ADR 0003 and 0005). Fictional accessories only: no real
// products, prices or tobacco. Never imported directly: useProductRepository loads it only when the
// build has __INCLUDE_MOCKS__ (development or NUXT_INCLUDE_MOCKS=1).
import type {
  ProductListQuery,
  ProductListResult,
  ProductRepository,
  StoreCategory,
  StoreProduct,
} from "~/types/catalog"

const categories: StoreCategory[] = [
  { id: "pcat_mock_isqueiros", handle: "isqueiros", name: "Isqueiros" },
  { id: "pcat_mock_moedores", handle: "moedores", name: "Moedores" },
  { id: "pcat_mock_cinzeiros", handle: "cinzeiros", name: "Cinzeiros" },
  { id: "pcat_mock_caixas", handle: "caixas", name: "Caixas e potes" },
]

const names: Record<string, string[]> = {
  isqueiros: ["azul", "vermelho", "amarelo", "preto", "verde"].flatMap((color) =>
    ["clássico", "recarregável", "de bolso"].map((kind) => `Isqueiro ${color} ${kind}`),
  ),
  moedores: ["de metal", "de acrílico", "de madeira"].flatMap((material) =>
    ["pequeno", "médio", "grande", "magnético", "4 partes"].map(
      (kind) => `Moedor ${material} ${kind}`,
    ),
  ),
  cinzeiros: ["de vidro", "de cerâmica", "de metal"].flatMap((material) =>
    ["redondo", "quadrado", "de mesa", "portátil", "com tampa"].map(
      (kind) => `Cinzeiro ${material} ${kind}`,
    ),
  ),
  caixas: ["Caixa organizadora", "Pote hermético", "Estojo de couro"].flatMap((base) =>
    ["pequeno", "médio", "grande", "preto", "azul"].map((kind) => `${base} ${kind}`),
  ),
}

function slug(text: string): string {
  return normalize(text)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
}

const products: StoreProduct[] = categories.flatMap((category, categoryIndex) =>
  (names[category.handle] ?? []).map((title, indexInCategory) => {
    const index = categoryIndex * 15 + indexInCategory
    const amount = Math.floor((990 + ((index * 937) % 9000)) / 100) * 100 + 90
    const promo = index % 5 === 1
    const stock = index % 7 === 0 ? 0 : index % 5 === 2 ? 2 : 8 + (index % 20)

    return {
      id: `prod_mock_${index}`,
      handle: slug(title),
      title,
      thumbnail: null,
      created_at: new Date(Date.UTC(2026, 0, 1) + index * 86_400_000).toISOString(),
      categories: [category],
      variants: [
        {
          id: `variant_mock_${index}`,
          inventory_quantity: stock,
          calculated_price: {
            calculated_amount: amount,
            original_amount: promo ? Math.round((amount * 1.25) / 10) * 10 : amount,
          },
        },
      ],
    }
  }),
)

const price = (product: StoreProduct) =>
  Math.min(...product.variants.map((variant) => variant.calculated_price.calculated_amount))
const stock = (product: StoreProduct) =>
  product.variants.reduce((sum, variant) => sum + variant.inventory_quantity, 0)

export interface MockOptions {
  /**
   * "erro" makes the list fail, "vazio" returns no products and "lento" answers after 1.5 s
   * (?simular= in the address).
   */
  simulate?: string
}

export function createMockRepository(options: MockOptions = {}): ProductRepository {
  return {
    async list(query: ProductListQuery): Promise<ProductListResult> {
      if (options.simulate === "erro") throw new Error("Simulated catalog error")
      if (options.simulate === "vazio") return { products: [], count: 0 }
      if (options.simulate === "lento") await new Promise((resolve) => setTimeout(resolve, 1500))

      let matches = products.filter((product) => {
        if (query.category && !product.categories.some((c) => c.handle === query.category)) {
          return false
        }
        if (query.search && !normalize(product.title).includes(normalize(query.search)))
          return false
        if (query.minPrice !== undefined && price(product) < query.minPrice) return false
        if (query.maxPrice !== undefined && price(product) > query.maxPrice) return false
        if (query.inStock && stock(product) <= 0) return false
        return true
      })

      if (query.sort === "price-asc") matches = [...matches].sort((a, b) => price(a) - price(b))
      if (query.sort === "price-desc") matches = [...matches].sort((a, b) => price(b) - price(a))
      if (query.sort === "newest") {
        matches = [...matches].sort((a, b) => b.created_at.localeCompare(a.created_at))
      }

      return {
        products: matches.slice(query.offset, query.offset + query.limit),
        count: matches.length,
      }
    },

    categories: () => Promise.resolve(categories),
  }
}
