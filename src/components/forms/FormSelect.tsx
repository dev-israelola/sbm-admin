import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  hint?: string;
  error?: string;
  className?: string;
  id?: string;
}

export function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select…",
  hint,
  error,
  className,
  id,
}: FormSelectProps) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Label htmlFor={inputId}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={inputId} aria-invalid={!!error} className={cn(error && "border-danger")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {(hint || error) && (
        <p className={cn("text-[11px]", error ? "text-danger" : "text-ink-muted")}>
          {error || hint}
        </p>
      )}
    </div>
  );
}
