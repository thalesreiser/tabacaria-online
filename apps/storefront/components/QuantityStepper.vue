<script setup lang="ts">
import { Minus, Plus } from "lucide-vue-next"

const model = defineModel<number>({ required: true })
const props = withDefaults(defineProps<{ min?: number; max?: number }>(), { min: 1 })
const { t } = useI18n()

const atMin = computed(() => model.value <= props.min)
const atMax = computed(() => props.max !== undefined && model.value >= props.max)

function change(delta: number) {
  const next = model.value + delta
  if (next < props.min) return
  if (props.max !== undefined && next > props.max) return
  model.value = next
}

// The focus ring sits inside the control because the rounded frame clips anything outside it.
const stepButton =
  "hover:bg-accent focus-visible:outline-ring grid size-11 place-items-center focus-visible:-outline-offset-4 focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-50"
</script>

<template>
  <div
    role="group"
    :aria-label="t('components.stepper.group')"
    class="border-foreground bg-background inline-flex items-center overflow-hidden rounded-lg border-2"
  >
    <button
      type="button"
      :class="stepButton"
      :aria-label="t('components.stepper.decrease')"
      :disabled="atMin"
      @click="change(-1)"
    >
      <Minus aria-hidden="true" class="size-4" />
    </button>
    <output
      aria-live="polite"
      class="border-foreground grid h-11 min-w-11 place-items-center border-x-2 px-2 font-bold tabular-nums"
    >
      {{ model }}
    </output>
    <button
      type="button"
      :class="stepButton"
      :aria-label="t('components.stepper.increase')"
      :disabled="atMax"
      @click="change(1)"
    >
      <Plus aria-hidden="true" class="size-4" />
    </button>
  </div>
</template>
