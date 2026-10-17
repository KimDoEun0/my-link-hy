import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-xl border border-border bg-secondary px-4 py-2 text-[15px] text-foreground transition-all duration-120 outline-none",
        "placeholder:text-muted-foreground/60",
        "focus-visible:border-primary focus-visible:bg-card focus-visible:ring-1 focus-visible:ring-primary",
        "disabled:pointer-events-none disabled:opacity-30",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }
