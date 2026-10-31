<script setup lang="ts">
import { formatPrice } from "~/lib/price"

// Values are in cents, as Medusa returns them. Every price on the site goes through this component.
const props = defineProps<{ amount: number; originalAmount?: number }>()
const { t } = useI18n()

const hasDiscount = computed(
  () => props.originalAmount !== undefined && props.originalAmount > props.amount,
)
</script>

<template>
  <span class="inline-flex flex-wrap items-baseline gap-x-2 tabular-nums">
    <template v-if="hasDiscount && originalAmount !== undefined">
      <s class="text-muted-foreground text-sm">
        <span class="sr-only">{{ `${t("components.price.from")} ` }}</span
        >{{ formatPrice(originalAmount) }}
      </s>
      <span class="sr-only">{{ `${t("components.price.to")} ` }}</span>
    </template>
    <span
      class="bg-cta text-cta-foreground border-foreground font-display rounded-lg border-2 px-2 text-xl"
    >
      {{ formatPrice(amount) }}
    </span>
  </span>
</template>
