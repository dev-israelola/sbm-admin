import type * as React from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  CreditCard,
  Banknote,
  ShieldCheck,
  Truck,
  Check,
  X,
  ReceiptText,
  MessageCircle,
  ClipboardCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useOrder, useUpdateOrderStatus, useAddOrderNote, useReconcileOrder, useConfirmBankTransfer } from "@/features/orders/useOrders";
import { paymentMethodLabel } from "@/lib/admin-normalizers";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MoneyDisplay } from "@/components/ui/money";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { OrderStatusBadge, PaymentStatusBadge, ORDER_STATUS_COPY } from "@/components/orders/status-badges";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { PodVerificationDialog } from "@/components/orders/PodVerificationDialog";
import { PodPaymentCollectionDialog } from "@/components/orders/PodPaymentCollectionDialog";
import { DeliveryAssignDialog } from "@/components/delivery/DeliveryAssignDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormInput } from "@/components/forms/FormInput";
import { PermissionGate } from "@/components/layout/PermissionGate";
import { can } from "@/lib/permissions";
import { formatDate, formatDateTime, formatNaira } from "@/lib/format";
import type { OrderStatus } from "@/types/order";

interface Props {
  rolePath: string;
}

export function OrderDetailScreen({ rolePath }: Props) {
  const { id } = useParams();
  const { data: order, isLoading } = useOrder(id);
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? null;

  const updateStatus = useUpdateOrderStatus();
  const addNote = useAddOrderNote();
  const reconcile = useReconcileOrder();
  const confirmTransfer = useConfirmBankTransfer();

  const [verifyOpen, setVerifyOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [collectOpen, setCollectOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reconcileOpen, setReconcileOpen] = useState<"reconciled" | "discrepancy" | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferRef, setTransferRef] = useState("");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid lg:grid-cols-3 gap-4">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="card p-8 text-center text-sm text-ink-muted">
        Order not found.
        <Button asChild className="block mx-auto mt-4">
          <Link to={`${rolePath}/orders`}>Back to orders</Link>
        </Button>
      </div>
    );
  }

  const isPOD = order.paymentMethod === "pod";
  const isPaystack = order.paymentMethod === "paystack";
  const isBankTransfer = order.paymentMethod === "bank_transfer";

  const isPickup = order.deliveryMethod === "pickup";
  const deliveryAssigned = Boolean(order.delivery?.assigneeId || order.delivery?.provider);

  const advanceFlow: { label: string; next: OrderStatus; show: boolean; disabled?: boolean }[] = [
    { label: "Mark verified", next: "verified", show: isPOD && order.status === "pending-verification" },
    { label: "Mark packed", next: "packed", show: ["verified", "pending-fulfillment", "payment-confirmed"].includes(order.status) },
    // Pickup-station path
    { label: "Mark ready for pickup", next: "ready-for-pickup", show: isPickup && order.status === "packed" },
    { label: "Mark picked up", next: "picked-up", show: isPickup && order.status === "ready-for-pickup" },
    // Home-delivery path (dispatch is gated on an assigned shipment)
    {
      label: deliveryAssigned ? "Ready for dispatch" : "Assign a rider to dispatch",
      next: "ready-for-dispatch",
      show: !isPickup && order.status === "packed",
      disabled: !deliveryAssigned,
    },
    { label: "Mark in transit", next: "in-transit", show: !isPickup && order.status === "ready-for-dispatch" },
    { label: "Mark delivered", next: "delivered", show: !isPickup && order.status === "in-transit" },
    // Completion (both paths)
    { label: "Complete order", next: "completed", show: ["delivered", "picked-up"].includes(order.status) && (isPaystack || isBankTransfer) },
  ];

  function transition(status: OrderStatus, label: string) {
    if (!can(role, "orders.update")) return;
    updateStatus.mutate(
      { id: order!.id, status, by: user?.fullName ?? "Admin" },
      {
        onSuccess: () => toast.success(`${order!.number} → ${label}`),
      },
    );
  }

  function postNote() {
    if (!noteDraft.trim()) return;
    addNote.mutate(
      { id: order!.id, body: noteDraft.trim(), by: user?.fullName ?? "Admin" },
      {
        onSuccess: () => {
          toast.success("Note added.");
          setNoteDraft("");
        },
      },
    );
  }

  return (
    <div>
      <Link to={`${rolePath}/orders`} className="inline-flex items-center gap-1 text-[12px] text-ink-muted hover:text-ink">
        <ChevronLeft className="h-3.5 w-3.5" /> Orders
      </Link>

      <header className="mt-3 flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <p className="eyebrow">Order</p>
          <h1 className="font-display text-2xl text-ink leading-tight">{order.number}</h1>
          <p className="text-[12px] text-ink-muted mt-1">
            Created {formatDateTime(order.createdAt)} · {order.deliveryMethod === "pickup" ? "Pickup station" : "Home delivery"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
          <Badge variant={order.paymentMethod === "paystack" ? "info" : "warn"}>
            {paymentMethodLabel(order.paymentMethod)}
          </Badge>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1.6fr_360px] gap-4">
        <div className="space-y-4 min-w-0">
          {/* Items */}
          <section className="card p-5">
            <h2 className="font-display text-base text-ink mb-3">Items</h2>
            <ul className="divide-y divide-line/60">
              {order.items.map((it) => (
                <li key={it.productId} className="flex items-start gap-3 py-3">
                  <img src={it.image} alt="" className="h-12 w-12 rounded-md object-cover bg-surface-muted" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-ink font-medium">{it.name}</p>
                    <p className="text-[11px] text-ink-muted">
                      SKU {it.sku} · {it.brand}
                    </p>
                  </div>
                  <div className="text-right">
                    <MoneyDisplay value={it.subtotal} className="font-medium" />
                    <p className="text-[11px] text-ink-muted">{it.quantity} × {formatNaira(it.unitPrice)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Separator className="my-4" />
            <dl className="ml-auto grid w-full max-w-md grid-cols-[minmax(0,1fr)_auto] gap-y-2 text-[13px]">
              <dt className="text-ink-muted">Subtotal</dt>
              <dd className="text-right tabular-nums">{formatNaira(order.subtotal)}</dd>
              <dt className="text-ink-muted">Delivery</dt>
              <dd className="text-right tabular-nums">{order.deliveryFee === 0 ? "Free" : formatNaira(order.deliveryFee)}</dd>
              {order.discount > 0 && (<><dt className="text-ink-muted">Discount</dt><dd className="text-right tabular-nums">-{formatNaira(order.discount)}</dd></>)}
              {order.pointsApplied > 0 && (<><dt className="text-ink-muted">Reward points</dt><dd className="text-right tabular-nums">-{formatNaira(order.pointsValue)}</dd></>)}
              <dt className="text-ink-muted font-medium pt-2 border-t border-line/70 col-span-2 mt-1" />
              <dt className="text-ink-muted font-medium">Total</dt>
              <dd className="text-right font-display text-lg tabular-nums">{formatNaira(order.total)}</dd>
              <dt className="text-ink-muted">Cost of goods</dt>
              <dd className="text-right tabular-nums text-ink-muted">{formatNaira(order.costOfGoods)}</dd>
              <dt className="text-ink-muted">Estimated profit</dt>
              <dd className={`text-right tabular-nums font-medium ${order.estimatedProfit >= 0 ? "text-success" : "text-danger"}`}>
                {formatNaira(order.estimatedProfit)}
              </dd>
            </dl>
          </section>

          {/* Payment */}
          <section className="card p-5">
            <h2 className="font-display text-base text-ink mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-ink-muted" /> Payment
            </h2>
            {isPaystack && order.paystackPayment && (
              <dl className="grid gap-3 text-[13px] sm:grid-cols-2">
                <Info label="Reference">{order.paystackPayment.reference}</Info>
                <Info label="Amount">{formatNaira(order.paystackPayment.amount)}</Info>
                <Info label="Paid at">{formatDateTime(order.paystackPayment.paidAt)}</Info>
                <Info label="Gateway fee" tone="muted">{formatNaira(order.paystackPayment.gatewayFee)}</Info>
                <Info label="Settlement">
                  <Badge variant={order.paystackPayment.settlementStatus === "settled" ? "success" : "warn"}>
                    {order.paystackPayment.settlementStatus}
                  </Badge>
                </Info>
                <Info label="Customer email">{order.paystackPayment.email}</Info>
              </dl>
            )}
            {isPOD && (
              <div className="space-y-3 text-[13px]">
                {order.podCollection ? (
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <Info label="Collected">{formatNaira(order.podCollection.amount)}</Info>
                    <Info label="Method">{order.podCollection.method.replace("-", " ")}</Info>
                    <Info label="Collected by">{order.podCollection.collectedBy}</Info>
                    <Info label="Reference" tone="muted">{order.podCollection.reference ?? "—"}</Info>
                    <Info label="Collected at">{formatDateTime(order.podCollection.collectedAt)}</Info>
                    <Info label="Status">
                      <Badge variant={order.podCollection.status === "reconciled" ? "success" : order.podCollection.status === "discrepancy" ? "danger" : "warn"}>
                        {order.podCollection.status}
                      </Badge>
                    </Info>
                  </dl>
                ) : (
                  <p className="text-ink-muted">No payment recorded yet — record collection after delivery.</p>
                )}
              </div>
            )}
          </section>

          {/* Customer + delivery */}
          <div className="grid sm:grid-cols-2 gap-4">
            <section className="card p-5">
              <h2 className="font-display text-base mb-3 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-ink-muted" /> Customer
              </h2>
              <p className="text-[13px] text-ink font-medium">{order.customerName}</p>
              <p className="text-[12px] text-ink-muted">{order.customerEmail}</p>
              <p className="text-[12px] text-ink-muted">{order.customerPhone}</p>
            </section>
            {order.deliveryMethod === "pickup" && order.pickupStation ? (
              <section className="card p-5">
                <h2 className="font-display text-base mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-ink-muted" /> Pickup station
                </h2>
                <p className="text-[13px] text-ink font-medium">{order.pickupStation.name}</p>
                <p className="text-[12px] text-ink-muted">{order.pickupStation.address}</p>
                <p className="text-[12px] text-ink-muted">{order.pickupStation.city}, {order.pickupStation.state}</p>
                <p className="text-[11px] text-ink-muted mt-2">{order.pickupStation.hours} · {order.pickupStation.phone}</p>
                {order.notes && <p className="text-[11px] text-ink-muted mt-2 italic">"{order.notes}"</p>}
                <p className="text-[11px] text-ink-muted mt-3">Ready by · {formatDate(order.estimatedDelivery)}</p>
              </section>
            ) : (
              <section className="card p-5">
                <h2 className="font-display text-base mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-ink-muted" /> Delivery address
                </h2>
                {order.address ? (
                  <>
                    <p className="text-[13px] text-ink font-medium">{order.address.fullName}</p>
                    <p className="text-[12px] text-ink-muted">{order.address.street}</p>
                    <p className="text-[12px] text-ink-muted">{order.address.city}, {order.address.state}, {order.address.country}</p>
                  </>
                ) : (
                  <p className="text-[12px] text-ink-muted">No address recorded.</p>
                )}
                {order.notes && <p className="text-[11px] text-ink-muted mt-2 italic">"{order.notes}"</p>}
                <p className="text-[11px] text-ink-muted mt-3">ETA · {formatDate(order.estimatedDelivery)}</p>
              </section>
            )}
          </div>

          {/* Timeline */}
          <section className="card p-5">
            <h2 className="font-display text-base text-ink mb-4">Order timeline</h2>
            <OrderTimeline entries={order.timeline} />
          </section>

          {/* Internal notes */}
          <section className="card p-5">
            <h2 className="font-display text-base text-ink mb-3">Internal notes</h2>
            {order.internalNotes.length === 0 ? (
              <p className="text-[12px] text-ink-muted">No internal notes yet.</p>
            ) : (
              <ul className="space-y-3">
                {order.internalNotes.map((n) => (
                  <li key={n.id} className="rounded-md border border-line/70 bg-surface-muted/50 px-3 py-2">
                    <p className="text-[12px] text-ink">{n.body}</p>
                    <p className="text-[11px] text-ink-muted mt-1">{n.by} · {formatDateTime(n.at)}</p>
                  </li>
                ))}
              </ul>
            )}
            <PermissionGate permission="orders.notes">
              <div className="mt-4 space-y-2">
                <Label htmlFor="new-note">Add a note</Label>
                <Textarea
                  id="new-note"
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Visible to admin and managers only."
                />
                <Button size="sm" onClick={postNote} disabled={addNote.isPending || !noteDraft.trim()}>
                  {addNote.isPending ? "Saving…" : "Save note"}
                </Button>
              </div>
            </PermissionGate>
          </section>
        </div>

        {/* Sticky action panel */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <section className="card p-5">
            <h2 className="eyebrow mb-2">Actions</h2>
            <p className="text-[13px] text-ink mb-3">
              {isBankTransfer && order.status === "pending-verification"
                ? "Awaiting bank transfer"
                : ORDER_STATUS_COPY[order.status].title}
            </p>
            <p className="text-[12px] text-ink-muted leading-relaxed mb-4">
              {isBankTransfer && order.status === "pending-verification"
                ? "Customer chose bank transfer. Confirm the payment landed in the account, then the order moves to fulfilment."
                : ORDER_STATUS_COPY[order.status].body}
            </p>

            <div className="space-y-2">
              {isPOD && order.status === "pending-verification" && can(role, "orders.verify") && (
                <Button className="w-full" size="md" onClick={() => setVerifyOpen(true)}>
                  <ShieldCheck className="h-4 w-4" /> Verify customer
                </Button>
              )}

              {isBankTransfer &&
                order.status === "pending-verification" &&
                (can(role, "orders.verify") || can(role, "orders.update")) && (
                  <Button className="w-full" size="md" onClick={() => setTransferOpen(true)}>
                    <Banknote className="h-4 w-4" /> Confirm transfer received
                  </Button>
                )}

              {isPOD && ["delivered"].includes(order.status) && can(role, "orders.update") && !order.podCollection && (
                <Button className="w-full" size="md" onClick={() => setCollectOpen(true)}>
                  <Banknote className="h-4 w-4" /> Record collection
                </Button>
              )}

              {isPOD && order.podCollection && order.podCollection.status !== "reconciled" && can(role, "accounting.reconcile") && (
                <>
                  <Button className="w-full" variant="success" onClick={() => setReconcileOpen("reconciled")}>
                    <ClipboardCheck className="h-4 w-4" /> Mark reconciled
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => setReconcileOpen("discrepancy")}>
                    Flag discrepancy
                  </Button>
                </>
              )}

              {/* Home delivery: assign / reassign the shipment to a rider or 3PL */}
              {!isPickup &&
                order.delivery &&
                can(role, "orders.update") &&
                !["delivered", "completed", "cancelled", "returned", "refunded"].includes(order.status) && (
                  <Button
                    className="w-full"
                    size="md"
                    variant={deliveryAssigned ? "outline" : "primary"}
                    onClick={() => setAssignOpen(true)}
                  >
                    <Truck className="h-4 w-4" />
                    {deliveryAssigned
                      ? `Reassign delivery${order.delivery.assigneeName ? ` · ${order.delivery.assigneeName}` : ""}`
                      : "Assign delivery"}
                  </Button>
                )}

              {advanceFlow.filter((a) => a.show && can(role, "orders.update")).map((a) => (
                <Button
                  key={a.next}
                  variant="outline"
                  className="w-full"
                  onClick={() => transition(a.next, a.label)}
                  disabled={updateStatus.isPending || a.disabled}
                >
                  {updateStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  {a.label}
                </Button>
              ))}

              {["order-created", "pending-verification", "pending-payment", "verified", "payment-confirmed", "pending-fulfillment", "packed"].includes(order.status) && can(role, "orders.cancel") && (
                <Button variant="danger" className="w-full" onClick={() => setCancelOpen(true)}>
                  <X className="h-4 w-4" /> Cancel order
                </Button>
              )}
            </div>
          </section>

          {isPOD && (
            <section className="card p-5">
              <h2 className="eyebrow mb-2 flex items-center gap-2">
                <ReceiptText className="h-3 w-3" /> Reconciliation
              </h2>
              {order.podCollection?.status === "reconciled" ? (
                <p className="text-[12px] text-success">
                  Reconciled by Accounting on {formatDate(order.podCollection.collectedAt)}.
                </p>
              ) : order.podCollection?.status === "discrepancy" ? (
                <p className="text-[12px] text-danger">Discrepancy flagged. See note: {order.podCollection.reconciliationNote}</p>
              ) : (
                <p className="text-[12px] text-ink-muted">Awaiting cash collection and reconciliation.</p>
              )}
            </section>
          )}
        </aside>
      </div>

      <PodVerificationDialog
        open={verifyOpen}
        onOpenChange={setVerifyOpen}
        orderId={order.id}
        orderNumber={order.number}
        customerName={order.customerName}
      />
      <PodPaymentCollectionDialog
        open={collectOpen}
        onOpenChange={setCollectOpen}
        orderId={order.id}
        orderNumber={order.number}
        defaultAmount={order.total}
      />
      {order.delivery && (
        <DeliveryAssignDialog
          open={assignOpen}
          onOpenChange={setAssignOpen}
          deliveryId={order.delivery.id}
          orderNumber={order.number}
        />
      )}
      <Dialog open={transferOpen} onOpenChange={(v) => { setTransferOpen(v); if (!v) setTransferRef(""); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm bank transfer</DialogTitle>
            <DialogDescription>
              Enter the bank transfer reference / statement narration as evidence. This marks the order paid and verified.
            </DialogDescription>
          </DialogHeader>
          <FormInput
            label="Transfer reference"
            placeholder="e.g. FT26061800123456"
            value={transferRef}
            onChange={(e) => setTransferRef(e.target.value)}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTransferOpen(false)}>Cancel</Button>
            <Button
              disabled={transferRef.trim().length < 2 || confirmTransfer.isPending}
              onClick={async () => {
                try {
                  await confirmTransfer.mutateAsync({ id: order.id, reference: transferRef.trim() });
                  toast.success("Bank transfer confirmed — order verified.");
                  setTransferOpen(false);
                  setTransferRef("");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Could not confirm transfer");
                }
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel this order?"
        description="Reserved stock will be released. The customer will be notified."
        destructive
        confirmLabel="Cancel order"
        requireNote
        noteLabel="Reason for cancellation"
        onConfirm={async (note) => {
          await updateStatus.mutateAsync({
            id: order.id,
            status: "cancelled",
            note,
            by: user?.fullName ?? "Admin",
          });
          toast.success(`Order ${order.number} cancelled.`);
        }}
      />
      <ConfirmDialog
        open={!!reconcileOpen}
        onOpenChange={(v) => !v && setReconcileOpen(null)}
        title={reconcileOpen === "reconciled" ? "Mark payment reconciled?" : "Flag discrepancy?"}
        description={
          reconcileOpen === "reconciled"
            ? "Cash/transfer matches expected total. Order moves to completed."
            : "Amount collected doesn't match expected total. The discrepancy will be assigned for follow-up."
        }
        destructive={reconcileOpen === "discrepancy"}
        requireNote={reconcileOpen === "discrepancy"}
        confirmLabel={reconcileOpen === "reconciled" ? "Mark reconciled" : "Flag discrepancy"}
        onConfirm={async (note) => {
          await reconcile.mutateAsync({
            id: order.id,
            status: reconcileOpen!,
            note,
            by: user?.fullName ?? "Accountant",
          });
          toast.success(reconcileOpen === "reconciled" ? "Reconciled." : "Discrepancy flagged.");
        }}
      />
    </div>
  );
}

function Info({
  label,
  children,
  tone,
}: {
  label: string;
  children: React.ReactNode;
  tone?: "muted";
}) {
  return (
    <div>
      <dt className="eyebrow mb-1">{label}</dt>
      <dd className={`text-[13px] ${tone === "muted" ? "text-ink-muted" : "text-ink"}`}>{children}</dd>
    </div>
  );
}
