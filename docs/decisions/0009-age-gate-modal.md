# 0009 · Age gate as a modal over the page

Date: 2026-10-31 · Status: accepted · Decided by: Thales Reiser · Plan reference: DEC-02

## Context

The store sells products for adults only. The age gate must deter minors without hiding the catalog
from search engines. Purchases are already blocked for anyone under 18 by the CPF and birth date
check at checkout (BE-03.2).

## Options considered

1. **Modal over the rendered page:** visible on the first visit, the page stays indexable.
2. **Hard block:** nothing renders before confirmation; search engines cannot index the catalog.
3. **Checkout only:** no gate at entry; the catalog is exposed to minors.

## Decision

Show a modal on the first visit: "Este site vende produtos destinados a maiores de 18 anos. Você tem
18 anos ou mais?" with **Sim, tenho 18 anos ou mais** and **Não**.

- "Sim" stores the answer in a cookie for 30 days and closes the modal.
- "Não" leads to an exit page with no products, prices or images.
- The modal traps focus, cannot be dismissed by clicking outside or pressing Esc, and works with
  keyboard and screen readers.
- The page behind the modal is server-rendered, so search engines can still index it.

## Consequences

- FE-03.1 implements it; the final wording is subject to legal review before production.
- The checkout age check (BE-03.2) remains the binding control.
