import * as React from "react";
import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps extends InputProps {
  label: string;
  hint?: string;
  error?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, hint, error, id, className, type, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    const [showPassword, setShowPassword] = React.useState(false);
    
    const isPassword = type === "password";
    const currentType = isPassword && showPassword ? "text" : type;

    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <Label htmlFor={inputId}>{label}</Label>
        <div className="relative">
          <Input
            id={inputId}
            ref={ref}
            type={currentType}
            aria-invalid={!!error}
            className={cn(error && "border-danger focus-visible:border-danger focus-visible:ring-danger/20", isPassword && "pr-10")}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
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
