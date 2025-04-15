
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const statCardVariants = cva(
  "flex flex-col p-6 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-l-4 border-l-oxford-blue bg-gradient-to-br from-white to-tea-green/30",
        success: "border-l-4 border-l-olivine bg-gradient-to-br from-white to-olivine/20",
        danger: "border-l-4 border-l-alert-red bg-gradient-to-br from-white to-pink-50",
        info: "border-l-4 border-l-cambridge-blue bg-gradient-to-br from-white to-cambridge-blue/20",
        premium: "border-none bg-gradient-to-br from-white via-tea-green/20 to-white",
      },
      size: {
        default: "p-6",
        sm: "p-4",
      },
    },
    defaultVariants: {
      variant: "premium",
      size: "default",
    },
  }
);

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  description?: string; // Added description as an optional property
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isUpward: boolean;
  };
  footer?: React.ReactNode;
}

const StatCard = ({
  className,
  variant,
  size,
  title,
  value,
  description,
  icon,
  trend,
  footer,
  ...props
}: StatCardProps) => {
  return (
    <Card
      className={cn("hover:shadow-lg hover:-translate-y-1 backdrop-blur-sm transition-all", className)}
      {...props}
    >
      <div className={cn(statCardVariants({ variant, size, className }))}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-charcoal mb-1">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-oxford-blue tracking-tight">{value}</h3>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          {icon && (
            <div className="text-cambridge-blue p-3 rounded-lg bg-gradient-to-br from-cambridge-blue/10 to-olivine/5 backdrop-blur-sm shadow-sm">
              {icon}
            </div>
          )}
        </div>
        
        {trend && (
          <div className="flex items-center mt-1">
            <span
              className={cn(
                "text-xs font-medium flex items-center gap-1 px-2 py-1 rounded-full",
                trend.isUpward 
                  ? "text-olivine bg-gradient-to-r from-olivine/10 to-tea-green/5" 
                  : "text-destructive bg-gradient-to-r from-destructive/10 to-destructive/5"
              )}
            >
              {trend.isUpward ? "↑" : "↓"} {trend.value}%
              <span className="text-xs text-charcoal">vs last month</span>
            </span>
          </div>
        )}
        
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </Card>
  );
};

export default StatCard;
