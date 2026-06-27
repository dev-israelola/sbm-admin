export type DeliveryType = "internal" | "third-party";

export type DeliveryStatus =
  | "pending-assignment"
  | "assigned"
  | "picked-up"
  | "in-transit"
  | "delivered"
  | "failed-delivery"
  | "returned";

export type DeliveryCollectionStatus =
  | "not-applicable"
  | "not-collected"
  | "collected"
  | "pending-review"
  | "reconciled"
  | "discrepancy";

export interface DeliveryAssignment {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  state: string;
  street: string;
  type: DeliveryType;
  provider?: string;
  trackingNumber?: string;
  assigneeId?: string;
  assigneeName?: string;
  status: DeliveryStatus;
  paymentMethod: "paystack" | "pod" | "bank_transfer";
  amountToCollect: number;
  collectionStatus: DeliveryCollectionStatus;
  deliveryFee: number;
  exceptionNote?: string;
  proofFile?: string;
  scheduledFor: string;
  updatedAt: string;
  createdAt: string;
}

export type PickupHandoffStatus =
  | "awaiting-arrival"
  | "ready-for-pickup"
  | "picked-up"
  | "expired";

export interface PickupHandoff {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  stationId: string;
  stationName: string;
  stationCity: string;
  stationState: string;
  stationAddress: string;
  paymentMethod: "paystack" | "pod" | "bank_transfer";
  amountToCollect: number;
  collectionStatus: DeliveryCollectionStatus;
  status: PickupHandoffStatus;
  arrivedAt?: string;
  pickedUpAt?: string;
  pickupCode: string;
  notes?: string;
  updatedAt: string;
  createdAt: string;
}

export interface DeliveryState {
  code: string;
  name: string;
  homeDeliveryFee: number;
  cities: string[];
}

export interface PickupStation {
  id: string;
  name: string;
  state: string;
  city: string;
  address: string;
  fee: number;
  hours: string;
  phone: string;
  active: boolean;
}

export interface DeliveryOptions {
  states: DeliveryState[];
  pickupStations: PickupStation[];
  freeHomeDeliveryThreshold: number;
}
