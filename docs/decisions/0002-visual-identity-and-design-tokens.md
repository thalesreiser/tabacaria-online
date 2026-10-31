# 0002 · Visual identity and design tokens

Date: 2026-10-31 · Status: accepted · Decided by: Aloisio Miguel · Plan reference: DEC-01

## Context

The storefront needs a visual identity before FE-01.2 (base visual), FE-12.1 (base components) and
FE-11.1 (home) can start. The store is called **Stray Dog Tabacaria** and already has a logo
(`docs/brand/stray-dog-logo.png`, 1254×1254, transparent background) in blue, yellow and red.

The colors below were sampled from the logo file. Raw logo yellow on white has a contrast ratio of
1.5 and raw logo red on white has 4.1, so some values had to be adjusted to reach WCAG AA.

## Options considered

1. **Use the raw logo colors everywhere:** perfect brand match, but yellow cannot be text and red only
   works for large text, so accessibility fails (the plan requires WCAG 2.1 AA).
2. **Logo colors with adjusted shades where contrast requires it:** keeps the brand recognizable and
   passes AA. Slightly darker red and an extra dark blue for header and footer.
3. **A new palette unrelated to the logo:** free choice, but the site would not match the logo,
   packaging or signage.

## Decision

Option 2.

### Brand

- Name: **Stray Dog Tabacaria**.
- Tone: bold and street-style, direct and a little humorous, matching the cartoon logo.

### Palette

| Token (semantic) | Hex       | Source / use                                                |
| ---------------- | --------- | ----------------------------------------------------------- |
| `primary`        | `#0061D0` | logo blue; links, primary buttons, focus ring               |
| `cta`            | `#FDD202` | logo yellow; purchase buttons, always with `cta-foreground` |
| `cta-foreground` | `#111111` | text on `cta`                                               |
| `danger`         | `#D9000D` | logo red, darkened (adjusted); errors and promotions        |
| `surface-dark`   | `#0A1F44` | header and footer background, with white text (new)         |
| `foreground`     | `#111111` | body text                                                   |
| `background`     | `#FFFFFF` | page background                                             |
| `accent-orange`  | `#F8922A` | logo fur; badges and highlights, never text                 |
| `accent-cream`   | `#FCE5C2` | logo muzzle; card and section backgrounds                   |

Contrast ratios of the pairs used for text:

- white on `primary`: 5.8
- `cta-foreground` on `cta`: 12.9
- white on `danger`: 5.3
- white on `surface-dark`: 16.3
- `foreground` on `background`: above 15

### Typography

- Headings: a heavy slab display face (Alfa Slab One or Bowlby One, final choice in FE-01.2).
- Body: Inter.

### Rules for the code

- Tokens are defined in one place (the Tailwind theme and the shadcn-vue CSS variables).
- Components use the semantic names (`bg-primary`, `bg-cta`) and never raw colors such as
  `bg-[#0061D0]` or `bg-blue-600`, so a rebrand only changes the token values.
- Every foreground and background pair must reach WCAG AA (4.5 for body text, 3 for large text).

## Consequences

- FE-01.2 implements these tokens and the base layout with the logo in the header.
- FE-12.1 builds the base components on the semantic tokens and checks contrast with axe.
- A later rebrand means new token values, a new logo file and a contrast check; layout and tone
  changes are not covered by tokens alone.
- The storefront should use the logo as SVG. The PNG (1.8 MB) is kept only as the source file and
  must not be shipped to the browser as is.
