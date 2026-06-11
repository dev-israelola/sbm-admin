import { Badge } from "@/components/ui/badge";
import type { RefundStatus } from "@/types/refund";

const MAP: Record<RefundStatus, { label: string; variant: any }> = {
  submitted: { label: "Submitted", variant: "warn" },
  "under-review": { label: "Under review", variant: "warn" },
  approved: { label: "Approved", variant: "info" },
  rejected: { label: "Rejected", variant: "danger" },
  refunded: { label: "Refunded", variant: "success" },
  "partially-refunded": { label: "Partial refund", variant: "neutral" },
};

export function RefundStatusBadge({ status }: { status: RefundStatus }) {
  const cfg = MAP[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
