<script setup lang="ts">
import { TriangleAlert } from "lucide-vue-next"

const props = withDefaults(
  defineProps<{ title?: string; description?: string; headingLevel?: 2 | 3 | 4 }>(),
  { headingLevel: 2 },
)
const emit = defineEmits<{ retry: [] }>()
const { t } = useI18n()
const heading = computed(() => `h${props.headingLevel}`)
</script>

<template>
  <div role="alert" class="border-danger grid justify-items-start gap-2 rounded-xl border-2 p-4">
    <TriangleAlert aria-hidden="true" class="text-danger size-10" />
    <component :is="heading" class="font-display text-lg">
      {{ title ?? t("components.error.title") }}
    </component>
    <p class="text-muted-foreground text-sm">
      {{ description ?? t("components.error.description") }}
    </p>
    <Button variant="cta" @click="emit('retry')">{{ t("components.error.retry") }}</Button>
  </div>
</template>
