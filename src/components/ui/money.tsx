import type * as React from "react";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MoneyDisplayProps {
  value: number;
  className?: string;
  tone?: "default" | "positive" | "negative" | "muted";
  size?: "sm" | "md" | "lg";
}

export function MoneyDisplay({ value, className, tone = "default", size = "md" }: MoneyDisplayProps) {
  return (
    <span
      className={cn(
        "tabular-nums",
        size === "sm" && "text-[13px]",
        size === "md" && "text-sm",
        size === "lg" && "font-display text-lg",
        tone === "positive" && "text-success",
        tone === "negative" && "text-danger",
        tone === "muted" && "text-ink-muted",
        className,
      )}
    >
      {value < 0 ? `-${formatNaira(Math.abs(value))}` : formatNaira(value)}
    </span>
  );
}
