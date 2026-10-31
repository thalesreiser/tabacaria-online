import { fireEvent, screen } from "@testing-library/vue"
import { renderSuspended } from "@nuxt/test-utils/runtime"
import { describe, expect, it, vi } from "vitest"
import QuantityStepper from "~/components/QuantityStepper.vue"

const decrease = () => screen.getByRole("button", { name: "Diminuir quantidade" })
const increase = () => screen.getByRole("button", { name: "Aumentar quantidade" })

describe("QuantityStepper", () => {
  it("is a labelled group that shows the current quantity", async () => {
    await renderSuspended(QuantityStepper, { props: { modelValue: 2 } })

    expect(screen.getByRole("group", { name: "Quantidade" })).toBeTruthy()
    expect(screen.getByRole("status").textContent?.trim()).toBe("2")
  })

  it("emits the next value when a button is clicked", async () => {
    const onUpdate = vi.fn()
    await renderSuspended(QuantityStepper, {
      props: { modelValue: 2, "onUpdate:modelValue": onUpdate },
    })

    await fireEvent.click(increase())
    await fireEvent.click(decrease())

    expect(onUpdate).toHaveBeenNthCalledWith(1, 3)
    expect(onUpdate).toHaveBeenNthCalledWith(2, 1)
  })

  it("disables the decrease button at the minimum and never goes below it", async () => {
    const onUpdate = vi.fn()
    await renderSuspended(QuantityStepper, {
      props: { modelValue: 1, "onUpdate:modelValue": onUpdate },
    })

    expect((decrease() as HTMLButtonElement).disabled).toBe(true)
    await fireEvent.click(decrease())

    expect(onUpdate).not.toHaveBeenCalled()
  })

  it("disables the increase button at the maximum and never goes above it", async () => {
    const onUpdate = vi.fn()
    await renderSuspended(QuantityStepper, {
      props: { modelValue: 5, max: 5, "onUpdate:modelValue": onUpdate },
    })

    expect((increase() as HTMLButtonElement).disabled).toBe(true)
    await fireEvent.click(increase())

    expect(onUpdate).not.toHaveBeenCalled()
  })

  it("has no upper limit when max is not set", async () => {
    await renderSuspended(QuantityStepper, { props: { modelValue: 99 } })

    expect((increase() as HTMLButtonElement).disabled).toBe(false)
  })

  it("keeps a 44 px touch target on both buttons", async () => {
    await renderSuspended(QuantityStepper, { props: { modelValue: 2 } })

    expect(decrease().className).toContain("size-11")
    expect(increase().className).toContain("size-11")
  })
})
