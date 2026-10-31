# Tabacaria Online

Online store for a tobacco accessories shop in Brazil.

## Stack

- **Backend:** Medusa v2 (Node.js 20, TypeScript), PostgreSQL, Redis
- **Frontend:** Nuxt 3 (Vue 3, TypeScript), Tailwind CSS, shadcn-vue, Pinia
- **Integrations:** Mercado Pago (Pix, card, boleto), Melhor Envio, Focus NFe, Resend
- **Infrastructure:** Railway, Vercel or Cloudflare Pages, Cloudflare R2, GitHub Actions

## Repository layout (planned)

```
apps/backend      Medusa v2
apps/storefront   Nuxt 3
packages/         shared types and configs
infra/            docker-compose, Dockerfile, scripts
docs/decisions/   architecture decision records (ADRs)
```

## Branches

- `main`: production (releases are `v*` tags)
- `develop`: staging, the base for every feature branch
- `feat/<task-id>-<slug>`, `fix/<task-id>-<slug>`

Commits follow Conventional Commits and reference the task ID (e.g. `feat(checkout): add pix polling (FE-06.2)`).

## Documentation

The development plan (epics, tasks, DoR/DoD, testing, CI/CD, roadmap and decision log) is the source of truth for the project and is kept outside the repository. Setup instructions will be added by task EST-02.2.
