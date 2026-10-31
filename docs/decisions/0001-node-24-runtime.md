# 0001 · Node.js 24 LTS as the runtime

Date: 2026-10-31 · Status: accepted · Decided by: Thales Reiser

## Context

The development plan pinned Node.js 20 LTS. Node.js 20 reached end-of-life in April 2026 and no
longer receives security fixes, so the runtime had to be chosen again before the first line of code.

## Options considered

1. **Node.js 20:** what the plan said, but unsupported.
2. **Node.js 22 LTS:** supported until April 2027.
3. **Node.js 24 LTS:** supported until April 2028 and already installed on the development machine.

## Compatibility check

- `@medusajs/medusa` 2.22.2 declares `engines.node >=22.22.0`; the Medusa installation guide asks for
  "Node.js v22.22.0+ (LTS versions only)". Node 24 is an LTS line, so it is supported.
- `nuxt` 3.21.x declares `engines.node ^20.19.0 || >=22.12.0`.

## Decision

Use Node.js 24 LTS everywhere: `.nvmrc`, `engines` in the root `package.json`, CI and Docker images.
`engineStrict` in `pnpm-workspace.yaml` makes `pnpm install` fail on any other major version.

## Consequences

- EST-04.1 (CI) and EST-04.3 (Docker image) use Node 24.
- BE-01.1 must confirm that every Medusa plugin adopted also runs on Node 24.
