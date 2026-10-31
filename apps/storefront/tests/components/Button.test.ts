import { fireEvent, screen } from "@testing-library/vue"
import { renderSuspended } from "@nuxt/test-utils/runtime"
import { describe, expect, it, vi } from "vitest"
import { Button } from "~/components/ui/button"

describe("Button", () => {
  it("renders an accessible button with the slot text", async () => {
    await renderSuspended(Button, { slots: { default: "Comprar" } })

    expect(screen.getByRole("button", { name: "Comprar" })).toBeTruthy()
  })

  it("uses the semantic CTA tokens, never raw colors", async () => {
    await renderSuspended(Button, { props: { variant: "cta" }, slots: { default: "Comprar" } })

    const classes = screen.getByRole("button").className
    expect(classes).toContain("bg-cta")
    expect(classes).toContain("text-cta-foreground")
    expect(classes).not.toMatch(/#[0-9a-f]{3,8}|\[#/i)
  })

  it("keeps a 44 px minimum touch target", async () => {
    await renderSuspended(Button, { slots: { default: "Comprar" } })

    expect(screen.getByRole("button").className).toContain("h-11")
  })

  it("calls the click handler", async () => {
    const onClick = vi.fn()
    await renderSuspended(Button, { attrs: { onClick }, slots: { default: "Comprar" } })

    await fireEvent.click(screen.getByRole("button", { name: "Comprar" }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not react to clicks when disabled", async () => {
    const onClick = vi.fn()
    await renderSuspended(Button, {
      attrs: { onClick, disabled: true },
      slots: { default: "Comprar" },
    })

    await fireEvent.click(screen.getByRole("button", { name: "Comprar" }))

    expect(onClick).not.toHaveBeenCalled()
  })
})
