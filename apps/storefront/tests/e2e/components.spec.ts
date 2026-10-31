import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { mockNetwork } from "./support/mock-network"

// Every section of /_componentes is one component in all its states. Keep this list in sync with
// the page: the last test fails when a section has no accessibility check.
const components = [
  "price",
  "stock-badge",
  "quantity-stepper",
  "button",
  "product-card",
  "product-card-skeleton",
  "empty-state",
  "error-state",
]

test.describe("component gallery", () => {
  test.beforeEach(async ({ page }) => {
    await mockNetwork(page)
    await page.goto("/_componentes")
  })

  test("is available in preview and every section is covered below", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Componentes base" })).toBeVisible()

    const sections = await page
      .locator("[data-component]")
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-component")))
    expect(sections).toEqual(components)
  })

  for (const name of components) {
    test(`${name} has no accessibility violations, contrast included`, async ({ page }) => {
      const results = await new AxeBuilder({ page }).include(`[data-component="${name}"]`).analyze()

      const summary = results.violations.map((violation) => ({
        rule: violation.id,
        impact: violation.impact,
        targets: violation.nodes.map((node) => node.target.join(" ")),
      }))
      expect(summary).toEqual([])

      // axe skips what it cannot measure, so prove that the contrast rule really ran on the text.
      if (name !== "product-card-skeleton") {
        expect(results.passes.map((rule) => rule.id)).toContain("color-contrast")
      }
      expect(results.incomplete.map((rule) => rule.id)).not.toContain("color-contrast")
    })
  }

  test("the quantity stepper changes the value and stops at the limits", async ({ page }) => {
    const stepper = page.locator('[data-component="quantity-stepper"] [role="group"]').nth(2)

    await expect(stepper.getByRole("status")).toHaveText("5")
    await expect(stepper.getByRole("button", { name: "Aumentar quantidade" })).toBeDisabled()

    await stepper.getByRole("button", { name: "Diminuir quantidade" }).click()
    await expect(stepper.getByRole("status")).toHaveText("4")
    await expect(stepper.getByRole("button", { name: "Aumentar quantidade" })).toBeEnabled()
  })

  test("every control shows a visible outline when reached with the keyboard", async ({ page }) => {
    const controls = await page.locator("main a[href], main button:not([disabled])").count()
    expect(controls).toBeGreaterThan(0)

    // Tab through the whole page and record the outline of each control inside <main>.
    const outlines: { label: string; style: string; width: string }[] = []
    for (let i = 0; i < controls + 6 && outlines.length < controls; i++) {
      await page.keyboard.press("Tab")
      const info = await page.evaluate(() => {
        const el = document.activeElement
        if (!el || !el.closest("main")) return null
        const style = getComputedStyle(el)
        return {
          label: (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 30),
          style: style.outlineStyle,
          width: style.outlineWidth,
        }
      })
      if (info) outlines.push(info)
    }

    expect(outlines).toHaveLength(controls)
    const hidden = outlines.filter((o) => o.style === "none" || o.width === "0px")
    expect(hidden, "controls without a visible focus outline").toEqual([])
  })

  test("a sold-out product cannot be added", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Indisponível" })).toBeDisabled()
  })
})
