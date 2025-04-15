
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-vibrant-green to-light-green text-white",
        secondary:
          "border-transparent bg-gradient-to-r from-cambridge-blue to-tea-green text-oxford-blue",
        destructive:
          "border-transparent bg-gradient-to-r from-destructive to-destructive/80 text-white",
        outline: "text-foreground border-cambridge-blue/30",
        success: "border-transparent bg-gradient-to-r from-success-green to-light-green text-white",
        info: "border-transparent bg-gradient-to-r from-chart-blue to-chart-blue/80 text-white",
        warning: "border-transparent bg-gradient-to-r from-chart-orange to-chart-orange/80 text-white",
        premium: "border-transparent bg-gradient-to-r from-chart-purple to-chart-pink/80 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
