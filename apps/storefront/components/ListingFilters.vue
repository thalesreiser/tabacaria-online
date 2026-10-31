<script setup lang="ts">
import { hasActiveFilters } from "~/lib/catalog"
import type { ListingFilters } from "~/lib/catalog"
import type { StoreCategory } from "~/types/catalog"

const props = defineProps<{
  categories: StoreCategory[]
  /** Handle of the open category; undefined means "all" and null means no category (search). */
  activeCategory?: string | null
  filters: ListingFilters
  /** Keeps the ids unique when the same filters are rendered twice (column and dialog). */
  idPrefix: string
}>()
const emit = defineEmits<{ change: [patch: Partial<ListingFilters>]; clear: [] }>()
const { t } = useI18n()

const minPrice = ref(props.filters.minPrice?.toString() ?? "")
const maxPrice = ref(props.filters.maxPrice?.toString() ?? "")
watch(
  () => [props.filters.minPrice, props.filters.maxPrice],
  ([min, max]) => {
    minPrice.value = min?.toString() ?? ""
    maxPrice.value = max?.toString() ?? ""
  },
)

const id = (name: string) => `${props.idPrefix}-${name}`
const toWhole = (value: string) => (/^\d{1,6}$/.test(value.trim()) ? Number(value) : undefined)

function applyPrice() {
  emit("change", { minPrice: toWhole(minPrice.value), maxPrice: toWhole(maxPrice.value) })
}

function onStockChange(event: Event) {
  emit("change", { inStock: (event.target as HTMLInputElement).checked })
}

const categoryLink =
  "hover:bg-accent focus-visible:outline-ring flex min-h-11 items-center rounded-lg px-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
const input =
  "border-foreground bg-background placeholder:text-muted-foreground h-11 w-full min-w-0 rounded-lg border-2 px-3 text-sm"
</script>

<template>
  <div class="border-foreground bg-card grid content-start gap-5 rounded-xl border-2 p-4">
    <nav :aria-label="t('filters.categories')">
      <h2 class="font-display mb-2 text-base">{{ t("filters.categories") }}</h2>
      <ul class="grid gap-1">
        <li>
          <NuxtLink
            to="/categoria/todos"
            :class="[categoryLink, activeCategory === undefined && 'text-primary font-bold']"
            :aria-current="activeCategory === undefined ? 'page' : undefined"
          >
            {{ t("filters.allCategories") }}
          </NuxtLink>
        </li>
        <li v-for="category in categories" :key="category.id">
          <NuxtLink
            :to="`/categoria/${category.handle}`"
            :class="[categoryLink, activeCategory === category.handle && 'text-primary font-bold']"
            :aria-current="activeCategory === category.handle ? 'page' : undefined"
          >
            {{ category.name }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <form class="grid gap-2" @submit.prevent="applyPrice">
      <h2 class="font-display text-base">{{ t("filters.price") }}</h2>
      <div class="flex gap-2">
        <label :for="id('min')" class="sr-only">{{ t("filters.priceMin") }}</label>
        <input
          :id="id('min')"
          v-model="minPrice"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          :placeholder="t('filters.priceFrom')"
          :class="input"
        />
        <label :for="id('max')" class="sr-only">{{ t("filters.priceMax") }}</label>
        <input
          :id="id('max')"
          v-model="maxPrice"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          :placeholder="t('filters.priceTo')"
          :class="input"
        />
      </div>
      <Button type="submit" variant="outline">{{ t("filters.apply") }}</Button>
    </form>

    <div>
      <h2 class="font-display mb-1 text-base">{{ t("filters.availability") }}</h2>
      <label
        :for="id('stock')"
        class="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium"
      >
        <input
          :id="id('stock')"
          type="checkbox"
          class="accent-primary size-5"
          :checked="filters.inStock"
          @change="onStockChange"
        />
        {{ t("filters.inStock") }}
      </label>
    </div>

    <Button
      v-if="hasActiveFilters(filters)"
      variant="link"
      class="justify-start px-0"
      @click="emit('clear')"
    >
      {{ t("filters.clear") }}
    </Button>
  </div>
</template>
