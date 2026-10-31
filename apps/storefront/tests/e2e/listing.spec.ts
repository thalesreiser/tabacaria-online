import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"
import { mockNetwork } from "./support/mock-network"

const cards = (page: Page) => page.getByRole("article")
const count = (page: Page) => page.getByRole("status")

async function prices(page: Page): Promise<number[]> {
  const texts = await page.locator("article span.font-display").allTextContents()
  return texts.map((text) => Number(text.replace(/[^\d,]/g, "").replace(",", ".")))
}

async function expectAccessible(page: Page, selector: string) {
  const results = await new AxeBuilder({ page }).include(selector).analyze()
  expect(
    results.violations.map((violation) => ({
      rule: violation.id,
      targets: violation.nodes.map((node) => node.target.join(" ")),
    })),
  ).toEqual([])
  expect(results.incomplete.map((rule) => rule.id)).not.toContain("color-contrast")
}

test.beforeEach(async ({ page }) => {
  await mockNetwork(page)
})

test.describe("category page", () => {
  test("shows only the products of the category, with the range and no pagination", async ({
    page,
  }) => {
    await page.goto("/categoria/isqueiros")

    await expect(page.getByRole("heading", { level: 1, name: "Isqueiros" })).toBeVisible()
    await expect(count(page)).toHaveText("Mostrando 1 a 15 de 15 produtos")
    await expect(cards(page)).toHaveCount(15)
    await expect(page.getByRole("navigation", { name: "Paginação" })).toHaveCount(0)
    await expect(page.getByRole("link", { name: /^Isqueiro/ }).first()).toBeVisible()
  })

  test("'todos' lists everything in pages of 24", async ({ page }) => {
    await page.goto("/categoria/todos")

    await expect(page.getByRole("heading", { level: 1, name: "Todos os acessórios" })).toBeVisible()
    await expect(count(page)).toHaveText("Mostrando 1 a 24 de 60 produtos")
    await expect(cards(page)).toHaveCount(24)
  })

  test("an unknown category answers 404", async ({ page }) => {
    const response = await page.goto("/categoria/nao-existe")

    expect(response?.status()).toBe(404)
    await expect(
      page.getByRole("heading", { level: 1, name: "Página não encontrada" }),
    ).toBeVisible()
  })

  test("the add buttons of a row of cards are aligned at the bottom", async ({ page }) => {
    await page.goto("/categoria/todos")
    await expect(cards(page)).toHaveCount(24)

    const rows = await page
      .getByRole("button", { name: /Adicionar|Indisponível/ })
      .evaluateAll((buttons) => {
        const byRow = new Map<number, number[]>()
        for (const button of buttons) {
          const top = Math.round(button.closest("article")?.getBoundingClientRect().top ?? 0)
          byRow.set(top, [
            ...(byRow.get(top) ?? []),
            Math.round(button.getBoundingClientRect().bottom),
          ])
        }
        return [...byRow.values()]
      })

    expect(rows.length).toBeGreaterThan(1)
    for (const bottoms of rows) expect(new Set(bottoms).size).toBe(1)
  })
})

test.describe("pagination", () => {
  test("every page number is a link and the address keeps the page", async ({ page }) => {
    await page.goto("/categoria/todos")
    const nav = page.getByRole("navigation", { name: "Paginação" })

    await expect(nav.getByRole("link", { name: "Página 2" })).toHaveAttribute("href", /pagina=2/)
    await nav.getByRole("link", { name: "Página 2" }).click()

    await expect(page).toHaveURL(/pagina=2/)
    await expect(count(page)).toHaveText("Mostrando 25 a 48 de 60 produtos")
    await expect(nav.getByText("2", { exact: true })).toHaveAttribute("aria-current", "page")

    await nav.getByRole("link", { name: "Próxima página" }).click()
    await expect(count(page)).toHaveText("Mostrando 49 a 60 de 60 produtos")
    await expect(cards(page)).toHaveCount(12)
  })

  test("a page past the end shows the last page and an invalid one shows the first", async ({
    page,
  }) => {
    await page.goto("/categoria/todos?pagina=99")
    await expect(count(page)).toHaveText("Mostrando 49 a 60 de 60 produtos")

    await page.goto("/categoria/todos?pagina=abc")
    await expect(count(page)).toHaveText("Mostrando 1 a 24 de 60 produtos")
  })

  test("a copied address opens the same page without client navigation", async ({ page }) => {
    await page.goto("/categoria/todos?pagina=2&ordem=menor-preco")

    await expect(count(page)).toHaveText("Mostrando 25 a 48 de 60 produtos")
    const values = await prices(page)
    expect(values).toEqual([...values].sort((a, b) => a - b))
  })
})

test.describe("filters and sorting", () => {
  test("'só em estoque' removes sold-out products and the address keeps it", async ({ page }) => {
    await page.goto("/categoria/todos")

    await page.getByRole("checkbox", { name: "Só em estoque" }).check()

    await expect(page).toHaveURL(/estoque=1/)
    await expect(count(page)).toHaveText("Mostrando 1 a 24 de 51 produtos")
    await expect(page.getByText("Esgotado")).toHaveCount(0)
  })

  test("the price range keeps only products inside it", async ({ page }) => {
    await page.goto("/categoria/todos")

    await page.getByRole("textbox", { name: "Preço mínimo, em reais" }).fill("20")
    await page.getByRole("textbox", { name: "Preço máximo, em reais" }).fill("40")
    await page.getByRole("button", { name: "Aplicar" }).click()

    await expect(page).toHaveURL(/preco_min=20/)
    await expect(page).toHaveURL(/preco_max=40/)
    // The address changes first; wait until the list itself shows only the new range.
    await expect
      .poll(async () => {
        const values = await prices(page)
        return values.length > 0 && values.every((value) => value >= 20 && value <= 40)
      })
      .toBe(true)
  })

  test("sorting by lowest price orders the list and returns to page 1", async ({ page }) => {
    await page.goto("/categoria/todos?pagina=2")

    await page.getByRole("combobox", { name: "Ordenar por" }).selectOption("Menor preço")

    await expect(page).toHaveURL(/ordem=menor-preco/)
    await expect(page).not.toHaveURL(/pagina=/)
    await expect(count(page)).toHaveText("Mostrando 1 a 24 de 60 produtos")
    // The default order is not sorted by price, so this only holds once the new list is shown.
    await expect
      .poll(async () => {
        const values = await prices(page)
        return values.length === 24 && values.every((value, i) => i === 0 || value >= values[i - 1])
      })
      .toBe(true)
  })

  test("a filter change goes back to page 1", async ({ page }) => {
    await page.goto("/categoria/todos?pagina=3")

    await page.getByRole("checkbox", { name: "Só em estoque" }).check()

    await expect(page).not.toHaveURL(/pagina=/)
    await expect(count(page)).toHaveText("Mostrando 1 a 24 de 51 produtos")
  })

  test("the category list opens the other categories", async ({ page }) => {
    await page.goto("/categoria/todos")

    await page
      .getByRole("navigation", { name: "Categoria" })
      .getByRole("link", { name: "Moedores" })
      .click()

    await expect(page).toHaveURL(/\/categoria\/moedores/)
    await expect(page.getByRole("heading", { level: 1, name: "Moedores" })).toBeVisible()
    await expect(count(page)).toHaveText("Mostrando 1 a 15 de 15 produtos")
  })
})

test.describe("search page", () => {
  test("lists only the products whose name contains the term", async ({ page }) => {
    await page.goto("/busca?q=moedor")

    await expect(page.getByRole("heading", { level: 1, name: "Busca: moedor" })).toBeVisible()
    await expect(cards(page)).toHaveCount(15)
    for (const name of await page.locator("article h3").allTextContents()) {
      expect(name.toLowerCase()).toContain("moedor")
    }
  })
})

test.describe("states", () => {
  test("an empty result shows the empty state and a way to clear the filters", async ({ page }) => {
    await page.goto("/categoria/todos?simular=vazio&estoque=1")

    const empty = page.locator("section", { hasText: "Nenhum produto encontrado" })
    await expect(empty.getByRole("heading", { name: "Nenhum produto encontrado" })).toBeVisible()

    await empty.getByRole("button", { name: "Limpar filtros" }).click()
    await expect(page).not.toHaveURL(/estoque=1/)
  })

  test("an error shows the error state with a retry", async ({ page }) => {
    await page.goto("/categoria/todos?simular=erro")

    await expect(page.getByRole("alert")).toContainText("Não deu para carregar")
    await expect(page.getByRole("button", { name: "Tentar de novo" })).toBeVisible()
    await expect(cards(page)).toHaveCount(0)
  })

  test("the list shows skeleton cards while it loads on a client navigation", async ({ page }) => {
    await page.goto("/_componentes")

    await page.getByRole("link", { name: "Carregando (simulado)" }).click()

    await expect(page.getByRole("status", { name: "Carregando produtos" })).toBeVisible()
    await expectAccessible(page, "main")
    await expect(cards(page)).toHaveCount(24, { timeout: 10_000 })
  })
})

test.describe("accessibility", () => {
  for (const [name, path] of [
    ["the list", "/categoria/todos"],
    ["a filtered list", "/categoria/moedores?ordem=menor-preco&estoque=1&preco_min=10"],
    ["the last page", "/categoria/todos?pagina=3"],
    ["the search page", "/busca?q=isqueiro"],
    ["the empty state", "/categoria/todos?simular=vazio&estoque=1"],
    ["the error state", "/categoria/todos?simular=erro"],
  ] as const) {
    test(`${name} has no violations, contrast included`, async ({ page }) => {
      await page.goto(path)
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()

      await expectAccessible(page, "main")
    })
  }

  test("every control of the list is reachable by keyboard with a visible outline", async ({
    page,
  }) => {
    await page.goto("/categoria/todos")

    const outlines: string[] = []
    for (let i = 0; i < 80; i++) {
      await page.keyboard.press("Tab")
      const outline = await page.evaluate(() => {
        const el = document.activeElement
        if (!el?.closest("main")) return null
        const style = getComputedStyle(el)
        return `${style.outlineStyle}|${style.outlineWidth}`
      })
      if (outline) outlines.push(outline)
    }

    expect(outlines.length).toBeGreaterThan(20)
    expect(
      outlines.filter((outline) => outline.startsWith("none") || outline.endsWith("|0px")),
    ).toEqual([])
  })
})

test.describe("phone", () => {
  test.use({ viewport: { width: 360, height: 740 } })

  test("has no horizontal scroll and the pagination fits", async ({ page }) => {
    await page.goto("/categoria/todos?pagina=2")

    await expect(page.getByRole("navigation", { name: "Paginação" })).toBeVisible()
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)
  })

  test("the filters live in a dialog that closes with Esc and returns the focus", async ({
    page,
  }) => {
    await page.goto("/categoria/todos")
    const open = page.getByRole("button", { name: "Filtrar" })
    await expect(page.getByRole("checkbox", { name: "Só em estoque" })).toBeHidden()

    await open.click()
    const dialog = page.getByRole("dialog", { name: "Filtros" })
    await expect(dialog).toBeVisible()
    await expectAccessible(page, "dialog")

    await dialog.getByRole("checkbox", { name: "Só em estoque" }).check()
    await expect(page).toHaveURL(/estoque=1/)

    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()
    await expect(open).toBeFocused()
  })

  test("the cards stay readable in two columns", async ({ page }) => {
    await page.goto("/categoria/todos")
    await expect(cards(page).first()).toBeVisible()

    const widest = await cards(page).evaluateAll((articles) =>
      Math.max(...articles.map((article) => article.scrollWidth - article.clientWidth)),
    )
    expect(widest).toBeLessThanOrEqual(0)
    await expectAccessible(page, "main")
  })
})
