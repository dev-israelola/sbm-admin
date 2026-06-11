import type { RefundRequest, RefundReason, RefundStatus } from "@/types/refund";
import { MOCK_ORDERS } from "./mock-orders";

const REASONS: RefundReason[] = [
  "Wrong item delivered",
  "Damaged product",
  "Expired product",
  "Failed delivery",
  "Payment issue",
  "Duplicate order",
  "Customer changed mind",
];

const STATUS_FROM_ORDER: Record<string, RefundStatus | undefined> = {
  "refund-requested": "submitted",
  "refund-approved": "approved",
  refunded: "refunded",
  "partially-refunded": "partially-refunded",
  returned: "refunded",
};

export const MOCK_REFUNDS: RefundRequest[] = [];

MOCK_ORDERS.forEach((o, i) => {
  const status = STATUS_FROM_ORDER[o.status];
  if (!status) return;
  const item = o.items[0];
  MOCK_REFUNDS.push({
    id: `ref_${o.id}`,
    orderId: o.id,
    orderNumber: o.number,
    customerId: o.customerId,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    productId: item.productId,
    productName: item.name,
    reason: REASONS[i % REASONS.length],
    description:
      [
        "Bottle cracked during transit. Photos attached.",
        "Received unscented version, ordered the original blend.",
        "Customer reports allergic reaction within 24 hours.",
        "Duplicate order placed accidentally, request cancellation refund.",
        "Item arrived past expiry window — please replace.",
      ][i % 5],
    preferredResolution: i % 3 === 0 ? "Replacement" : "Refund",
    amount: item.subtotal,
    status,
    assignedReviewer: status !== "submitted" ? "Tope Bamidele" : undefined,
    decisionNote:
      status === "rejected" ? "Outside 7-day window." : status === "approved" || status === "refunded" ? "Verified with delivery proof." : undefined,
    evidenceFile: i % 2 === 0 ? `evidence_${o.number}.jpg` : undefined,
    createdAt: o.createdAt,
    decidedAt: status === "approved" || status === "refunded" || status === "rejected" || status === "partially-refunded" ? o.timeline[o.timeline.length - 1]?.timestamp : undefined,
  });
});

// Add a few extra under-review and pending ones
MOCK_REFUNDS.push(
  {
    id: "ref_extra_001",
    orderId: "ord_0040",
    orderNumber: "HRB-1040",
    customerId: "c_006",
    customerName: "Funke Bello",
    customerEmail: "funke.bello@example.com",
    productId: "p_015",
    productName: "Turmeric + Black Pepper Capsules",
    reason: "Damaged product",
    description: "Two of the bottles had broken seals.",
    preferredResolution: "Replacement",
    amount: 18400,
    status: "under-review",
    assignedReviewer: "Tope Bamidele",
    evidenceFile: "evidence_HRB-1040.jpg",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ref_extra_002",
    orderId: "ord_0021",
    orderNumber: "HRB-1021",
    customerId: "c_010",
    customerName: "Daniel Eze",
    customerEmail: "daniel.eze@example.com",
    productId: "p_023",
    productName: "Calm-Belly Peppermint Infusion",
    reason: "Customer changed mind",
    description: "Allergic to peppermint after consultation.",
    preferredResolution: "Store credit",
    amount: 6900,
    status: "rejected",
    assignedReviewer: "Tope Bamidele",
    decisionNote: "Tea was opened — outside refund policy.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    decidedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
);
