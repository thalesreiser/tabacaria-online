const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

/** Formats an amount in cents (as Medusa returns it) as Brazilian reais, e.g. 1290 -> "R$ 12,90". */
export function formatPrice(cents: number): string {
  return brl.format(cents / 100)
}
