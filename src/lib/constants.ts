export const SITE = {
  brand: "shared admin",
  productLine: "multi-platform operations",
  tagline: "Operational dashboard",
};

export const REWARD_POINT_VALUE = 5; // ₦5 per point
export const DEFAULT_DELIVERY_FEE = 2500;

export const ORDER_STATUS_OPTIONS = [
  "order-created",
  "pending-payment",
  "payment-confirmed",
  "pending-verification",
  "verified",
  "pending-fulfillment",
  "packed",
  "ready-for-dispatch",
  "in-transit",
  "delivered",
  "cash-collected",
  "completed",
  "cancelled",
  "failed-delivery",
  "returned",
  "refund-requested",
  "refund-approved",
  "refund-rejected",
  "refunded",
  "partially-refunded",
] as const;

export const REFUND_REASONS = [
  "Wrong item delivered",
  "Damaged product",
  "Expired product",
  "Failed delivery",
  "Payment issue",
  "Duplicate order",
  "Customer changed mind",
] as const;

export const PREFERRED_RESOLUTIONS = ["Refund", "Replacement", "Store credit"] as const;
