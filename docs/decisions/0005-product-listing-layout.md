# 0005 · Product listing layout

Date: 2026-10-31 · Status: accepted · Decided by: Aloisio Miguel · Plan reference: FE-04.1a

## Context

FE-04.1a builds the category and search pages with sample data (ADR 0003). The layout of the filters
and the way to move through the results had to be chosen. Three options were compared on a mock-up
page, each in a wide and a phone-sized version.

## Options considered

1. **A, side column:** filters in a column on the left, a "Filtrar" button with a panel on phones,
   numbered pages. Fits many filters and the pages are easy for search engines to index. Takes
   width, and the column looks empty with few filters.
2. **B, strip on top:** category buttons and compact filter menus above the list, numbered pages.
   Lighter, but does not hold many filters.
3. **C, sticky strip and "Mostrar mais":** continuous scrolling with a progress bar. Pleasant on
   phones, but harder for search engines to index and to return to the same place.

A mix of A with the "Mostrar mais" button of C was tried and dropped: the button indexes worse than
numbered pages, and indexing matters for FE-04.3 (SEO).

## Decision

Option A, with numbered pages.

- **Layout:** filters in a left column from the `lg` breakpoint; below it, a "Filtrar" button opens
  the same filters in a modal `<dialog>` (focus trap and Esc to close come from the element).
- **Filters:** price range, "só em estoque" and sorting (relevance, lowest price, highest price,
  newest), plus the category list. The category is part of the path
  (`/categoria/isqueiros`, `/categoria/todos`) and search is `/busca?q=...`.
- **State in the address:** `ordem`, `preco_min`, `preco_max` (whole reais), `estoque=1`, `q` and
  `pagina`. Any change of filter returns to page 1. An address reproduces the same result.
- **Pagination:** 24 products per page, every page number is a real link, the current page has
  `aria-current="page"`, and the control is hidden when there is a single page. An out-of-range
  `pagina` shows the last page; an invalid one shows the first.
- **Cards:** the add button is pinned to the bottom of the card so that a row of cards with
  different content keeps the buttons aligned.

## Consequences

- The add button does nothing yet; the cart arrives with FE-05.1a.
- The product link points to `/produto/<handle>`, which exists only after FE-04.2a.
- `useProducts` reads from a repository chosen by `NUXT_PUBLIC_DATA_SOURCE` (`mock` or `api`). Only
  `mock` is implemented here; `api` arrives with FE-04.1b.
- The sample data is included in a build only with `NUXT_INCLUDE_MOCKS=1` (always in development).
- Filters that the backend does not offer must be removed or adapted in FE-04.1b.
