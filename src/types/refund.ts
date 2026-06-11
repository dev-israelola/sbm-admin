export type RefundStatus =
  | "submitted"
  | "under-review"
  | "approved"
  | "rejected"
  | "refunded"
  | "partially-refunded";

export type RefundReason =
  | "Wrong item delivered"
  | "Damaged product"
  | "Expired product"
  | "Failed delivery"
  | "Payment issue"
  | "Duplicate order"
  | "Customer changed mind";

export type RefundResolution = "Refund" | "Replacement" | "Store credit";

export interface RefundRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  reason: RefundReason;
  description: string;
  preferredResolution: RefundResolution;
  amount: number;
  status: RefundStatus;
  assignedReviewer?: string;
  decisionNote?: string;
  evidenceFile?: string;
  createdAt: string;
  decidedAt?: string;
}
