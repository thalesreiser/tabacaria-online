# Dependency audit exceptions

`pnpm audit --audit-level high` runs on every PR, on every push to `develop` and `main`, and every
Monday. An advisory may be accepted here only when no compatible fix exists and the vulnerable code
cannot be reached with untrusted input. Each exception has an owner decision and a review date.

| Advisory                                                                 | Package                            | Why it is accepted | Review by  |
| ------------------------------------------------------------------------ | ---------------------------------- | ------------------ | ---------- |
| [GHSA-7mx3-vvmw-hjmv](https://github.com/advisories/GHSA-7mx3-vvmw-hjmv) | `@graphql-tools/utils` 10.x (high) | See below          | 2027-01-31 |
| [GHSA-c4qx-w738-7hr3](https://github.com/advisories/GHSA-c4qx-w738-7hr3) | `@graphql-tools/utils` 10.x (high) | See below          | 2027-01-31 |

## `@graphql-tools/utils` prototype pollution (both advisories)

- **IDs:** pnpm audit reports GHSA-7mx3-vvmw-hjmv and GHSA-c4qx-w738-7hr3; Trivy (image scan) reports
  the same issues as CVE-2026-104852 and CVE-2026-114604. Both pairs are listed in `.trivyignore`.
- **Path:** `@medusajs/cli` > `@medusajs/utils` > `@graphql-codegen/core` 4.0.2 >
  `@graphql-tools/utils` 10.11.0.
- **Fix:** only in `@graphql-tools/utils` 12.x. `@graphql-codegen/core` 4.0.2 requires `^10.0.0`, so
  forcing 12.x is a major jump inside Medusa's tooling and may break type generation.
- **Reachability:** Medusa uses GraphQL Codegen to generate TypeScript types from its own schema
  during `medusa build` and `medusa develop`. It never processes requests from customers, so the
  polluting functions (`mergeDeep`, `mergeIncrementalResult`) do not see untrusted input.
- **Exit:** remove both exceptions as soon as a Medusa release depends on a patched version, or on
  the review date, whichever comes first. Dependabot opens the update PR.

## Fixed instead of accepted

- `zod` < 4.6.6 (GHSA-mrhx-c7xc-m3w5): the backend's direct dependency was bumped to 4.6.7.
- `lodash` <= 4.17.23 (GHSA-r5fr-rjxr-66jc): overridden to ^4.18.1 in `pnpm-workspace.yaml`; the
  fix stays inside lodash 4.x.

Moderate and low advisories are not blocking; Dependabot security updates handle them.
