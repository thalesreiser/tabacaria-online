# @tabacaria/backend

Medusa 2.22 server, admin dashboard and worker. Rules for contributors: [`CLAUDE.md`](CLAUDE.md).

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` (PostgreSQL 15). Outside production the CORS
   and secret variables fall back to local defaults; in production every one of them is required and
   the server refuses to boot without them (`src/lib/env.ts`).
2. `pnpm db:migrate` creates the schema.
3. `pnpm dev` starts the API and admin at http://localhost:9000 (admin under `/app`).

## Scripts

| Script                                    | What it does                                   |
| ----------------------------------------- | ---------------------------------------------- |
| `pnpm dev`                                | API + admin with reload                        |
| `pnpm build`                              | Compiles server and admin into `.medusa/`      |
| `pnpm start` / `pnpm start:worker`        | Runs the build as server or as worker          |
| `pnpm db:migrate`                         | Applies migrations                             |
| `pnpm test:unit`                          | Unit tests (`src/**/__tests__/*.unit.spec.ts`) |
| `pnpm test:integration:modules` / `:http` | Integration tests (need a database)            |
| `pnpm lint` / `pnpm typecheck`            | ESLint (shared config + Medusa rules) and tsc  |

Redis, file storage and worker mode are configured in BE-01.2; seeds and the local database setup in
EST-02.1 and EST-02.2.
