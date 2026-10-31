import { screen } from "@testing-library/vue"
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime"
import { beforeEach, describe, expect, it, vi } from "vitest"
import AppFooter from "~/components/AppFooter.vue"
import type { PublicRuntimeConfig } from "~~/shared/schemas/runtime-config"

type Store = PublicRuntimeConfig["store"]

const emptyStore: Store = { legalName: "", cnpj: "", address: "", support: "", minorsNotice: "" }
const state = vi.hoisted((): { store: Store } => ({
  store: { legalName: "", cnpj: "", address: "", support: "", minorsNotice: "" },
}))

// Keep the real runtime config (the router plugin reads app.baseURL) and replace only the store.
mockNuxtImport<typeof useRuntimeConfig>("useRuntimeConfig", (original) => () => {
  const config = original()
  return { ...config, public: { ...config.public, store: state.store } }
})

beforeEach(() => {
  state.store = { ...emptyStore }
})

describe("AppFooter", () => {
  it("shows only the copyright when no legal data is configured", async () => {
    await renderSuspended(AppFooter)

    expect(screen.getByText(/Stray Dog Tabacaria/)).toBeTruthy()
    expect(screen.queryByText("CNPJ:")).toBeNull()
    expect(screen.queryByText("Endereço:")).toBeNull()
    expect(screen.queryByText("Atendimento:")).toBeNull()
  })

  it("shows the legal fields that were provided and hides the empty ones", async () => {
    state.store = { ...emptyStore, cnpj: "00.000.000/0001-00", support: "ajuda@exemplo.com" }

    await renderSuspended(AppFooter)

    expect(screen.getByText("CNPJ:")).toBeTruthy()
    expect(screen.getByText("00.000.000/0001-00")).toBeTruthy()
    expect(screen.getByText("ajuda@exemplo.com")).toBeTruthy()
    expect(screen.queryByText("Endereço:")).toBeNull()
  })

  it("shows the notice for minors only when it is provided", async () => {
    state.store = { ...emptyStore, minorsNotice: "Aviso de teste" }

    await renderSuspended(AppFooter)

    expect(screen.getByText("Aviso de teste")).toBeTruthy()
  })

  it("is exposed as a labelled footer landmark", async () => {
    await renderSuspended(AppFooter)

    expect(screen.getByRole("contentinfo", { name: "Rodapé" })).toBeTruthy()
  })
})
