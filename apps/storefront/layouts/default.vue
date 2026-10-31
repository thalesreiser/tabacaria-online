<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#conteudo"
      class="bg-cta text-cta-foreground focus-visible:outline-surface-dark-foreground sr-only rounded-md px-4 py-3 font-semibold focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
    >
      {{ t("site.skipToContent") }}
    </a>
    <AppHeader />
    <main id="conteudo" class="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
