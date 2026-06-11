import type * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: LucideIcon;
  trend?: number; // -100..100
  tone?: "default" | "accent" | "warn" | "danger" | "success" | "info";
  loading?: boolean;
  className?: string;
}

export function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  tone = "default",
  loading,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "card p-4 sm:p-5 flex flex-col gap-3 transition-colors",
        tone === "accent" && "bg-accent text-accent-ink border-accent",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p
          className={cn(
            "text-[11px] uppercase tracking-[0.14em]",
            tone === "accent" ? "opacity-80" : "text-ink-muted",
          )}
        >
          {label}
        </p>
        {Icon && (
          <span
            className={cn(
              "grid place-items-center h-7 w-7 rounded-md",
              tone === "accent" ? "bg-accent-ink/15 text-accent-ink" : "bg-surface-muted text-ink-muted",
              tone === "warn" && "bg-warn/12 text-warn",
              tone === "danger" && "bg-danger/10 text-danger",
              tone === "success" && "bg-success/12 text-success",
              tone === "info" && "bg-info/10 text-info",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      {loading ? (
        <Skeleton className="h-7 w-2/3" />
      ) : (
        <p className={cn("font-display text-2xl tracking-tight tabular-nums", tone === "accent" ? "text-accent-ink" : "text-ink")}>{value}</p>
      )}
      {sub !== undefined && (
        <p
          className={cn(
            "text-[12px]",
            tone === "accent" ? "text-accent-ink/90" : "text-ink-muted",
          )}
        >
          {sub}
        </p>
      )}
      {trend !== undefined && (
        <p
          className={cn(
            "text-[11px] font-medium tabular-nums",
            trend >= 0 ? "text-success" : "text-danger",
          )}
        >
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend).toFixed(1)}%{" "}
          <span className="text-ink-muted font-normal">vs previous</span>
        </p>
      )}
    </div>
  );
}
