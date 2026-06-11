import * as React from "react";
import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps extends InputProps {
  label: string;
  hint?: string;
  error?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, hint, error, id, className, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <Label htmlFor={inputId}>{label}</Label>
        <Input
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
FormInput.displayName = "FormInput";
