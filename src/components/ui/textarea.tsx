import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-base text-ink leading-relaxed placeholder:text-ink-muted/70 sm:text-sm",
        "transition-colors focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30",
        "min-h-[90px]",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
