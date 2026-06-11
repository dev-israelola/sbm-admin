import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium",
  {
    variants: {
      variant: {
        default: "bg-surface-muted text-ink",
        outline: "border border-line text-ink-muted bg-transparent",
        accent: "bg-accent text-accent-ink",
        soft: "bg-accent-soft text-accent",
        success: "bg-success/12 text-success",
        warn: "bg-warn/12 text-warn",
        danger: "bg-danger/10 text-danger",
        info: "bg-info/10 text-info",
        neutral: "bg-ink/8 text-ink",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
