<script setup lang="ts">
import { X } from "lucide-vue-next"

defineProps<{ total: number }>()
const { t } = useI18n()
const dialog = useTemplateRef<HTMLDialogElement>("dialog")

// A modal <dialog> traps focus, closes with Esc and restores focus to the button that opened it.
function open() {
  dialog.value?.showModal()
}

function close() {
  dialog.value?.close()
}

function onClick(event: MouseEvent) {
  if (event.target === dialog.value) close()
}
</script>

<template>
  <div>
    <Button variant="outline" @click="open">{{ t("filters.open") }}</Button>
    <dialog
      ref="dialog"
      :aria-label="t('filters.title')"
      class="border-foreground bg-background shadow-hard backdrop:bg-foreground/60 m-auto max-h-[90dvh] w-[min(92vw,26rem)] overflow-auto rounded-xl border-2 p-4"
      @click="onClick"
    >
      <div class="grid gap-4">
        <div class="flex items-center justify-between">
          <h2 class="font-display text-lg">{{ t("filters.title") }}</h2>
          <button
            type="button"
            :aria-label="t('filters.close')"
            class="border-foreground hover:bg-accent focus-visible:outline-ring grid size-11 place-items-center rounded-lg border-2 focus-visible:outline-2 focus-visible:outline-offset-2"
            @click="close"
          >
            <X aria-hidden="true" class="size-5" />
          </button>
        </div>
        <slot />
        <Button variant="cta" @click="close">{{ t("filters.showResults", { total }) }}</Button>
      </div>
    </dialog>
  </div>
</template>
