# 0010 · Migrate the storefront to Nuxt 4

Date: 2026-10-31 · Status: accepted · Decided by: Thales Reiser · Plan reference: DEC-14

## Context

The plan specified Nuxt 3. Nuxt 3 reached end of life on 2026-07-31: the official 3.x roadmap gave it
bug fixes and security patches until the end of July 2026, and `latest` on npm is now Nuxt 4.

Dependabot opened #21 (nuxt 3.21.11 → 4.6.3). Of the five advisories fixed in 4.6.3, two also affect
Nuxt 3 and have no 3.x fix:

- GHSA-648h-gw55-m2g7 (medium): the dev server can expose private runtime config. Development only.
- GHSA-2fxj-c3j7-rr69 (low): server island endpoints skip `redirect` route rules. Feature not used.

In #21 the build and the Playwright suite passed on Nuxt 4, but lint failed: Nuxt 4 splits the
generated TypeScript projects (app, server, shared), so `server/` files fell outside the project the
linter uses. Typecheck and unit tests did not run.

## Options considered

1. **Migrate now as a planned frontend task:** cheapest moment (little storefront code yet); the
   owner of the storefront reviews config, modules and tests.
2. **Merge #21 with ad hoc fixes:** fast, but edits storefront files outside a planned task.
3. **Stay on Nuxt 3:** no security fixes from now on; not acceptable for a public store.

## Decision

Migrate to Nuxt 4 through a dedicated frontend task (FE-01.3), owned by Aloisio. #21 is closed in
favour of that task.

## Consequences

- FE-01.3 updates `nuxt` and the Nuxt modules to versions that support Nuxt 4, adopts the Nuxt 4
  TypeScript project setup (lint, `vue-tsc`), and keeps every CI job green.
- Moving sources into Nuxt 4's `app/` directory is optional and decided inside FE-01.3.
- Docs that say "Nuxt 3" (plan, README, `CLAUDE.md` files) are updated with the migration.
- Until FE-01.3 merges, the GHSA-648h exposure is limited to local development servers.
