import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  requireNote?: boolean;
  noteLabel?: string;
  onConfirm: (note?: string) => void | Promise<void>;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive,
  requireNote,
  noteLabel = "Reason / note",
  onConfirm,
}: ConfirmDialogProps) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function commit() {
    if (requireNote && !note.trim()) return;
    setBusy(true);
    try {
      await onConfirm(requireNote ? note.trim() : undefined);
      setNote("");
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !busy && onOpenChange(v)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {requireNote && (
          <div className="space-y-1.5">
            <Label htmlFor="confirm-note">{noteLabel}</Label>
            <Textarea
              id="confirm-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Provide context for the audit trail…"
              required
            />
            <p className="text-[11px] text-ink-muted">
              Required for audit. This will be saved with the action.
            </p>
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? "danger" : "primary"}
            onClick={commit}
            disabled={busy || (requireNote && !note.trim())}
          >
            {busy ? "Working…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
