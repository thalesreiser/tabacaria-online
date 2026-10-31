# 0006 · Storefront hosting on Cloudflare

Date: 2026-10-31 · Status: accepted · Decided by: Thales Reiser · Plan reference: DEC-05

## Context

The Nuxt storefront needs a host with SSR, per-PR previews and a CDN close to Brazilian customers.
The plan listed Vercel and Cloudflare Pages. DNS and product images (R2) are already planned on
Cloudflare. Neither provider's acceptable use policy mentions tobacco; both forbid illegal content,
and selling accessories to adults is legal.

## Options considered

1. **Cloudflare Pages:** generous free tier, native Nuxt/Nitro preset, same account as DNS and R2.
2. **Vercel Pro:** best preview experience, but the free Hobby plan is for non-commercial use, so a
   store needs the paid Pro plan.
3. **Railway, next to the backend:** one provider less, but no global CDN or automatic PR previews.

## Decision

Host the storefront on Cloudflare (Pages, or Workers with static assets if Cloudflare's current
guidance for Nuxt prefers it; FE-10.1 picks the Nitro preset).

## Consequences

- FE-10.1 creates the Cloudflare project with preview deployments per PR and the store domain.
- The plan's CI/CD section ("Vercel or Cloudflare Pages") now means Cloudflare.
- Code must stay within Nitro's edge-compatible APIs (no Node-only modules in server routes without
  checking Cloudflare compatibility).
