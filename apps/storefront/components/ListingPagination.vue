<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next"
import { pageItems } from "~/lib/catalog"

const props = defineProps<{ page: number; pages: number }>()
const { t } = useI18n()
const route = useRoute()

const items = computed(() => pageItems(props.page, props.pages))

// Every number is a real link (?pagina=N), so crawlers and visitors without JavaScript can follow it.
function to(page: number) {
  const { pagina: _current, ...rest } = route.query
  return { path: route.path, query: page > 1 ? { ...rest, pagina: String(page) } : rest }
}

const box =
  "border-foreground bg-background hover:bg-accent focus-visible:outline-ring grid h-11 min-w-11 place-items-center rounded-lg border-2 px-2 font-bold focus-visible:outline-2 focus-visible:outline-offset-2"
</script>

<template>
  <nav v-if="pages > 1" :aria-label="t('pagination.label')">
    <ul class="flex items-center justify-center gap-1.5">
      <li>
        <NuxtLink
          v-if="page > 1"
          :to="to(page - 1)"
          :class="box"
          :aria-label="t('pagination.previous')"
        >
          <ChevronLeft aria-hidden="true" class="size-5" />
        </NuxtLink>
        <span v-else :class="[box, 'opacity-50']" aria-disabled="true">
          <ChevronLeft aria-hidden="true" class="size-5" />
        </span>
      </li>

      <template v-for="(item, index) in items" :key="index">
        <li v-if="item.type === 'gap'" aria-hidden="true" class="text-muted-foreground px-1">…</li>
        <li v-else-if="item.page === page">
          <span :class="[box, 'bg-primary text-primary-foreground']" aria-current="page">
            {{ item.page }}
          </span>
        </li>
        <li v-else :class="!item.essential && 'hidden sm:block'">
          <NuxtLink
            :to="to(item.page)"
            :class="box"
            :aria-label="t('pagination.page', { page: item.page })"
          >
            {{ item.page }}
          </NuxtLink>
        </li>
      </template>

      <li>
        <NuxtLink
          v-if="page < pages"
          :to="to(page + 1)"
          :class="box"
          :aria-label="t('pagination.next')"
        >
          <ChevronRight aria-hidden="true" class="size-5" />
        </NuxtLink>
        <span v-else :class="[box, 'opacity-50']" aria-disabled="true">
          <ChevronRight aria-hidden="true" class="size-5" />
        </span>
      </li>
    </ul>
  </nav>
</template>
