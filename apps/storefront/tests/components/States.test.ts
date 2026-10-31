import { fireEvent, screen } from "@testing-library/vue"
import { renderSuspended } from "@nuxt/test-utils/runtime"
import { describe, expect, it, vi } from "vitest"
import EmptyState from "~/components/EmptyState.vue"
import ErrorState from "~/components/ErrorState.vue"
import ProductCardSkeleton from "~/components/ProductCardSkeleton.vue"
import Skeleton from "~/components/Skeleton.vue"

describe("EmptyState", () => {
  it("shows the title, the description and the action slot", async () => {
    await renderSuspended(EmptyState, {
      props: { title: "Nada por aqui ainda", description: "Nenhum produto nesta categoria." },
      slots: { default: "<button>Ver tudo</button>" },
    })

    expect(screen.getByRole("heading", { level: 2, name: "Nada por aqui ainda" })).toBeTruthy()
    expect(screen.getByText("Nenhum produto nesta categoria.")).toBeTruthy()
    expect(screen.getByRole("button", { name: "Ver tudo" })).toBeTruthy()
  })

  it("lets the caller pick the heading level", async () => {
    await renderSuspended(EmptyState, { props: { title: "Vazio", headingLevel: 3 } })

    expect(screen.getByRole("heading", { level: 3, name: "Vazio" })).toBeTruthy()
  })
})

describe("ErrorState", () => {
  it("is announced as an alert with the default copy", async () => {
    await renderSuspended(ErrorState)

    expect(screen.getByRole("alert")).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Não deu para carregar" })).toBeTruthy()
  })

  it("emits retry from the retry button", async () => {
    const onRetry = vi.fn()
    await renderSuspended(ErrorState, { props: { onRetry } })

    await fireEvent.click(screen.getByRole("button", { name: "Tentar de novo" }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it("accepts a custom title and description", async () => {
    await renderSuspended(ErrorState, {
      props: { title: "Sem rede", description: "Confira a conexão." },
    })

    expect(screen.getByRole("heading", { name: "Sem rede" })).toBeTruthy()
    expect(screen.getByText("Confira a conexão.")).toBeTruthy()
  })
})

describe("Skeleton", () => {
  it("is hidden from assistive technology and stops animating for reduced motion", async () => {
    const { container } = await renderSuspended(Skeleton)

    const block = container.querySelector<HTMLElement>('[aria-hidden="true"]')
    expect(block).not.toBeNull()
    expect(block?.className).toContain("motion-reduce:animate-none")
  })

  it("labels the loading product card as busy", async () => {
    await renderSuspended(ProductCardSkeleton)

    const card = screen.getByLabelText("Carregando")
    expect(card.getAttribute("aria-busy")).toBe("true")
  })
})
