import { expect, test } from "@playwright/test"
import { mockNetwork } from "./support/mock-network"

test.describe("smoke", () => {
  test("home shows the logo, the title and the footer", async ({ page }) => {
    const network = await mockNetwork(page)

    await page.goto("/")

    await expect(page).toHaveTitle(/Stray Dog Tabacaria/)
    await expect(page.getByRole("img", { name: "Stray Dog Tabacaria" })).toBeVisible()
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Stray Dog Tabacaria")
    await expect(page.getByRole("contentinfo", { name: "Rodapé" })).toBeVisible()
    network.assertNoUnmockedCalls()
  })

  test("unknown route shows the 404 page and goes back home", async ({ page }) => {
    await mockNetwork(page)

    const response = await page.goto("/rota-que-nao-existe")

    expect(response?.status()).toBe(404)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Página não encontrada")

    await page.getByRole("button", { name: "Voltar para o início" }).click()
    await expect(page).toHaveURL("/")
  })

  test("the first Tab stop is the skip link", async ({ page }) => {
    await mockNetwork(page)
    await page.goto("/")

    await page.keyboard.press("Tab")

    await expect(page.getByRole("link", { name: "Ir para o conteúdo" })).toBeFocused()
  })
})
