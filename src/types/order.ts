export type PaymentMethod = "paystack" | "pod";

export type DeliveryMethod = "home" | "pickup";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially-refunded";

export type OrderStatus =
  | "order-created"
  | "pending-payment"
  | "payment-confirmed"
  | "pending-verification"
  | "verified"
  | "pending-fulfillment"
  | "packed"
  | "ready-for-dispatch"
  | "ready-for-pickup"
  | "in-transit"
  | "delivered"
  | "picked-up"
  | "cash-collected"
  | "completed"
  | "cancelled"
  | "failed-delivery"
  | "returned"
  | "refund-requested"
  | "refund-approved"
  | "refund-rejected"
  | "refunded"
  | "partially-refunded";

export type PodCollectionStatus =
  | "not-collected"
  | "collected"
  | "pending-review"
  | "reconciled"
  | "discrepancy";

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  brand: string;
  image: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  costPrice: number;
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  timestamp: string;
  by?: string;
  note?: string;
}

export interface PodCollection {
  amount: number;
  method: "cash" | "bank-transfer" | "pos";
  collectedBy: string;
  collectedAt: string;
  reference?: string;
  note?: string;
  status: PodCollectionStatus;
  reconciliationNote?: string;
}

export interface PaystackPayment {
  reference: string;
  amount: number;
  paidAt: string;
  gatewayFee: number;
  email: string;
  settlementStatus: "pending" | "settled";
}

export interface AdminOrderAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}

export interface PickupStationSnapshot {
  id: string;
  name: string;
  state: string;
  city: string;
  address: string;
  fee: number;
  hours: string;
  phone: string;
}

export interface AdminOrder {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  pointsApplied: number;
  pointsValue: number;
  pointsEarned: number;
  total: number;
  costOfGoods: number;
  estimatedProfit: number;
  address?: AdminOrderAddress;
  pickupStation?: PickupStationSnapshot;
  notes?: string;
  estimatedDelivery: string;
  timeline: OrderTimelineEntry[];
  podCollection?: PodCollection;
  paystackPayment?: PaystackPayment;
  deliveryId?: string;
  pickupHandoffId?: string;
  verifiedBy?: string;
  internalNotes: { id: string; by: string; at: string; body: string }[];
}
