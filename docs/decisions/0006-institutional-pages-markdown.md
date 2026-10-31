# 0006 · Institutional pages in Markdown

Date: 2026-10-31 · Status: accepted · Decided by: Thales Reiser · Plan reference: DEC-11

## Context

About, terms of use, privacy policy, returns, shipping, FAQ and contact pages change rarely and some
of them are legal texts that must be reviewed before publishing.

## Options considered

1. **Markdown in the repository with `@nuxt/content`:** free, versioned, every change goes through a
   PR and review; editing needs a developer or an agent.
2. **Headless CMS:** non-developers can edit, but it is one more service to run and maybe pay for.

## Decision

Keep institutional pages as Markdown files rendered by `@nuxt/content`.

## Consequences

- FE-11.2 adds `@nuxt/content` and the pages under the storefront's content folder.
- Legal texts are supplied and approved by the legal reviewer; agents never write them. Until then,
  pages may ship with a clearly marked placeholder only in non-production environments.
- Draft legal texts never enter the public repository before approval.
