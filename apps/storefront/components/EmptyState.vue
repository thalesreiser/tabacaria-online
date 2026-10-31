<script setup lang="ts">
import { PackageOpen } from "lucide-vue-next"

const props = withDefaults(
  defineProps<{ title: string; description?: string; headingLevel?: 2 | 3 | 4 }>(),
  { headingLevel: 2 },
)
const heading = computed(() => `h${props.headingLevel}`)
</script>

<template>
  <section
    class="border-foreground grid justify-items-start gap-2 rounded-xl border-2 border-dashed p-4"
  >
    <PackageOpen aria-hidden="true" class="size-10" />
    <component :is="heading" class="font-display text-lg">{{ title }}</component>
    <p v-if="description" class="text-muted-foreground text-sm">{{ description }}</p>
    <slot />
  </section>
</template>
