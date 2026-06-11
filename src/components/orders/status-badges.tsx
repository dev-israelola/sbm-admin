import { Badge } from "@/components/ui/badge";
import type { OrderStatus, PaymentStatus } from "@/types/order";

type Variant =
  | "default" | "accent" | "soft" | "success" | "warn" | "danger" | "info" | "outline" | "neutral";

const ORDER_MAP: Record<OrderStatus, { label: string; variant: Variant }> = {
  "order-created": { label: "Created", variant: "outline" },
  "pending-payment": { label: "Pending payment", variant: "warn" },
  "payment-confirmed": { label: "Payment confirmed", variant: "success" },
  "pending-verification": { label: "Pending verification", variant: "warn" },
  verified: { label: "Verified", variant: "info" },
  "pending-fulfillment": { label: "Preparing", variant: "default" },
  packed: { label: "Packed", variant: "default" },
  "ready-for-dispatch": { label: "Ready", variant: "default" },
  "ready-for-pickup": { label: "Ready for pickup", variant: "success" },
  "in-transit": { label: "In transit", variant: "info" },
  delivered: { label: "Delivered", variant: "success" },
  "picked-up": { label: "Picked up", variant: "success" },
  "cash-collected": { label: "Cash collected", variant: "soft" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
  "failed-delivery": { label: "Failed delivery", variant: "danger" },
  returned: { label: "Returned", variant: "warn" },
  "refund-requested": { label: "Refund requested", variant: "warn" },
  "refund-approved": { label: "Refund approved", variant: "info" },
  "refund-rejected": { label: "Refund rejected", variant: "danger" },
  refunded: { label: "Refunded", variant: "neutral" },
  "partially-refunded": { label: "Partially refunded", variant: "neutral" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = ORDER_MAP[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

const PAYMENT_MAP: Record<PaymentStatus, { label: string; variant: Variant }> = {
  pending: { label: "Pending", variant: "warn" },
  paid: { label: "Paid", variant: "success" },
  failed: { label: "Failed", variant: "danger" },
  refunded: { label: "Refunded", variant: "neutral" },
  "partially-refunded": { label: "Partial refund", variant: "neutral" },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = PAYMENT_MAP[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

export const ORDER_STATUS_COPY: Record<OrderStatus, { title: string; body: string }> = {
  "order-created": { title: "Order received", body: "Order queued for processing." },
  "pending-payment": { title: "Pending payment", body: "Awaiting customer payment." },
  "payment-confirmed": { title: "Payment confirmed", body: "Paystack payment received." },
  "pending-verification": { title: "Pending verification", body: "Awaiting POD verification call." },
  verified: { title: "Verified", body: "Customer confirmed, ready to fulfil." },
  "pending-fulfillment": { title: "Preparing", body: "Items being gathered." },
  packed: { title: "Packed", body: "Order packed and labelled." },
  "ready-for-dispatch": { title: "Ready for dispatch", body: "Awaiting courier pickup." },
  "ready-for-pickup": { title: "Ready for pickup", body: "Order is at the pickup station, awaiting customer collection." },
  "in-transit": { title: "In transit", body: "Out for delivery." },
  delivered: { title: "Delivered", body: "Confirmed by delivery staff." },
  "picked-up": { title: "Picked up", body: "Customer collected the order at the pickup station." },
  "cash-collected": { title: "Cash collected", body: "Payment received on delivery." },
  completed: { title: "Completed", body: "Order completed and accounting reconciled." },
  cancelled: { title: "Cancelled", body: "Order cancelled; stock released." },
  "failed-delivery": { title: "Failed delivery", body: "Delivery not completed." },
  returned: { title: "Returned", body: "Items returned to studio." },
  "refund-requested": { title: "Refund requested", body: "Customer submitted refund request." },
  "refund-approved": { title: "Refund approved", body: "Approved, awaiting processing." },
  "refund-rejected": { title: "Refund rejected", body: "Refund denied." },
  refunded: { title: "Refunded", body: "Refund processed and points reversed." },
  "partially-refunded": { title: "Partially refunded", body: "Subset of items refunded." },
};
