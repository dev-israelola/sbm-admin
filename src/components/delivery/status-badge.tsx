import { Badge } from "@/components/ui/badge";
import type { DeliveryStatus, DeliveryCollectionStatus } from "@/types/delivery";

const MAP: Record<DeliveryStatus, { label: string; variant: any }> = {
  "pending-assignment": { label: "Awaiting assignment", variant: "warn" },
  assigned: { label: "Assigned", variant: "info" },
  "picked-up": { label: "Picked up", variant: "info" },
  "in-transit": { label: "In transit", variant: "info" },
  delivered: { label: "Delivered", variant: "success" },
  "failed-delivery": { label: "Failed", variant: "danger" },
  returned: { label: "Returned", variant: "neutral" },
};

export function DeliveryStatusBadge({ status }: { status: DeliveryStatus }) {
  const cfg = MAP[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

const COLLECTION_MAP: Record<DeliveryCollectionStatus, { label: string; variant: any }> = {
  "not-applicable": { label: "—", variant: "outline" },
  "not-collected": { label: "Not collected", variant: "warn" },
  collected: { label: "Collected", variant: "info" },
  "pending-review": { label: "Pending review", variant: "warn" },
  reconciled: { label: "Reconciled", variant: "success" },
  discrepancy: { label: "Discrepancy", variant: "danger" },
};

export function CollectionStatusBadge({ status }: { status: DeliveryCollectionStatus }) {
  const cfg = COLLECTION_MAP[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
