import * as React from "react";
import { Textarea, type TextareaProps } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormTextareaProps extends TextareaProps {
  label: string;
  hint?: string;
  error?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, hint, error, id, className, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <Label htmlFor={inputId}>{label}</Label>
        <Textarea
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          className={cn(error && "border-danger focus-visible:border-danger focus-visible:ring-danger/20")}
          {...props}
        />
        {(hint || error) && (
          <p className={cn("text-[11px]", error ? "text-danger" : "text-ink-muted")}>
            {error || hint}
          </p>
        )}
      </div>
    );
  },
);
FormTextarea.displayName = "FormTextarea";
