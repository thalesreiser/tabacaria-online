# Backend (Medusa v2)

Read the root `CLAUDE.md` first. Medusa 2.22 (scaffolded in BE-01.1 from the official `medusajs/dtc-starter`, without its demo data).

## Layout (from the plan)

```
src/api/          custom routes (store/, admin/, hooks/)
src/modules/      custom modules (invoice, age-verification)
src/providers/    payment (Mercado Pago), fulfillment (Melhor Envio), notification (Resend)
src/workflows/    checkout, fulfillment, refund
src/subscribers/  event handlers (order.placed, payment.captured)
src/jobs/         scheduled jobs
src/links/        module links (Order <-> Invoice)
integration-tests/
```

## Rules

- Medusa is the single source of truth for products, prices, stock, carts and orders.
- Business rules (age, CPF, shipping filters, order state transitions, webhook signatures) live in pure
  functions with unit tests; workflows and routes call them.
- Every custom route validates input with the Zod schemas in `packages/shared-types` and returns errors
  as `{ code, message }`.
- Webhooks: validate the signature, fetch the resource from the provider before trusting the payload,
  process idempotently (the same event twice never creates two orders).
- Slow work (NF-e, labels, e-mails) runs in the worker, never in the request.
- Products with `contemTabaco = true` are never offered postal (Correios) shipping.
- No customer completes a purchase without a validated age of 18 or more.
- Logs are JSON and never contain CPF, birth date, address or card data.
- Migrations stay compatible with the previous release (expand, then contract) so rollback works.
