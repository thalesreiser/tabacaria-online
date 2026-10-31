<script setup lang="ts">
import { SORTS } from "~/lib/catalog"
import type { ProductSort } from "~/types/catalog"

const model = defineModel<ProductSort>({ required: true })
const { t } = useI18n()
const id = useId()
</script>

<template>
  <div class="flex items-center gap-2">
    <label :for="id" class="sr-only text-sm font-semibold sm:not-sr-only">
      {{ t("sort.label") }}
    </label>
    <select
      :id="id"
      v-model="model"
      class="border-foreground bg-background focus-visible:outline-ring h-11 rounded-lg border-2 px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <option v-for="sort in SORTS" :key="sort" :value="sort">{{ t(`sort.${sort}`) }}</option>
    </select>
  </div>
</template>
