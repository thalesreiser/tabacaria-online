# Tabacaria Online

Online store for a tobacco accessories shop in Brazil.

## Stack

- **Backend:** Medusa v2 (TypeScript), PostgreSQL, Redis
- **Frontend:** Nuxt 3 (Vue 3, TypeScript), Tailwind CSS, shadcn-vue, Pinia
- **Integrations:** Mercado Pago (Pix, card, boleto), Melhor Envio, Focus NFe, Resend
- **Infrastructure:** Railway, Vercel or Cloudflare Pages, Cloudflare R2, GitHub Actions

## Requirements

- Node.js 24 LTS (see `.nvmrc` and [ADR 0001](docs/decisions/0001-node-24-runtime.md))
- pnpm 10, enabled through Corepack: `corepack enable pnpm`

`pnpm install` refuses to run on any other Node.js or pnpm major version.

## Getting started

```sh
pnpm install
pnpm build       # builds every package through Turborepo
pnpm typecheck   # type-checks every package
pnpm lint        # ESLint in every package
pnpm format      # Prettier (pnpm format:check only reports)
```

`pnpm install` also installs the Git hooks (Husky):

- **pre-commit:** ESLint and Prettier on staged files (lint-staged)
- **commit-msg:** Conventional Commits check (commitlint), header up to 100 characters

Shared lint rules live in `packages/eslint-config`; each package has an `eslint.config.js` that
extends it. `any`, `==` and `console.log` are rejected.

## Repository layout

```
apps/backend            Medusa v2 (placeholder until BE-01.1)
apps/storefront         Nuxt 3 storefront
packages/shared-types   types shared by backend and storefront
packages/eslint-config  shared ESLint flat config
docs/decisions/         architecture decision records (ADRs)
```

Shared dependency versions (such as TypeScript) live in the `catalog` of `pnpm-workspace.yaml`;
packages reference them with `"catalog:"`.

## Branches

- `main`: production (releases are `v*` tags)
- `develop`: staging, the base for every feature branch
- `feat/<task-id>-<slug>`, `fix/<task-id>-<slug>`

Commits follow Conventional Commits and reference the task ID (e.g. `feat(checkout): add pix polling (FE-06.2)`).

## Changes and releases

- PRs that change behaviour add a changeset: `pnpm changeset` (see `.changeset/README.md`).
- Releases apply them with `pnpm version-packages`, which bumps versions and writes the changelogs.
- Dependabot opens weekly update PRs against `develop`; security fixes are opened as soon as an
  advisory is published.
- Bugs are reported with the issue form; planned work lives on the project board.

## Documentation

The development plan (epics, tasks, DoR/DoD, testing, CI/CD, roadmap and decision log) is the source of truth for the project and is kept outside the repository.
