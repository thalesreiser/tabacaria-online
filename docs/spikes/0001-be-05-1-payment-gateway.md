# Spike 0001: payment gateway viability (BE-05.1)

- **Task:** BE-05.1 · Mercado Pago viability spike
- **Date of research / sources accessed:** 2026-10-31
- **Status:** Research only. Feeds decision **DEC-06 (gateway choice)**, which is Thales's to take.
- **Related open decision:** DEC-07 (whether tobacco products are sold at all).

## Context

The store sells tobacco accessories (rolling papers, filters and tips, grinders, hookahs, charcoal,
hookah flavours) and may later sell tobacco products (DEC-07). Vapes are out of scope (banned by ANVISA
RDC 855/2024). The plan assumes Mercado Pago with Pix, card and boleto, implemented as a Medusa v2
payment provider in `apps/backend/src/providers/` (BE-05.2 Pix, BE-05.3 webhook, BE-05.4 card and
boleto; 5 points each).

The spike answers: (1) does Mercado Pago accept this merchant; (2) the same for the plan-B gateways
Pagar.me and Asaas; (3) how to integrate with Medusa v2; (4) a recommendation.

## 1. Policy findings

### Method and its limits

Only pages actually opened are quoted as sources. The help centres of Mercado Pago
(`mercadopago.com.br/ajuda/...`), Mercado Livre (`vendedores.mercadolivre.com.br`) and Asaas
(`central.ajuda.asaas.com`) returned **HTTP 403 to automated access** on 2026-10-31, so their texts could
not be read here. Where a search engine showed a relevant excerpt from a page that could not be opened,
it is listed as an **unverified lead**, not as a source. Someone must open those URLs in a browser to
confirm them.

### Mercado Pago

| Item                                                  | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Developer terms (opened)                              | [Termos e Condições - Mercado Pago Developers](https://www.mercadopago.com.br/developers/pt/docs/resources/legal/terms-and-conditions) (last updated 14/08/2024). Section 7 "Atividades restritas" only covers API misuse (reselling, scraping, storing card data). **No mention of tobacco.** It annexes the general terms at `https://www.mercadopago.com.br/ajuda/299`, which returned 403.                                                                                                                                              |
| General terms (not opened, 403)                       | `https://www.mercadopago.com.br/ajuda/termos-e-condicoes_300`. Search excerpt: a generic "operações proibidas" clause (contrary to Brazilian law, Central Bank rules, card-scheme rules) allowing Mercado Pago to cancel transactions and suspend accounts. Tobacco not named in the excerpt.                                                                                                                                                                                                                                               |
| Prohibited activities (not opened, 403): **key lead** | `https://global-selling.mercadopago.com/help/18572` ("Prohibited Activities for International Payments"). Search excerpt, section "Prohibited Activities for Brazil": _"Using MPB services to sell any tobacco-containing smoking products is prohibited. This prohibition equally applies to cigarettes, cigars, electronic cigarettes, or any e-cigarette liquids, essences, or flavorings."_ The page is scoped to Global Selling (cross-border); whether the same list binds domestic Brazilian merchants is not stated in the excerpt. |
| Mercado Livre seller guide (not opened, 403)          | `https://vendedores.mercadolivre.com.br/aprender/nota/como-cumprir-as-normas-da-anvisa-e-evitar-o-cancelamento-do-seu-anuncio`. Search excerpt: _"é proibido anunciar tabaco ou produtos relacionados, como cigarro, charuto, cigarro eletrônico em qualquer marketplace digital"_. This is the marketplace, not the payment service.                                                                                                                                                                                                       |

**Reading:**

- **(a) Accessories:** _uncertain._ No public text found says accessories without tobacco are
  prohibited, and the lead's wording targets "tobacco-containing smoking products". It reads as allowed,
  but this is not confirmed by an opened official text.
- **(b) Tobacco products:** _likely not accepted_ (unverified lead above explicitly prohibits
  tobacco-containing smoking products for Brazil). Treat as **no** until Mercado Pago confirms otherwise.
- **Hookah flavours are a grey zone.** Most hookah "essências" sold in Brazil are tobacco-based
  (molasses tobacco), which would make them tobacco products for both the gateway and DEC-07. Only
  tobacco-free flavours would sit with the accessories.

### Pagar.me (plan B)

No public prohibited/restricted activities list was found on `pagar.me` or `docs.pagar.me`. The only
Pagar.me document found was its anti-money-laundering policy
([PDF](https://www.pagar.me/documentos/STNE_politica-institucional-PLD-CFT-V4.docx.pdf), not opened in
full, does not list segments). **Accessories: uncertain. Tobacco: uncertain.** Merchant acceptance is
decided at onboarding (KYC), so only an account application or a sales contact can answer.

### Asaas (plan B)

The help centre has a page listing restricted activities and the general terms, both returning 403:

- `https://central.ajuda.asaas.com/hc/pt-br/articles/31406442119067` ("Quais são as atividades
  econômicas de uso restrito no Asaas?"). Search excerpt lists restricted-with-conditions segments
  (airline miles, weapons with Army registration, auctions, fixed-odds betting). Tobacco not seen in the
  excerpt.
- `https://central.ajuda.asaas.com/hc/pt-br/articles/32096847160859` (Termos e Condições de Uso). Search
  excerpt: Asaas may reject accounts for "atividades econômicas não aceitas".
- The opened [Políticas de Conformidade PDF](https://cdn.asaas.com/p/Pol%C3%ADticas+de+Conformidade_09a6e0b9023c2cf3.pdf)
  is image-only; no text could be extracted.

**Accessories: uncertain. Tobacco: uncertain.**

### Legal context (affects DEC-07 more than DEC-06)

- [Lei 9.294/1996, art. 3º-A](https://www.planalto.gov.br/ccivil_03/leis/l9294.htm) (opened) prohibits
  for tobacco products, among others: _"I - a venda por via postal;"_, _"III - a propaganda por meio
  eletrônico, inclusive internet;"_ and _"IX - a venda a menores de dezoito anos."_ It does not mention
  online sales as such.
- São Paulo city business guide
  [Como abrir e legalizar uma tabacaria no Brasil](https://cate.prefeitura.sp.gov.br/inspiracoes/gestao-empreendedorismo-e-trabalho-inspiracoes/dica-como-abrir-e-legalizar-uma-tabacaria-no-brasil/)
  (opened, dated 14/07/2025): _"Não é permitido vender fumígenos derivados do tabaco pela internet."_
  It cites no legal basis. Needs legal review before DEC-07.

## 2. Medusa v2 integration options

v1 plugins (`medusa-interfaces`, `@medusajs/medusa@^1`) do not work on v2.

| Option                                                                                                                                    | Medusa version                                         | Last release | Weekly downloads¹ | License                       | Pix | Card | Boleto | Webhook                                                    | Signals                                                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------ | ----------------- | ----------------------------- | --- | ---- | ------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`@nicogorga/medusa-payment-mercadopago`](https://github.com/NicolasGorga/medusa-payment-mercadopago) 0.4.0                               | v2, peers pinned to **exactly 2.21.0** (we run 2.22.2) | 2026-09-14   | 307               | MIT (npm; no license on repo) | No  | Yes  | No     | Yes, `x-signature` HMAC; uses Medusa `/hooks/payment/...`  | Author is a Medusa core maintainer; 30 stars, 3 open issues. README: _"WIP and has only been tested for Credit / Debit Card methods following Mercado Pago docs for Uruguay"_. Store route requires a card `token` and `installments`. Depends on `mercadopago@^2.3.0` (SDK is at 3.x). Adds subscriptions (not needed). |
| [`@zaamx/medusa-payment-mercadopago-international`](https://www.npmjs.com/package/@zaamx/medusa-payment-mercadopago-international) 0.2.11 | v2, peers pinned to 2.14.2                             | 2026-10-17   | 47                | MIT                           | No  | Yes  | No     | Yes, `x-signature`                                         | Colombia, Peru and Mexico only. **No Brazil.** No public repo.                                                                                                                                                                                                                                                           |
| `medusa-payment-mercadopago` (lucasthevenet), `@minskylab/…`, `@marcosgn/…` (has Pix), `@ralexale/…`                                      | **v1 only**                                            | 2022 to 2024 | n/a               | MIT / none                    | —   | —    | —      | —                                                          | Not usable on v2. `marcosgomesneto/medusa-payment-mercadopago` (Pix + card) can serve as a reference for request shapes only.                                                                                                                                                                                            |
| **Own provider** in `apps/backend/src/providers/mercadopago` with the official SDK                                                        | v2 (our version)                                       | —            | —                 | ours                          | Yes | Yes  | Yes    | Ours, via `getWebhookActionAndData` + SDK signature helper | Full control over the Brazilian flow, idempotency and logging rules in `apps/backend/CLAUDE.md`.                                                                                                                                                                                                                         |

¹ npm downloads API, week 2026-10-23 to 2026-10-29. No Medusa v2 provider was found on npm or GitHub for
Pagar.me or Asaas.

### Official SDK and Mercado Pago API (checked)

- [`mercadopago`](https://github.com/mercadopago/sdk-nodejs) **3.6.1** (published 2026-09-09), MIT,
  zero runtime dependencies, `node >=18`, ~317k weekly downloads. Clients include `payment`,
  `cardToken`, `customer`, `customerCard`, `paymentRefund`, `order`.
- **Pix:** [Pix integration](https://www.mercadopago.com.br/developers/pt/docs/checkout-api-payments/integration-configuration/integrate-pix)
  uses `"payment_method_id": "pix"`; the response carries `point_of_interaction.transaction_data` with
  `qr_code`, `qr_code_base64` and `ticket_url`; default expiry 24 h, configurable _"entre 30 minutos até
  30 dias"_. Requires Pix keys on the account.
- **Boleto:** [Other payment methods](https://www.mercadopago.com.br/developers/pt/docs/checkout-api-payments/integration-configuration/other-payment-methods):
  _"Para boleto, é sempre `bolbradesco`."_ Requires payer CPF and full address; returns
  `transaction_details.external_resource_url`; default due date 3 days (1 to 30).
- **Card:** tokenised in the browser (MercadoPago.js / Card Payment Brick), server creates the payment
  with the token; SDK `cardToken` client exists for server-side tests.
- **Webhooks:** [Notifications](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)
  sends an `x-signature` header (`ts=…,v1=…`); reply 200/201 within 22 s or it retries. The SDK ships
  `WebhookSignatureValidator.validate({ xSignature, xRequestId, dataId, secret, toleranceSeconds })`
  ([docs/webhooks.md](https://github.com/mercadopago/sdk-nodejs/blob/master/docs/webhooks.md)), and
  recommends: validate, deduplicate, acknowledge, fetch the resource from the API, apply idempotently.
  This matches our backend rules.

### Medusa v2 custom provider (checked)

[Payment Module Provider reference](https://docs.medusajs.com/resources/references/payment/provider):
a class extending `AbstractPaymentProvider` (static `identifier`) exported with
`ModuleProvider(Modules.PAYMENT, { services: [...] })` and registered under `@medusajs/medusa/payment`
`providers` in `medusa-config.ts`. Core methods: `initiatePayment`, `authorizePayment`,
`capturePayment`, `refundPayment`, `cancelPayment`, `deletePayment`, `retrievePayment`,
`updatePayment`, `getPaymentStatus`, `getWebhookActionAndData` (returns `authorized` / `captured` /
`failed` / `not_supported` with `session_id` and `amount`). Account-holder and saved-card methods are
optional for us.

## 3. Effort estimate (own provider)

| Card                  | Scope                                                                                                                            | Plan | Estimate                                                                                             |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---- | ---------------------------------------------------------------------------------------------------- |
| BE-05.2 Pix           | Provider skeleton, options validation, `initiatePayment` creating a Pix payment, status mapping, unit tests with a mocked client | 5    | 5 (skeleton is the bulk; SDK does the HTTP)                                                          |
| BE-05.3 Webhook       | `getWebhookActionAndData`, signature check (SDK helper), re-fetch payment by id, idempotency, tests                              | 5    | 5                                                                                                    |
| BE-05.4 Card + boleto | Card token flow (3-DS/`pending` states, installments), boleto (CPF + address), refunds/cancel                                    | 5    | 5 to 8 (card edge cases and refunds are the risk)                                                    |
| Adopting the plugin   | Fork or override peer pins, add Pix and boleto, align with our rules                                                             | —    | Not cheaper: the plugin covers only card, so Pix (the main method) and boleto must be written anyway |

Storefront work (Card Payment Brick or MercadoPago.js, Pix QR screen) is outside these cards.

## 4. Risks

1. **Account rejection or later freeze** if Mercado Pago classifies the store under tobacco (balance
   retention is the usual consequence in its terms). Mitigation: written confirmation before going live;
   keep tobacco items (including tobacco-based hookah flavours) out of the catalogue until DEC-07 and
   the gateway allow them.
2. **Policy texts unverified here** (403); everything above marked "lead" needs a human check.
3. **Online sale of tobacco products** may be legally restricted (see legal context); this can make the
   gateway question moot for DEC-07.
4. **Single-gateway lock-in:** if Mercado Pago refuses, the provider code is gateway-specific. Keep
   business rules (status mapping, idempotency) in pure functions so a Pagar.me/Asaas provider can reuse
   them.
5. **Community plugin risk** (if chosen): exact peer pins block Medusa upgrades; WIP status; old SDK
   major.
6. **New dependency:** the `mercadopago` SDK is a new backend dependency, to be confirmed with DEC-06.

## 5. Recommendation (for Thales to decide, DEC-06)

- **Integration:** write our own Medusa v2 provider on the official `mercadopago` SDK. No community v2
  plugin covers Pix or boleto in Brazil, so a plugin would not reduce the BE-05.2 to BE-05.4 work and
  would add pinning and maintenance risk. Use the NicolasGorga plugin and the v1 Pix plugin only as
  references.
- **Gateway:** Mercado Pago, **conditional** on Mercado Pago confirming in writing (account review or
  support) that a shop selling tobacco accessories is accepted. Launch with accessories only. In
  parallel, ask Pagar.me and Asaas the same question so plan B is ready if the answer is no.

## Open questions for Thales

1. Open the Mercado Pago prohibited-activities page and general terms in a browser and confirm the
   Brazil tobacco clause applies to domestic merchants.
2. Ask Mercado Pago (account review or support), and optionally Pagar.me and Asaas, whether a CNAE
   4729-6/01 shop selling accessories only is accepted, and whether tobacco products or tobacco-based
   hookah flavours would ever be.
3. Will hookah flavours at launch be tobacco-free only? (Ties to DEC-07.)
4. Approve the `mercadopago` SDK as a backend dependency together with DEC-06.
