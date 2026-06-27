import type * as React from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { useDelivery, useUpdateDeliveryStatus } from "@/features/delivery/useDeliveries";
import { paymentMethodShort } from "@/lib/admin-normalizers";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MoneyDisplay } from "@/components/ui/money";
import { DeliveryStatusBadge, CollectionStatusBadge } from "@/components/delivery/status-badge";
import { DeliveryAssignDialog } from "@/components/delivery/DeliveryAssignDialog";
import { PermissionGate } from "@/components/layout/PermissionGate";
import { useAuthStore } from "@/store/auth-store";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatDateTime } from "@/lib/format";
import { PodPaymentCollectionDialog } from "@/components/orders/PodPaymentCollectionDialog";
import type { DeliveryStatus } from "@/types/delivery";

export function DeliveryDetailScreen({ rolePath }: { rolePath: string }) {
  const { id } = useParams();
  const { data: d, isLoading } = useDelivery(id);
  const update = useUpdateDeliveryStatus();
  const user = useAuthStore((s) => s.user);

  const [assignOpen, setAssignOpen] = useState(false);
  const [collectOpen, setCollectOpen] = useState(false);
  const [pendingFail, setPendingFail] = useState(false);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!d) return <p className="text-sm text-ink-muted">Delivery not found.</p>;

  function setStatus(s: DeliveryStatus, label: string, note?: string) {
    update.mutate(
      { id: d!.id, status: s, note },
      { onSuccess: () => toast.success(`Delivery ${d!.orderNumber} → ${label}`) },
    );
  }

  const flow: { label: string; next: DeliveryStatus; show: boolean }[] = [
    { label: "Mark picked up", next: "picked-up", show: d.status === "assigned" },
    { label: "Mark in transit", next: "in-transit", show: d.status === "picked-up" },
    { label: "Mark delivered", next: "delivered", show: d.status === "in-transit" },
    { label: "Mark returned", next: "returned", show: d.status === "failed-delivery" },
  ];

  return (
    <div>
      <Link to={`${rolePath}/delivery`} className="inline-flex items-center gap-1 text-[12px] text-ink-muted hover:text-ink">
        <ChevronLeft className="h-3.5 w-3.5" /> Deliveries
      </Link>

      <header className="mt-3 flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <p className="eyebrow">Delivery</p>
          <h1 className="font-display text-2xl text-ink">{d.orderNumber}</h1>
          <p className="text-[12px] text-ink-muted mt-1">Scheduled {formatDateTime(d.scheduledFor)}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <DeliveryStatusBadge status={d.status} />
          <Badge variant={d.paymentMethod === "paystack" ? "info" : "warn"}>
            {paymentMethodShort(d.paymentMethod)}
          </Badge>
          <CollectionStatusBadge status={d.collectionStatus} />
        </div>
      </header>

      <div className="grid lg:grid-cols-[1.4fr_360px] gap-4">
        <div className="space-y-4">
          <section className="card p-5 space-y-3 text-[13px]">
            <h2 className="font-display text-base text-ink">Delivery details</h2>
            <Detail label="Customer">{d.customerName} <span className="text-ink-muted"><Phone className="h-3 w-3 inline mr-1" />{d.customerPhone}</span></Detail>
            <Detail label="Address"><MapPin className="h-3 w-3 inline mr-1 text-ink-muted" />{d.street}, {d.city}, {d.state}</Detail>
            <Detail label="Type">{d.type === "internal" ? "Internal rider" : "Third-party logistics"}</Detail>
            {d.provider && <Detail label="Provider">{d.provider}</Detail>}
            {d.trackingNumber && <Detail label="Tracking"><span className="font-mono text-[12px]">{d.trackingNumber}</span></Detail>}
            <Detail label="Assignee">{d.assigneeName ?? "Unassigned"}</Detail>
            <Detail label="Delivery fee"><MoneyDisplay value={d.deliveryFee} /></Detail>
            <Detail label="Amount to collect">{d.paymentMethod === "pod" ? <MoneyDisplay value={d.amountToCollect} className="font-medium" /> : "—"}</Detail>
            {d.exceptionNote && <Detail label="Exception"><span className="text-danger italic">"{d.exceptionNote}"</span></Detail>}
            {d.proofFile && <Detail label="Proof of delivery"><span className="font-mono text-[11px] text-ink-muted">{d.proofFile}</span></Detail>}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <PermissionGate
            permission={d.status === "pending-assignment" ? "delivery.view.all" : "delivery.update"}
            fallback={<section className="card p-5 text-[12px] text-ink-muted">You don't have access to update this delivery.</section>}
          >
            <section className="card p-5 space-y-2">
              <h2 className="eyebrow mb-1">Actions</h2>
              {d.status === "pending-assignment" && (
                <Button className="w-full" onClick={() => setAssignOpen(true)}>
                  Assign delivery
                </Button>
              )}
              {flow.filter((f) => f.show).map((f) => (
                <Button key={f.next} className="w-full" variant="outline" onClick={() => setStatus(f.next, f.label)} disabled={update.isPending}>
                  {f.label}
                </Button>
              ))}
              {d.status === "in-transit" && (
                <Button className="w-full" variant="danger" onClick={() => setPendingFail(true)}>
                  Failed delivery
                </Button>
              )}
              {d.paymentMethod === "pod" && d.status === "delivered" && d.collectionStatus !== "reconciled" && d.collectionStatus !== "collected" && (
                <Button className="w-full" onClick={() => setCollectOpen(true)}>
                  Record payment collected
                </Button>
              )}
            </section>
          </PermissionGate>
        </aside>
      </div>

      <DeliveryAssignDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        deliveryId={d.id}
        orderNumber={d.orderNumber}
      />
      <PodPaymentCollectionDialog
        open={collectOpen}
        onOpenChange={setCollectOpen}
        orderId={d.orderId}
        orderNumber={d.orderNumber}
        defaultAmount={d.amountToCollect}
      />
      <ConfirmDialog
        open={pendingFail}
        onOpenChange={setPendingFail}
        title="Mark delivery as failed?"
        description="The customer will be notified. You can mark the package as returned afterwards."
        destructive
        requireNote
        confirmLabel="Mark failed"
        onConfirm={(note) => setStatus("failed-delivery", "failed", note)}
      />
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[150px_1fr] sm:gap-3">
      <dt className="text-ink-muted text-[11px] uppercase tracking-[0.14em]">{label}</dt>
      <dd className="text-ink">{children}</dd>
    </div>
  );
}
