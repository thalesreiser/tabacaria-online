<script setup lang="ts">
import type { Money } from "@tabacaria/shared-types"

const emptyTotal: Money = { amount: 0, currencyCode: "brl" }
</script>

<template>
  <main>
    <h1>Tabacaria Online</h1>
    <p>{{ emptyTotal.amount }} {{ emptyTotal.currencyCode }}</p>
  </main>
</template>
