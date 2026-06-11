import type * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("card flex flex-col items-center text-center gap-2 py-12 px-6", className)}>
      {Icon && (
        <div className="grid place-items-center h-9 w-9 rounded-full bg-surface-muted text-ink-muted mb-1">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <h3 className="font-display text-base text-ink">{title}</h3>
      {description && <p className="text-sm text-ink-muted max-w-md leading-relaxed">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
