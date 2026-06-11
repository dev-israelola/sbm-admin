import type {
  DeliveryAssignment,
  DeliveryStatus,
  PickupHandoff,
  PickupHandoffStatus,
} from "@/types/delivery";
import { MOCK_ORDERS } from "./mock-orders";

const PROVIDERS = ["Internal Rider", "GIG Logistics", "Sendbox", "Topship"];

const deliveryStatusMap: Record<string, DeliveryStatus> = {
  packed: "assigned",
  "ready-for-dispatch": "picked-up",
  "in-transit": "in-transit",
  delivered: "delivered",
  "cash-collected": "delivered",
  completed: "delivered",
  "failed-delivery": "failed-delivery",
  returned: "returned",
};

const pickupStatusMap: Record<string, PickupHandoffStatus> = {
  packed: "awaiting-arrival",
  "ready-for-pickup": "ready-for-pickup",
  "picked-up": "picked-up",
  "cash-collected": "picked-up",
  completed: "picked-up",
};

// Home delivery — sent to a rider.
export const MOCK_DELIVERIES: DeliveryAssignment[] = MOCK_ORDERS.filter(
  (o) => o.deliveryMethod === "home" && o.deliveryId,
).map((o, i) => {
  const type = i % 3 === 0 ? "third-party" : "internal";
  const assignee = i % 3 === 0
    ? undefined
    : i % 2 === 0
      ? { id: "u_delivery_1", name: "Musa Ibrahim" }
      : { id: "u_delivery_2", name: "Kelechi Okoro" };

  return {
    id: o.deliveryId!,
    orderId: o.id,
    orderNumber: o.number,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    city: o.address?.city ?? "",
    state: o.address?.state ?? "",
    street: o.address?.street ?? "",
    type,
    provider: type === "third-party" ? PROVIDERS[(i % PROVIDERS.length) + 1] ?? "GIG Logistics" : "Internal Rider",
    trackingNumber: type === "third-party" ? `TRK-${(1000 + i).toString(36).toUpperCase()}` : undefined,
    assigneeId: assignee?.id,
    assigneeName: assignee?.name,
    status: deliveryStatusMap[o.status] ?? "pending-assignment",
    paymentMethod: o.paymentMethod,
    amountToCollect: o.paymentMethod === "pod" ? o.total : 0,
    collectionStatus:
      o.paymentMethod === "paystack"
        ? "not-applicable"
        : o.podCollection
          ? o.podCollection.status === "reconciled"
            ? "reconciled"
            : "collected"
          : "not-collected",
    deliveryFee: o.deliveryFee,
    exceptionNote: o.status === "failed-delivery" ? "Customer unreachable on arrival." : undefined,
    proofFile: o.status === "delivered" || o.status === "completed" ? "pod_signed.jpg" : undefined,
    scheduledFor: o.estimatedDelivery,
    updatedAt: o.timeline[o.timeline.length - 1]?.timestamp ?? o.createdAt,
    createdAt: o.createdAt,
  };
});

// Pickup orders — held at a station for customer collection.
export const MOCK_PICKUP_HANDOFFS: PickupHandoff[] = MOCK_ORDERS.filter(
  (o) => o.deliveryMethod === "pickup" && o.pickupHandoffId,
).map((o, i) => {
  const station = o.pickupStation!;
  const pickupCode = `PU-${o.number.slice(-4)}-${String((i + 1) * 7).padStart(3, "0")}`;
  return {
    id: o.pickupHandoffId!,
    orderId: o.id,
    orderNumber: o.number,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    stationId: station.id,
    stationName: station.name,
    stationCity: station.city,
    stationState: station.state,
    stationAddress: station.address,
    paymentMethod: o.paymentMethod,
    amountToCollect: o.paymentMethod === "pod" && !o.podCollection ? o.total : 0,
    collectionStatus:
      o.paymentMethod === "paystack"
        ? "not-applicable"
        : o.podCollection
          ? o.podCollection.status === "reconciled"
            ? "reconciled"
            : "collected"
          : "not-collected",
    status: pickupStatusMap[o.status] ?? "awaiting-arrival",
    pickupCode,
    pickedUpAt: ["picked-up", "cash-collected", "completed"].includes(o.status)
      ? o.timeline[o.timeline.length - 1]?.timestamp
      : undefined,
    notes: undefined,
    updatedAt: o.timeline[o.timeline.length - 1]?.timestamp ?? o.createdAt,
    createdAt: o.createdAt,
  };
});

// Add a few pending-assignment deliveries (no order behind them yet).
export const PENDING_DELIVERIES: DeliveryAssignment[] = [
  {
    id: "del_pending_001",
    orderId: "ord_pending_001",
    orderNumber: "HRB-1200",
    customerName: "Adaeze Okafor",
    customerPhone: "+234 803 555 9001",
    city: "Victoria Island",
    state: "Lagos",
    street: "23 Adeola Odeku Street",
    type: "internal",
    provider: "Internal Rider",
    status: "pending-assignment",
    paymentMethod: "pod",
    amountToCollect: 42800,
    collectionStatus: "not-collected",
    deliveryFee: 2500,
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "del_pending_002",
    orderId: "ord_pending_002",
    orderNumber: "HRB-1201",
    customerName: "Tomi Adeleke",
    customerPhone: "+234 803 555 9002",
    city: "Garki",
    state: "Abuja",
    street: "Plot 18 Ahmadu Bello Way",
    type: "third-party",
    status: "pending-assignment",
    paymentMethod: "paystack",
    amountToCollect: 0,
    collectionStatus: "not-applicable",
    deliveryFee: 3500,
    scheduledFor: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export const ALL_DELIVERIES: DeliveryAssignment[] = [...PENDING_DELIVERIES, ...MOCK_DELIVERIES];
