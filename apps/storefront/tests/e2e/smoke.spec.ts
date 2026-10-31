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

  test("the header logo is 96 px on wide screens and 64 px on phones", async ({ page }) => {
    const logo = page.getByRole("banner").getByRole("img", { name: "Stray Dog Tabacaria" })

    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto("/")
    expect((await logo.boundingBox())?.width).toBe(96)

    await page.setViewportSize({ width: 360, height: 740 })
    expect((await logo.boundingBox())?.width).toBe(64)
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
