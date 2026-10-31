<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <article
    :aria-label="t('components.loading')"
    aria-busy="true"
    class="border-border grid grid-rows-[auto_1fr] overflow-hidden rounded-xl border-2"
  >
    <Skeleton class="aspect-square rounded-none" />
    <div class="grid content-start gap-2 p-3">
      <Skeleton class="h-6 w-28 rounded-full" />
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-7 w-20" />
      <Skeleton class="h-11 w-full rounded-lg" />
    </div>
  </article>
</template>
