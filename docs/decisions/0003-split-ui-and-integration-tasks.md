# 0003 · Split UI and integration tasks

Date: 2026-10-31 · Status: accepted · Decided by: Aloisio Miguel · Plan reference: none (process
change; the development plan needs the same update)

## Context

The storefront tasks that show catalog and cart screens (FE-04.1, FE-04.2, FE-05.1) depend on backend
tasks that are not done yet (BE-02.2, BE-04.1) and on the API client (FE-02.1). Waiting for them would
leave the frontend idle while all the screens, which carry the open design questions, are still to
be built.

## Options considered

1. **Keep the tasks whole:** matches the plan, but the frontend waits for the backend and the design
   feedback arrives late.
2. **Split each task into an interface task and an integration task:** the screens are built and
   reviewed with sample data now, and the integration only swaps the data source. Costs a second PR
   per task and a risk of reshaping the sample data when the API contract changes.
3. **Build the screens against a mock HTTP server:** closer to the real API, but it adds a server to
   maintain and still needs the same split of the work.

## Decision

Option 2, for FE-04.1, FE-04.2 and FE-05.1. Other tasks can follow the same pattern when they get
the same blocker (for example FE-11.1 and FE-03.1, once DEC-12 and DEC-02 are decided).

- **Names:** `[FE-04.1a] ...: interface` and `[FE-04.1b] ...: integração`. The "a" card has no
  backend dependency; the "b" card keeps the original dependencies plus the "a" card. Points are
  split, and the total of the original task does not change.
- **Data source:** the composables (`useProducts`, `useCart`...) stay the only code that knows where
  data comes from. `NUXT_PUBLIC_DATA_SOURCE` selects `mock` or `api`. The "a" tasks only implement
  `mock`; the "b" tasks implement `api` and keep the same composable signatures.
- **Sample data (fixtures):**
  - fictional products only, accessories only (no tobacco, which waits for DEC-07), no real names,
    prices or customer data;
  - same shape as the Medusa v2 Store API, using the types from `packages/shared-types`;
  - kept out of the production build.
- **Reviews:** a screen is reviewed on the "a" PR. The "b" PR is reviewed for data and errors only.

## Consequences

- The Trello cards for FE-04.1, FE-04.2 and FE-05.1 were split and the epics FE-04 and FE-05 updated.
  FE-04.3 and FE-06.1 now depend on the "b" cards, and FE-11.1 on FE-04.1a.
- The plan must be updated, since it is the source of truth; until then the board and the plan differ.
- If the API contract (BE-10) changes the product or cart shape, the fixtures change with it.
- E2E tests can run on the `mock` source without a backend.
