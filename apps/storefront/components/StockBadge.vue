<script setup lang="ts">
const props = withDefaults(defineProps<{ quantity: number; lowThreshold?: number }>(), {
  lowThreshold: 3,
})
const { t } = useI18n()

type StockKind = "in" | "low" | "out"

const kind = computed<StockKind>(() => {
  if (props.quantity <= 0) return "out"
  return props.quantity <= props.lowThreshold ? "low" : "in"
})

const label = computed(() =>
  kind.value === "low"
    ? t("components.stock.low", { count: props.quantity }, props.quantity)
    : t(`components.stock.${kind.value}`),
)

const styles: Record<StockKind, string> = {
  in: "bg-success-soft text-success",
  low: "bg-warning-soft text-warning",
  out: "bg-inactive-soft text-muted-foreground",
}
</script>

<template>
  <span
    :data-stock="kind"
    class="inline-flex w-fit items-center rounded-full border-2 border-current px-2.5 py-0.5 text-xs font-semibold"
    :class="styles[kind]"
  >
    {{ label }}
  </span>
</template>
