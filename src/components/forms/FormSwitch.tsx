import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  id?: string;
  className?: string;
}

export function FormSwitch({
  label,
  description,
  checked,
  onCheckedChange,
  id,
  className,
}: FormSwitchProps) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  return (
    <div className={cn("flex items-start justify-between gap-3 py-2", className)}>
      <div>
        <Label htmlFor={inputId} className="text-sm">{label}</Label>
        {description && <p className="text-[12px] text-ink-muted mt-0.5 max-w-md">{description}</p>}
      </div>
      <Switch id={inputId} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
