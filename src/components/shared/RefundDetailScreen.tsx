import type * as React from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, FileText } from "lucide-react";
import { toast } from "sonner";
import { useRefund, useDecideRefund } from "@/features/refunds/useRefunds";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { MoneyDisplay } from "@/components/ui/money";
import { RefundStatusBadge } from "@/components/refunds/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PermissionGate } from "@/components/layout/PermissionGate";
import { useAuthStore } from "@/store/auth-store";
import { formatDateTime } from "@/lib/format";

export function RefundDetailScreen({ rolePath }: { rolePath: string }) {
  const { id } = useParams();
  const { data: refund, isLoading } = useRefund(id);
  const user = useAuthStore((s) => s.user);
  const decide = useDecideRefund();
  const [pending, setPending] = useState<"approve" | "reject" | "refund" | "partial" | null>(null);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!refund) return <p className="text-sm text-ink-muted">Refund not found.</p>;

  async function commit(decision: NonNullable<typeof pending>, note: string) {
    await decide.mutateAsync({ id: refund!.id, decision, note, by: user?.fullName ?? "Admin" });
    toast.success(`Refund ${refund!.orderNumber} marked as ${decision}.`);
  }

  return (
    <div>
      <Link to={`${rolePath}/refunds`} className="inline-flex items-center gap-1 text-[12px] text-ink-muted hover:text-ink">
        <ChevronLeft className="h-3.5 w-3.5" /> Refunds
      </Link>

      <header className="mt-3 flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <p className="eyebrow">Refund request</p>
          <h1 className="font-display text-2xl text-ink">{refund.orderNumber}</h1>
          <p className="text-[12px] text-ink-muted mt-1">Submitted {formatDateTime(refund.createdAt)}</p>
        </div>
        <RefundStatusBadge status={refund.status} />
      </header>

      <div className="grid lg:grid-cols-[1.4fr_360px] gap-4">
        <div className="space-y-4">
          <section className="card p-5 space-y-3 text-[13px]">
            <h2 className="font-display text-base text-ink">Request</h2>
            <Detail label="Customer">{refund.customerName} <span className="text-ink-muted">({refund.customerEmail})</span></Detail>
            <Detail label="Order">
              <Link to={`${rolePath}/orders/${refund.orderId}`} className="text-accent hover:underline">{refund.orderNumber}</Link>
            </Detail>
            <Detail label="Product">{refund.productName}</Detail>
            <Detail label="Reason">{refund.reason}</Detail>
            <Detail label="Preferred resolution">{refund.preferredResolution}</Detail>
            <Detail label="Amount"><MoneyDisplay value={refund.amount} className="font-medium" /></Detail>
            <Detail label="Description"><span className="text-ink-muted">{refund.description}</span></Detail>
          </section>

          <section className="card p-5">
            <h2 className="font-display text-base text-ink mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-ink-muted" /> Evidence
            </h2>
            {refund.evidenceFile ? (
              <div className="rounded-md border border-line/70 px-3 py-2 text-[12px] text-ink">{refund.evidenceFile}</div>
            ) : (
              <p className="text-[12px] text-ink-muted">No evidence uploaded by the customer.</p>
            )}
          </section>

          <section className="card p-5 text-[13px] space-y-2">
            <h2 className="font-display text-base text-ink mb-1">Impact preview</h2>
            <p className="text-ink-muted">If approved & refunded, this will:</p>
            <ul className="list-disc pl-5 text-ink-muted leading-relaxed space-y-1">
              <li>Reduce accounting revenue by <MoneyDisplay value={refund.amount} className="text-ink" /></li>
              <li>Reverse the customer's reward points earned for this order</li>
              <li>Move returned items back to <strong>available stock</strong>, damaged items to <strong>damaged stock</strong></li>
            </ul>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <PermissionGate
            permission="refunds.decide"
            fallback={
              <section className="card p-5 text-[12px] text-ink-muted">
                You don't have permission to decide refunds.
              </section>
            }
          >
            <section className="card p-5 space-y-2">
              <h2 className="eyebrow mb-2">Decision</h2>
              <Button className="w-full" onClick={() => setPending("approve")} disabled={refund.status !== "submitted" && refund.status !== "under-review"}>
                Approve refund
              </Button>
              <Button className="w-full" variant="outline" onClick={() => setPending("partial")} disabled={refund.status === "refunded"}>
                Partial refund
              </Button>
              <Button className="w-full" variant="success" onClick={() => setPending("refund")} disabled={refund.status === "refunded"}>
                Mark refunded
              </Button>
              <Button className="w-full" variant="danger" onClick={() => setPending("reject")} disabled={refund.status === "rejected"}>
                Reject refund
              </Button>
              {refund.decisionNote && (
                <p className="text-[11px] text-ink-muted leading-relaxed mt-2 italic">"{refund.decisionNote}"</p>
              )}
            </section>
          </PermissionGate>
        </aside>
      </div>

      <ConfirmDialog
        open={!!pending}
        onOpenChange={(v) => !v && setPending(null)}
        title={
          pending === "approve" ? "Approve refund?" :
          pending === "reject" ? "Reject refund?" :
          pending === "refund" ? "Mark as refunded?" :
          "Issue partial refund?"
        }
        description={
          pending === "approve" ? "The customer will be notified the refund is approved." :
          pending === "reject" ? "The customer will be notified with the rejection reason." :
          pending === "refund" ? "Confirms the refund has been processed. Reward points will be reversed." :
          "Refund a portion of the order — specify amount in the note."
        }
        destructive={pending === "reject"}
        requireNote
        confirmLabel={
          pending === "approve" ? "Approve" :
          pending === "reject" ? "Reject" :
          pending === "refund" ? "Mark refunded" :
          "Mark partial"
        }
        onConfirm={(note) => commit(pending!, note ?? "")}
      />
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[120px_1fr] sm:gap-3">
      <dt className="text-ink-muted text-[12px] uppercase tracking-[0.12em]">{label}</dt>
      <dd className="text-ink">{children}</dd>
    </div>
  );
}
