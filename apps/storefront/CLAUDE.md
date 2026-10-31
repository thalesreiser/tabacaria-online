# Storefront (Nuxt 3)

Read the root `CLAUDE.md` first. This app is a placeholder until FE-01.1 scaffolds Nuxt 3 here. The
plan's "Arquitetura do frontend" and "Padrões do frontend" sections are the full reference.

## Rules

- Components never call the API directly; pages use typed composables (`useProducts`, `useCart`,
  `useCheckout`...), which are the only code that knows the Medusa SDK.
- Login, checkout and payment go through Nuxt server routes (`server/api/*`), which keep the customer
  token in an `httpOnly` cookie. The browser never sees the token.
- The cart lives in Medusa; the Pinia store only mirrors the last API response. Nothing personal or
  secret goes to `localStorage`.
- Every data component has loading, empty, error and content states.
- Prices always go through the `Price` component (BRL, values in cents from Medusa).
- Forms: VeeValidate + Zod with the shared schemas; masked inputs send unmasked values.
- Accessibility: WCAG 2.1 AA, keyboard navigation, visible focus, 44 x 44 px touch targets.
- Performance budget (mobile): LCP < 2.5 s, CLS < 0.1, initial JS < 170 KB gzip; images through
  `<NuxtImg>` or `<NuxtPicture>` with `sizes`.
- Analytics and pixels load only after cookie consent; no personal data in events.
- `v-html` is forbidden, except for Nuxt-rendered institutional content.
- Interface text in Brazilian Portuguese, kept in `locales/pt-BR.json`.
- Design, UI and UX choices are never decided here: propose options and wait (root `CLAUDE.md`).
