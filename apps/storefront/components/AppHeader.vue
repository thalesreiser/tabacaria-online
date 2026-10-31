<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <header class="bg-surface-dark text-surface-dark-foreground">
    <div class="mx-auto flex min-h-16 max-w-6xl items-center px-4 py-2">
      <NuxtLink
        to="/"
        class="focus-visible:outline-cta inline-flex min-h-11 min-w-11 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <!-- 64 px on phones and 96 px from md up; logo.png is 256 px, sharp up to 128 px at 2x. -->
        <img
          src="/logo.png"
          :alt="t('site.name')"
          width="96"
          height="96"
          class="size-16 md:size-24"
        />
      </NuxtLink>
    </div>
  </header>
</template>
