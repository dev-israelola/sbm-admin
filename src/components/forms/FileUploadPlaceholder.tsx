import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { uploadFile, type UploadKind } from "@/lib/uploads";

interface FileUploadPlaceholderProps {
  label: string;
  hint?: string;
  className?: string;
  onFileSelected?: (name: string) => void;
  onUploaded?: (url: string) => void;
  uploadKind?: UploadKind;
}

export function FileUploadPlaceholder({
  label,
  hint,
  className,
  onFileSelected,
  onUploaded,
  uploadKind = "OTHER",
}: FileUploadPlaceholderProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label>{label}</Label>
      <label className="flex items-center gap-3 rounded-lg border border-dashed border-line bg-surface-muted/50 px-3 py-3 cursor-pointer transition-colors hover:bg-surface-muted">
        <span className="grid place-items-center h-8 w-8 rounded-md bg-surface border border-line text-ink-muted">
          <Upload className="h-3.5 w-3.5" />
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-sm text-ink">{fileName ?? "Tap to upload"}</span>
          {hint && <span className="text-[11px] text-ink-muted">{hint}</span>}
        </span>
        <input
          type="file"
          className="sr-only"
          accept="image/*,application/pdf"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) {
              setBusy(true);
              try {
                const uploaded = await uploadFile(f, uploadKind);
                setFileName(f.name);
                onFileSelected?.(f.name);
                onUploaded?.(uploaded.url);
              } catch (error) {
                toast.error(`Could not upload ${f.name}.`, {
                  description: error instanceof Error ? error.message : undefined,
                });
              } finally {
                setBusy(false);
                e.currentTarget.value = "";
              }
            }
          }}
        />
        {busy && <span className="ml-auto text-[11px] text-ink-muted">Uploading...</span>}
      </label>
    </div>
  );
}
