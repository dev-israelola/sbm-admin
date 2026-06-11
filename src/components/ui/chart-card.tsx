import type * as React from "react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function ChartCard({ title, description, actions, children, className, bodyClassName }: ChartCardProps) {
  return (
    <section className={cn("card flex flex-col", className)}>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line/70 px-4 py-4 sm:px-5">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-base text-ink">{title}</h2>
          {description && <p className="text-[12px] text-ink-muted mt-0.5">{description}</p>}
        </div>
        {actions && <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:shrink-0">{actions}</div>}
      </header>
      <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
    </section>
  );
}
