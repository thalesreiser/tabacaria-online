# Architecture Decision Records

Every decision taken during development (design, UI/UX, data model, API contract, regulatory rules,
infrastructure, new dependencies) is recorded here as `NNNN-short-title.md`, numbered in order, using
[`template.md`](template.md). The PR that applies a decision links to its ADR.

| ADR                                               | Decision                           |
| ------------------------------------------------- | ---------------------------------- |
| [0001](0001-node-24-runtime.md)                   | Node.js 24 LTS as the runtime      |
| [0002](0002-visual-identity-and-design-tokens.md) | Visual identity and design tokens  |
| [0003](0003-split-ui-and-integration-tasks.md)    | Split UI and integration tasks     |
| [0004](0004-storefront-hosting-cloudflare.md)     | Storefront hosting on Cloudflare   |
| [0005](0005-analytics-posthog-no-ad-pixel.md)     | PostHog for analytics, no ad pixel |
| [0006](0006-institutional-pages-markdown.md)      | Institutional pages in Markdown    |
| [0007](0007-age-gate-modal.md)                    | Age gate as a modal over the page  |

A decision that replaces another gets a new number; the old ADR is marked "superseded by NNNN".
