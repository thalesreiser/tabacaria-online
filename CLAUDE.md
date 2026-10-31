# Working on tabacaria-online

Read this file before every task. It applies to every contributor, human or automated. App-specific
rules live in `apps/backend/CLAUDE.md` and `apps/storefront/CLAUDE.md`. If anything here conflicts with
another document, follow the stricter rule and point out the conflict on the task card.

## Sources of truth

- **Development plan** (epics, tasks, DoR/DoD, architecture, standards, roadmap, decision log):
  https://claude.ai/artifact/EnmS8k7wagDkPcYKcjcCMh
- **Task board** (Trello, pt-BR): https://trello.com/b/3CrvN8KY. Card names carry the plan's task ID,
  e.g. `[BE-05.2]`.
- **Decisions already taken:** `docs/decisions/` (ADRs). Read the ones related to your task.

## Who decides what

Contributors implement; Thales decides. Never decide the items below on your own:

- **Design, UI and UX:** visual identity, page layout, navigation flows, interface copy, new components,
  mobile behaviour.
- **Data model:** migrations that drop or rename tables or columns, or change a column type.
- **API contract:** changing or removing a public route, or a payload change that breaks a consumer.
- **Regulatory and business rules:** age verification, tobacco products, shipping, taxes and NF-e,
  returns, prices and coupons.
- **Security and personal data:** authentication, permissions, CPF handling, logging.
- **Integrations, infrastructure and cost:** a new or replaced provider, a relevant new dependency, a
  paid plan, any change to CI/CD.
- **Removing a feature** or changing behaviour the customer can notice.

When you reach one of these:

1. Pause only the affected part; keep working on the rest of the task.
2. Ask on the task card and in the PR: context, 2 or 3 options with pros and cons, impact and a
   recommendation. For UI, describe or mock up each option.
3. Wait for Thales's answer on the card.
4. Record the decision as an ADR (`docs/decisions/NNNN-short-title.md`, see `template.md`) and link it
   from the PR.
5. Resume following the ADR.

Routine implementation choices (library versions inside the agreed stack, lint strictness, file layout)
do not need a decision: pick the most sensible option and list it under "Implementation choices" in the
PR description with the reason.

## Workflow for every task

1. **Pick** the highest-priority card in "Pronto (DoR)" whose dependencies are done; move it to
   "Em andamento".
2. **Check the DoR.** If acceptance criteria, a decision or an API contract is missing, comment what is
   missing and pick another card.
3. **Read** this file, the plan sections for the task, related ADRs and the surrounding code.
4. **Plan:** comment on the card which files will change, which tests will be written and which
   decisions are needed.
5. **Branch** from an up-to-date `develop`: `feat/<task-id>-<slug>` or `fix/<task-id>-<slug>`.
6. **Tests first** for business rules, then the code.
7. **Commit** in small steps (Conventional Commits, see below).
8. **Verify:** `pnpm lint && pnpm typecheck && pnpm build && pnpm format:check` (and tests once they
   exist). For UI, open the page on desktop and mobile and take screenshots.
9. **Open the PR** against `develop` with the template, then move the card to "Revisão (PR)".
10. **Address review** with new commits; never rewrite history that was already reviewed.
11. **Merge** is always done by a person. Move the card to "Concluído" only after the staging deploy
    and smoke test pass.

If you are stuck for more than two attempts (an error you do not understand, a test you cannot make
pass, an unclear requirement), stop, describe what you tried on the card and ask for help. Never work
around it by disabling a test, a lint rule or a type check.

Task cards get dated comments in Portuguese when work starts, when the PR opens and when it is done.

## Commands

| Command                             | What it does                         |
| ----------------------------------- | ------------------------------------ |
| `pnpm install`                      | Install everything and the Git hooks |
| `pnpm build`                        | Build every package (Turborepo)      |
| `pnpm typecheck`                    | Type-check every package             |
| `pnpm lint`                         | ESLint in every package              |
| `pnpm format` / `pnpm format:check` | Prettier (write / check only)        |

More commands (`infra:up`, `db:migrate`, `db:seed`, `test:*`, `verify`) arrive with EST-02.2 and the
testing tasks; the plan lists them in its operating guide.

## Conventions

- Node.js 24 LTS and pnpm 10 only (`pnpm install` refuses other versions).
- TypeScript `strict`; no `any`, no `@ts-ignore`, `@ts-expect-error` only with a description.
- Follow existing patterns and reuse modules, composables and schemas before creating new ones.
- One task per branch and per PR, roughly 400 changed lines at most; split bigger work.
- Business rules ship with tests. Never delete, weaken or skip a test to make CI pass.
- Do not change CI/CD, infrastructure, secrets or core dependencies without a recorded decision.
- **Language:** code, commits, branches, PRs and repository docs in English; Trello cards and comments
  in Brazilian Portuguese; user-facing text in Brazilian Portuguese.
- **Commits:** Conventional Commits with the task ID, e.g. `feat(checkout): add pix polling (FE-06.2)`.
  Header and body lines up to 100 characters. No co-author trailers or tool-generated footers in commits
  or PRs.

## What never goes into this repository

The repository is public.

- Secrets of any kind: API keys, tokens, passwords, `.env` files (only `.env.example`).
- Customer data: CPF, names, addresses, e-mails, orders, even in tests or fixtures. Use generated data.
- Business-sensitive data: real tax settings (regime, NCM, CFOP), contracts, supplier prices, draft
  legal texts. These live in environment variables or private documents.

Secret scanning with push protection is enabled; a blocked push means something above slipped in.

## Finishing a task

- Fill the PR template: DoD checklist, decisions made (with ADR links), decisions pending and what could
  not be tested.
- UI changes include desktop and mobile screenshots.
- Merge and production deploys are always done by a person.
