import { screen } from "@testing-library/vue"
import { renderSuspended } from "@nuxt/test-utils/runtime"
import { describe, expect, it } from "vitest"
import { createError } from "#app"
import ErrorPage from "~/error.vue"

function errorProps(statusCode: number) {
  return { error: createError({ statusCode, fatal: true }) }
}

describe("error page", () => {
  it("shows the not found copy for a 404", async () => {
    await renderSuspended(ErrorPage, { props: errorProps(404) })

    expect(screen.getByRole("heading", { level: 1, name: "Página não encontrada" })).toBeTruthy()
    expect(screen.getByText("404")).toBeTruthy()
  })

  it("shows the generic server copy for a 500", async () => {
    await renderSuspended(ErrorPage, { props: errorProps(500) })

    expect(screen.getByRole("heading", { level: 1, name: "Algo deu errado" })).toBeTruthy()
    expect(screen.getByText("500")).toBeTruthy()
  })

  it("offers a way back to the home page", async () => {
    await renderSuspended(ErrorPage, { props: errorProps(404) })

    expect(screen.getByRole("button", { name: "Voltar para o início" })).toBeTruthy()
  })
})
