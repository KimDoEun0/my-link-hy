import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all duration-120 ease-[cubic-bezier(0.22,0.61,0.36,1)] outline-none select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-[oklch(0.522_0.176_257)] active:bg-[oklch(0.476_0.174_259)] shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[oklch(0.930_0.005_248)] active:bg-[oklch(0.874_0.009_248)]",
        outline:
          "border-border bg-card text-foreground hover:bg-secondary active:bg-[oklch(0.930_0.005_248)]",
        ghost:
          "text-primary hover:bg-accent hover:text-accent-foreground active:bg-blue-100",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90 active:opacity-80 shadow-sm",
        link:
          "text-primary underline-offset-4 hover:underline active:opacity-80 p-0 h-auto",
      },
      size: {
        xl: "h-14 px-5 text-[17px] font-bold rounded-2xl gap-2 [&_svg]:size-5",
        lg: "h-12 px-4 text-[17px] font-bold rounded-[14px] gap-2 [&_svg]:size-5",
        default: "h-10 px-3.5 text-[15px] font-semibold rounded-xl gap-1.5 [&_svg]:size-4",
        sm: "h-8 px-2.5 text-[13px] font-semibold rounded-[10px] gap-1 [&_svg]:size-3.5",
        icon: "size-10 rounded-xl [&_svg]:size-4",
        "icon-sm": "size-8 rounded-[10px] [&_svg]:size-3.5",
        "icon-lg": "size-12 rounded-[14px] [&_svg]:size-5",
        "icon-xl": "size-14 rounded-2xl [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
