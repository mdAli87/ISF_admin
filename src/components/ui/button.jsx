
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "relative overflow-hidden bg-gradient-to-r from-vibrant-green to-light-green text-white hover:shadow-lg hover:shadow-vibrant-green/20 hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "relative overflow-hidden bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground hover:shadow-lg hover:shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border border-input bg-background hover:bg-accent/10 hover:text-accent-foreground hover:border-accent hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-gradient-to-r from-cambridge-blue/80 to-tea-green/90 text-oxford-blue hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "relative overflow-hidden bg-gradient-to-r from-success-green to-light-green text-white hover:shadow-lg hover:shadow-success-green/20 hover:scale-[1.02] active:scale-[0.98]",
        premium: "relative overflow-hidden bg-gradient-to-r from-vibrant-green to-emerald-green text-white hover:shadow-lg hover:shadow-success-green/20 hover:scale-[1.02] active:scale-[0.98]",
        accent: "relative overflow-hidden bg-gradient-to-r from-cambridge-blue to-tea-green text-oxford-blue hover:shadow-lg hover:shadow-cambridge-blue/20 hover:scale-[1.02] active:scale-[0.98]",
        creative: "relative overflow-hidden bg-gradient-to-r from-chart-blue to-chart-purple/80 text-white hover:shadow-lg hover:shadow-chart-blue/20 hover:scale-[1.02] active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      animation: {
        none: "",
        shine: "before:absolute before:content-[''] before:top-0 before:left-0 before:w-full before:h-full before:bg-white/10 before:transform before:-skew-x-12 before:-translate-x-full hover:before:translate-x-[110%] before:transition-transform before:duration-700",
        pulse: "animate-pulse-green",
        glow: "animate-glow",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "shine",
    },
  }
)

const Button = React.forwardRef(
  ({ className, variant, size, animation, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
