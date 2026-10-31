<script setup lang="ts">
const { t } = useI18n()
const store = useRuntimeConfig().public.store
const year = new Date().getFullYear()

const details = computed(() =>
  [
    { key: "cnpj", label: t("footer.cnpj"), value: store.cnpj },
    { key: "address", label: t("footer.address"), value: store.address },
    { key: "support", label: t("footer.support"), value: store.support },
  ].filter((item) => item.value),
)
</script>

<template>
  <footer :aria-label="t('footer.label')" class="bg-surface-dark text-surface-dark-foreground">
    <div class="mx-auto max-w-6xl space-y-4 px-4 py-8 text-sm">
      <p v-if="store.legalName" class="font-semibold">{{ store.legalName }}</p>
      <dl v-if="details.length" class="space-y-1">
        <div v-for="item in details" :key="item.key" class="flex flex-wrap gap-x-2">
          <dt class="font-semibold">{{ item.label }}:</dt>
          <dd>{{ item.value }}</dd>
        </div>
      </dl>
      <p v-if="store.minorsNotice" class="font-semibold">{{ store.minorsNotice }}</p>
      <p>{{ t("footer.copyright", { year }) }}</p>
    </div>
  </footer>
</template>
