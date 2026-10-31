<script setup lang="ts">
import { filtersToQuery, hasActiveFilters } from "~/lib/catalog"
import type { ListingFilters } from "~/lib/catalog"

const props = defineProps<{ mode: "category" | "search"; category?: string }>()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const listing = await useProductListing({ category: () => props.category })
const { filters, cards, total, from, to, page, pages, status, error, categories } = listing

const categoryRecord = computed(() => categories.value.find((c) => c.handle === props.category))
if (props.mode === "category" && props.category && !categoryRecord.value) {
  throw createError({ statusCode: 404, statusMessage: "Not Found", fatal: true })
}

const title = computed(() =>
  props.mode === "search"
    ? t("listing.searchTitle", { query: filters.value.search ?? "" })
    : (categoryRecord.value?.name ?? t("listing.allProducts")),
)
useHead({ title })

const loading = computed(() => status.value === "pending" && cards.value.length === 0)
const empty = computed(() => status.value === "success" && total.value === 0)
const activeCategory = computed(() => (props.mode === "search" ? null : props.category))

// Any filter change goes back to page 1. The address keeps the state, so a link reproduces it.
function update(patch: Partial<ListingFilters>) {
  const { simular } = route.query
  const next = { ...filters.value, ...patch, page: 1 }
  void router.push({
    path: route.path,
    query: { ...(simular ? { simular } : {}), ...filtersToQuery(next) },
  })
}

function clear() {
  update({ minPrice: undefined, maxPrice: undefined, inStock: false })
}
</script>

<template>
  <div class="grid gap-6">
    <header class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h1 class="text-3xl">{{ title }}</h1>
      <p v-if="total > 0" role="status" class="text-muted-foreground text-sm">
        {{ total === 1 ? t("listing.showingOne") : t("listing.showing", { from, to, total }) }}
      </p>
    </header>

    <!--
      Two rows on wide screens: the toolbar sits alone in the right column of row 1, so the filter
      column and the cards both start on row 2 and line up at the top.
    -->
    <div class="grid gap-x-6 gap-y-5 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
      <div class="flex items-center justify-between gap-3 lg:col-start-2 lg:row-start-1">
        <FilterDialog class="lg:hidden" :total="total">
          <ListingFilters
            id-prefix="dialog"
            :categories="categories"
            :active-category="activeCategory"
            :filters="filters"
            @change="update"
            @clear="clear"
          />
        </FilterDialog>
        <SortSelect
          class="ml-auto"
          :model-value="filters.sort"
          @update:model-value="update({ sort: $event })"
        />
      </div>

      <aside class="hidden lg:col-start-1 lg:row-start-2 lg:block" :aria-label="t('filters.title')">
        <ListingFilters
          id-prefix="side"
          :categories="categories"
          :active-category="activeCategory"
          :filters="filters"
          @change="update"
          @clear="clear"
        />
      </aside>

      <div class="grid min-w-0 gap-5 lg:col-start-2 lg:row-start-2">
        <ErrorState v-if="error" @retry="listing.retry()" />

        <div
          v-else-if="loading"
          class="grid grid-cols-2 gap-4 sm:grid-cols-3"
          aria-busy="true"
          :aria-label="t('listing.loadingList')"
          role="status"
        >
          <ProductCardSkeleton v-for="n in 6" :key="n" />
        </div>

        <EmptyState
          v-else-if="empty"
          :title="t('listing.empty.title')"
          :description="t('listing.empty.description')"
        >
          <Button v-if="hasActiveFilters(filters)" variant="cta" @click="clear">
            {{ t("listing.empty.clear") }}
          </Button>
        </EmptyState>

        <div
          v-else
          class="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3"
          :aria-busy="status === 'pending'"
        >
          <ProductCard
            v-for="card in cards"
            :key="card.id"
            :name="card.name"
            :to="card.to"
            :amount="card.amount"
            :original-amount="card.originalAmount"
            :stock="card.stock"
            :image="card.image"
            :heading-level="2"
          />
        </div>

        <ListingPagination :page="page" :pages="pages" />
      </div>
    </div>
  </div>
</template>
