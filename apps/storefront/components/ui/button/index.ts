import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

// Sizes keep a 44 px minimum touch target (storefront CLAUDE.md).
export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-[transform,box-shadow,background-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Style A (ADR 0004): 2 px outline and a hard shadow that shrinks on hover.
        default:
          "border-2 border-foreground bg-primary text-primary-foreground shadow-hard-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:shadow-none",
        cta: "border-2 border-foreground bg-cta text-cta-foreground shadow-hard-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:shadow-none",
        destructive:
          "border-2 border-foreground bg-destructive text-destructive-foreground shadow-hard-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:shadow-none",
        outline:
          "border-2 border-foreground bg-background text-foreground shadow-hard-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:shadow-none",
        secondary:
          "border-2 border-foreground bg-secondary text-secondary-foreground shadow-hard-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:shadow-none",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        lg: "h-12 px-8 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
