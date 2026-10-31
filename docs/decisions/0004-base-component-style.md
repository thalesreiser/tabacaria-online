# 0004 · Base component style

Date: 2026-10-31 · Status: accepted · Decided by: Aloisio Miguel · Plan reference: DEC-01, FE-12.1

## Context

FE-12.1 builds the base components (price, stock badge, quantity stepper, product card, loading,
empty and error states). ADR 0002 set the palette and typography but not how components are drawn,
and its palette has no colors for status labels such as stock.

Three directions were compared on a mock-up page with the same components in each:

## Options considered

1. **A, Rua:** 2 px outlines and hard offset shadows, like the outline of the logo. Strongest brand
   match and clear clickable areas, but heavy on dense screens such as cart and checkout.
2. **B, Limpa:** soft surfaces, light shadows and quiet type. Easiest to read and maintain, but
   generic, close to any online store.
3. **C, Etiqueta:** stickers, stamps and dashed borders like packaging labels. Most memorable, but
   rotated prices and stamps need more accessibility and small-screen work.

## Decision

Option A (Rua).

- Cards, buttons, the quantity stepper and the price tag use a 2 px `foreground` outline.
  Cards and buttons add a hard offset shadow (`shadow-hard`, `shadow-hard-sm`); buttons sink on hover.
- Status colors are new semantic tokens, all with text contrast of at least 4.5:1:
  - `success` on `success-soft` for "Em estoque"
  - `warning` on `warning-soft` for "Últimas N unidades"
  - `muted-foreground` on `inactive-soft` for "Esgotado"
- The price tag keeps the `cta` yellow with `cta-foreground` text, and discount badges use `danger`.
- Dense screens (cart, checkout) may use a calmer variant of the same tokens, decided when those
  screens are designed. Nothing of that is implemented now.
- The `ghost` and `link` button variants stay flat, without outline or shadow.

## Consequences

- `assets/css/tokens.css` gains the state colors and the two shadows; components only use the tokens.
- Contrast is checked on every component in a real browser with axe, on the internal gallery
  `/_componentes`, which is visible only when `NUXT_PUBLIC_APP_ENV` is `development` or `preview`.
- ADR 0002 stays valid. This ADR adds to it and does not replace it.
