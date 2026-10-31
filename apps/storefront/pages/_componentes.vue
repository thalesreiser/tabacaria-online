<script setup lang="ts">
// Internal gallery of the base components in every state. Only development and preview show it.
const config = useRuntimeConfig()
if (!["development", "preview"].includes(config.public.appEnv)) {
  throw createError({ statusCode: 404, statusMessage: "Not Found", fatal: true })
}

useHead({ title: "Componentes" })
useSeoMeta({ robots: "noindex, nofollow" })

const normal = ref(2)
const atMin = ref(1)
const atMax = ref(5)
const added = ref(0)
const retried = ref(0)
</script>

<template>
  <div class="grid gap-12">
    <header class="grid gap-2">
      <h1 class="text-3xl">Componentes base</h1>
      <p class="text-muted-foreground">
        Página interna, visível só em desenvolvimento e em preview. Produtos e preços são de
        exemplo.
      </p>
    </header>

    <section data-component="price" class="grid gap-3">
      <h2 class="text-xl">Preço</h2>
      <div class="flex flex-wrap items-center gap-6">
        <Price :amount="1290" />
        <Price :amount="4990" :original-amount="5990" />
        <Price :amount="0" />
      </div>
    </section>

    <section data-component="stock-badge" class="grid gap-3">
      <h2 class="text-xl">Selo de estoque</h2>
      <div class="flex flex-wrap items-center gap-3">
        <StockBadge :quantity="12" />
        <StockBadge :quantity="3" />
        <StockBadge :quantity="1" />
        <StockBadge :quantity="0" />
      </div>
    </section>

    <section data-component="quantity-stepper" class="grid gap-3">
      <h2 class="text-xl">Seletor de quantidade</h2>
      <div class="flex flex-wrap items-center gap-6">
        <QuantityStepper v-model="normal" :max="9" />
        <QuantityStepper v-model="atMin" />
        <QuantityStepper v-model="atMax" :max="5" />
      </div>
      <p class="text-muted-foreground text-sm">Normal, no mínimo e no máximo.</p>
    </section>

    <section data-component="button" class="grid gap-3">
      <h2 class="text-xl">Botão</h2>
      <div class="flex flex-wrap items-center gap-4">
        <Button>Padrão</Button>
        <Button variant="cta">Comprar</Button>
        <Button variant="outline">Contorno</Button>
        <Button variant="secondary">Secundário</Button>
        <Button variant="destructive">Remover</Button>
        <Button variant="cta" disabled>Desabilitado</Button>
        <Button variant="cta" class="outline-ring outline-2 outline-offset-2">Com foco</Button>
      </div>
      <p class="text-muted-foreground text-sm">
        Passe o mouse para ver o botão afundar. Use a tecla Tab para ver o foco.
      </p>
    </section>

    <section data-component="product-card" class="grid gap-3">
      <h2 class="text-xl">Cartão de produto</h2>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] gap-6">
        <ProductCard
          name="Isqueiro azul clássico"
          to="/_componentes#isqueiro"
          :amount="1290"
          :stock="12"
          @add="added++"
        />
        <ProductCard
          name="Moedor de metal 4 partes"
          to="/_componentes#moedor"
          :amount="4990"
          :original-amount="5990"
          :stock="3"
          @add="added++"
        />
        <ProductCard
          name="Cinzeiro vermelho de mesa"
          to="/_componentes#cinzeiro"
          :amount="3490"
          :stock="0"
        />
      </div>
      <p class="text-muted-foreground text-sm">
        Normal, promoção com estoque baixo e esgotado. Adicionados nesta página: {{ added }}.
      </p>
    </section>

    <section data-component="product-card-skeleton" class="grid gap-3">
      <h2 class="text-xl">Cartão carregando</h2>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] gap-6">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    </section>

    <section data-component="empty-state" class="grid gap-3">
      <h2 class="text-xl">Lista vazia</h2>
      <EmptyState
        :heading-level="3"
        title="Nada por aqui ainda"
        description="Nenhum produto nesta categoria."
      >
        <Button variant="cta">Ver tudo</Button>
      </EmptyState>
    </section>

    <section data-component="error-state" class="grid gap-3">
      <h2 class="text-xl">Erro</h2>
      <ErrorState :heading-level="3" @retry="retried++" />
      <p class="text-muted-foreground text-sm">Tentativas nesta página: {{ retried }}.</p>
    </section>
  </div>
</template>
