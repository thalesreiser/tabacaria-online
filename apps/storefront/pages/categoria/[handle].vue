<script setup lang="ts">
// "todos" lists every category; any other handle must be a known category.
const route = useRoute()
const category = computed(() => {
  const handle = String(route.params.handle)
  return handle === "todos" ? undefined : handle
})
</script>

<template>
  <ProductListing mode="category" :category="category" />
</template>
