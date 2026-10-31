<script setup lang="ts">
import type { NuxtError } from "#app"

const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()

const kind = computed(() => (props.error.statusCode === 404 ? "notFound" : "server"))
const title = computed(() => t(`error.${kind.value}.title`))

useHead({ title })

function goHome() {
  void clearError({ redirect: "/" })
}
</script>

<template>
  <NuxtLayout>
    <section class="mx-auto flex max-w-xl flex-col items-center gap-6 py-16 text-center">
      <p class="font-display text-primary text-6xl">{{ error.statusCode }}</p>
      <h1 class="text-3xl">{{ title }}</h1>
      <p class="text-muted-foreground">{{ t(`error.${kind}.description`) }}</p>
      <Button size="lg" variant="cta" @click="goHome">{{ t("error.backHome") }}</Button>
    </section>
  </NuxtLayout>
</template>
