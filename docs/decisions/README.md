# Architecture Decision Records

Every decision taken during development (design, UI/UX, data model, API contract, regulatory rules,
infrastructure, new dependencies) is recorded here as `NNNN-short-title.md`, numbered in order, using
[`template.md`](template.md). The PR that applies a decision links to its ADR.

| ADR                                               | Decision                          |
| ------------------------------------------------- | --------------------------------- |
| [0001](0001-node-24-runtime.md)                   | Node.js 24 LTS as the runtime     |
| [0002](0002-visual-identity-and-design-tokens.md) | Visual identity and design tokens |
| [0003](0003-split-ui-and-integration-tasks.md)    | Split UI and integration tasks    |

A decision that replaces another gets a new number; the old ADR is marked "superseded by NNNN".
