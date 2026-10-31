# @tabacaria/backend

Medusa 2.22 server, admin dashboard and worker. Rules for contributors: [`CLAUDE.md`](CLAUDE.md).

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` (PostgreSQL 15). Outside production the CORS
   and secret variables fall back to local defaults; in production every one of them is required and
   the server refuses to boot without them (`src/lib/env.ts`).
2. `pnpm db:migrate` creates the schema and runs the store setup (below).
3. `pnpm dev` starts the API and admin at http://localhost:9000 (admin under `/app`).
4. `pnpm store:publishable-key` prints the storefront key; copy the line into
   `apps/storefront/.env` as `NUXT_PUBLIC_PUBLISHABLE_KEY`.

## Store setup

`src/migration-scripts/setup-brazil-store.ts` configures the store. `medusa db:migrate` runs it once
per environment (local, staging, production) and records it; if it fails, the next migrate retries it.
It creates, or reuses when they already exist:

| What                | Value                                                              |
| ------------------- | ------------------------------------------------------------------ |
| Region              | `Brasil`, country `br`, currency `brl`, prices include taxes       |
| Tax region          | `br` with the system tax provider and no rates (rates are pending) |
| Sales channel       | `loja-online`, default channel of the store                        |
| Publishable API key | `loja-online storefront`, linked to `loja-online`                  |
| Stock location      | `Armazém principal` (placeholder), linked to `loja-online`         |
| Store               | `Stray Dog Tabacaria`, BRL only and tax-inclusive, defaults above  |

The values live in `src/lib/store-setup/constants.ts` and the decisions in pure, unit-tested
functions (`plan.ts`). The setup is idempotent: every record is looked up by country, name or title
before anything is created, and links are only added when missing, so running it again changes
nothing. To rerun it by hand: `pnpm exec medusa exec ./src/migration-scripts/setup-brazil-store.ts`.
Records are matched by name, so renaming one in the admin makes a rerun create a new one.

The warehouse address is not in the repository: fill it in the admin under
**Settings > Locations & Shipping**.

### Publishable key for the storefront

The storefront sends this key in the `x-publishable-api-key` header; it scopes Store API requests to
the `loja-online` channel and is public by design (it is not a secret). Get it with either:

- `pnpm store:publishable-key` (needs the database from step 1), or
- the admin: **Settings > Publishable API Keys > loja-online storefront**, then copy the token.

## Scripts

| Script                                    | What it does                                   |
| ----------------------------------------- | ---------------------------------------------- |
| `pnpm dev`                                | API + admin with reload                        |
| `pnpm build`                              | Compiles server and admin into `.medusa/`      |
| `pnpm start` / `pnpm start:worker`        | Runs the build as server or as worker          |
| `pnpm db:migrate`                         | Applies migrations and migration scripts       |
| `pnpm store:publishable-key`              | Prints the storefront publishable key          |
| `pnpm test:unit`                          | Unit tests (`src/**/__tests__/*.unit.spec.ts`) |
| `pnpm test:integration:modules` / `:http` | Integration tests (need a database)            |
| `pnpm lint` / `pnpm typecheck`            | ESLint (shared config + Medusa rules) and tsc  |

Redis, file storage and worker mode are configured in BE-01.2; seeds and the local database setup in
EST-02.1 and EST-02.2. `integration-tests/http/store-setup.spec.ts` checks the store setup against a
real database.
