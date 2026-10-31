<script setup lang="ts">
import { Package } from "lucide-vue-next"

const props = defineProps<{
  name: string
  to: string
  /** Amount in cents. */
  amount: number
  originalAmount?: number
  stock: number
  lowStockThreshold?: number
  image?: string
}>()
const emit = defineEmits<{ add: [] }>()
const { t } = useI18n()

const discount = computed(() =>
  props.originalAmount !== undefined && props.originalAmount > props.amount
    ? Math.round((1 - props.amount / props.originalAmount) * 100)
    : 0,
)
const soldOut = computed(() => props.stock <= 0)
</script>

<template>
  <article
    class="bg-card border-foreground shadow-hard relative grid grid-rows-[auto_1fr] overflow-hidden rounded-xl border-2"
  >
    <span
      v-if="discount"
      class="border-foreground bg-danger text-danger-foreground absolute top-2.5 left-2.5 z-10 -rotate-3 rounded-lg border-2 px-2 py-0.5 text-xs font-bold"
    >
      <span aria-hidden="true">-{{ discount }}%</span>
      <span class="sr-only">{{ t("components.productCard.discount", { percent: discount }) }}</span>
    </span>
    <div class="bg-accent-cream border-foreground grid aspect-square place-items-center border-b-2">
      <img v-if="image" :src="image" alt="" loading="lazy" class="size-3/4 object-contain" />
      <Package v-else aria-hidden="true" class="size-1/3" />
    </div>
    <div class="grid content-start gap-2 p-3">
      <StockBadge :quantity="stock" :low-threshold="lowStockThreshold" />
      <h3 class="text-base leading-tight">
        <NuxtLink
          :to="to"
          class="focus-visible:outline-ring after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {{ name }}
        </NuxtLink>
      </h3>
      <Price :amount="amount" :original-amount="originalAmount" />
      <Button variant="cta" class="relative z-10" :disabled="soldOut" @click="emit('add')">
        {{ soldOut ? t("components.productCard.unavailable") : t("components.productCard.add") }}
      </Button>
    </div>
  </article>
</template>
