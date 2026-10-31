import type { ProductRepository } from "~/types/catalog"

/**
 * Picks where catalog data comes from (NUXT_PUBLIC_DATA_SOURCE). Components never call the API
 * directly; they go through composables such as useProductListing.
 *
 * It is synchronous on purpose: Nuxt composables lose their context after an await, so everything
 * that needs the Nuxt instance is read here and the repository itself loads lazily.
 */
export function useProductRepository(): ProductRepository {
  const { dataSource } = useRuntimeConfig().public
  const simulate = useRoute().query.simular
  const simulation = (Array.isArray(simulate) ? simulate[0] : simulate) ?? undefined

  let loaded: Promise<ProductRepository> | undefined

  async function load(): Promise<ProductRepository> {
    // The condition on __INCLUDE_MOCKS__ lets the bundler drop the mocks from production builds.
    if (dataSource === "mock" && __INCLUDE_MOCKS__) {
      const { createMockRepository } = await import("~/mocks/catalog")
      return createMockRepository({ simulate: simulation })
    }

    throw new Error(
      dataSource === "mock"
        ? "NUXT_PUBLIC_DATA_SOURCE is mock, but this build does not include the mocks (NUXT_INCLUDE_MOCKS=1)"
        : "The api data source arrives with FE-04.1b",
    )
  }

  const repository = () => (loaded ??= load())

  return {
    list: async (query) => (await repository()).list(query),
    categories: async () => (await repository()).categories(),
  }
}
