import { PAGE_SIZE, clampPage, pageCount, parseFilters, toProductCard } from "~/lib/catalog"
import type { ProductListQuery } from "~/types/catalog"

/** Everything a listing page needs. The address holds the filters, so a link reproduces the page. */
export async function useProductListing(options: { category?: () => string | undefined }) {
  // Every Nuxt composable is called before the first await: the context is lost after it.
  const route = useRoute()
  const repository = useProductRepository()
  const filters = computed(() => parseFilters(route.query))

  const listing = useAsyncData(
    () => `products:${route.fullPath}`,
    async () => {
      const current = filters.value
      const query: Omit<ProductListQuery, "offset"> = {
        category: options.category?.(),
        search: current.search,
        minPrice: current.minPrice === undefined ? undefined : current.minPrice * 100,
        maxPrice: current.maxPrice === undefined ? undefined : current.maxPrice * 100,
        inStock: current.inStock,
        sort: current.sort,
        limit: PAGE_SIZE,
      }

      let page = current.page
      let result = await repository.list({ ...query, offset: (page - 1) * PAGE_SIZE })

      // A page past the end shows the last page instead of an empty list.
      const lastPage = pageCount(result.count)
      if (page > lastPage && result.count > 0) {
        page = lastPage
        result = await repository.list({ ...query, offset: (page - 1) * PAGE_SIZE })
      }
      return { ...result, page }
    },
    { lazy: true },
  )
  const categoryList = useAsyncData("catalog-categories", () => repository.categories())

  const [{ data, status, error, refresh }, { data: categories }] = await Promise.all([
    listing,
    categoryList,
  ])

  const cards = computed(() => data.value?.products.map(toProductCard) ?? [])
  const total = computed(() => data.value?.count ?? 0)
  const page = computed(() => data.value?.page ?? clampPage(filters.value.page, 0))
  const from = computed(() => (total.value === 0 ? 0 : (page.value - 1) * PAGE_SIZE + 1))
  const to = computed(() => (from.value === 0 ? 0 : from.value + cards.value.length - 1))

  return {
    filters,
    cards,
    total,
    page,
    pages: computed(() => pageCount(total.value)),
    from,
    to,
    status,
    error,
    retry: refresh,
    categories: computed(() => categories.value ?? []),
  }
}
