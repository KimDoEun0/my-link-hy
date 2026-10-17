import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-[22px] w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-[6px] border border-transparent px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap transition-colors select-none [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground", // TDS brand blue washed
        primary: "bg-primary text-primary-foreground", // Solid blue
        secondary: "bg-secondary text-muted-foreground", // TDS grey-100 + grey-700
        destructive: "bg-[oklch(0.95_0.03_21)] text-destructive dark:bg-destructive/20", // Red washed
        success: "bg-[oklch(0.95_0.04_154)] text-[oklch(0.493_0.143_154)]", // Green washed
        outline: "border-border bg-transparent text-foreground",
        pill: "rounded-full bg-accent text-accent-foreground px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
