# 0005 · PostHog for analytics, no advertising pixel

Date: 2026-10-31 · Status: accepted · Decided by: Thales Reiser · Plan reference: DEC-04

## Context

The store needs funnel analytics (product view to purchase) under LGPD. Meta's advertising standards
forbid ads for tobacco and related products, explicitly including rolling papers, pipes, filters and
hookahs; Google Ads restricts the same items. An advertising pixel would collect data for campaigns
the store cannot run.

## Options considered

1. **PostHog:** free up to 1 million events per month, funnels and product analytics, EU hosting.
2. **Plausible:** cookieless and simple, but paid and with limited funnels.
3. **GA4 plus Meta pixel:** free and familiar, heavier on LGPD, and the pixel would be mostly useless.

## Decision

Use PostHog (EU cloud). Do not install any advertising pixel.

## Consequences

- FE-08.1 integrates PostHog behind the consent banner: nothing loads before consent.
- Events follow the plan's event table; no CPF, e-mail or address in any event.
- Revisit only if a sales channel that accepts tobacco accessories ads is found.
