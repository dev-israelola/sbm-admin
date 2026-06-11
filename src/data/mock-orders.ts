import type {
  AdminOrder,
  DeliveryMethod,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  PaystackPayment,
  PickupStationSnapshot,
  PodCollection,
} from "@/types/order";
import { MOCK_PRODUCTS } from "./mock-products";
import { MOCK_CUSTOMERS } from "./mock-customers";
import { MOCK_PICKUP_STATIONS } from "./mock-delivery-options";
import { DEFAULT_DELIVERY_FEE } from "@/lib/constants";

const CITIES = ["Ikoyi", "Lekki", "Yaba", "Surulere", "Ikeja", "Wuse", "Garki", "Port Harcourt", "Ibadan"];
const STATES = ["Lagos", "Lagos", "Lagos", "Lagos", "Lagos", "Abuja", "Abuja", "Rivers", "Oyo"];

interface OrderRecipe {
  daysAgo: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  deliveryMethod?: DeliveryMethod;
  itemCount?: number;
  customerIdx?: number;
}

// Recipes — covers every relevant status; the generator pads with normal orders.
const FIXED_RECIPES: OrderRecipe[] = [
  // POD pending verification
  { daysAgo: 0, status: "pending-verification", paymentStatus: "pending", paymentMethod: "pod", customerIdx: 1, itemCount: 2 },
  { daysAgo: 0, status: "pending-verification", paymentStatus: "pending", paymentMethod: "pod", customerIdx: 4, itemCount: 1 },
  { daysAgo: 1, status: "pending-verification", paymentStatus: "pending", paymentMethod: "pod", customerIdx: 19, itemCount: 2 },
  // POD verified, packed, in transit (home delivery)
  { daysAgo: 1, status: "verified", paymentStatus: "pending", paymentMethod: "pod", customerIdx: 7 },
  { daysAgo: 2, status: "packed", paymentStatus: "pending", paymentMethod: "pod", customerIdx: 8 },
  { daysAgo: 2, status: "ready-for-dispatch", paymentStatus: "pending", paymentMethod: "pod", customerIdx: 9 },
  { daysAgo: 3, status: "in-transit", paymentStatus: "pending", paymentMethod: "pod", customerIdx: 10 },
  { daysAgo: 4, status: "delivered", paymentStatus: "pending", paymentMethod: "pod", customerIdx: 11 },
  // POD delivered but unreconciled
  { daysAgo: 5, status: "cash-collected", paymentStatus: "paid", paymentMethod: "pod", customerIdx: 12 },
  { daysAgo: 6, status: "cash-collected", paymentStatus: "paid", paymentMethod: "pod", customerIdx: 13 },
  { daysAgo: 7, status: "cash-collected", paymentStatus: "paid", paymentMethod: "pod", customerIdx: 14 },
  // POD completed
  { daysAgo: 12, status: "completed", paymentStatus: "paid", paymentMethod: "pod", customerIdx: 0 },
  { daysAgo: 18, status: "completed", paymentStatus: "paid", paymentMethod: "pod", customerIdx: 3 },
  // Paystack flow (home delivery)
  { daysAgo: 0, status: "payment-confirmed", paymentStatus: "paid", paymentMethod: "paystack", customerIdx: 2 },
  { daysAgo: 0, status: "pending-fulfillment", paymentStatus: "paid", paymentMethod: "paystack", customerIdx: 5 },
  { daysAgo: 1, status: "packed", paymentStatus: "paid", paymentMethod: "paystack", customerIdx: 6 },
  { daysAgo: 2, status: "in-transit", paymentStatus: "paid", paymentMethod: "paystack", customerIdx: 7 },
  { daysAgo: 3, status: "delivered", paymentStatus: "paid", paymentMethod: "paystack", customerIdx: 8 },
  { daysAgo: 10, status: "completed", paymentStatus: "paid", paymentMethod: "paystack", customerIdx: 0 },
  // Cancelled
  { daysAgo: 4, status: "cancelled", paymentStatus: "pending", paymentMethod: "pod", customerIdx: 15 },
  { daysAgo: 9, status: "cancelled", paymentStatus: "failed", paymentMethod: "paystack", customerIdx: 16 },
  // Failed delivery
  { daysAgo: 6, status: "failed-delivery", paymentStatus: "pending", paymentMethod: "pod", customerIdx: 17 },
  // Returned
  { daysAgo: 14, status: "returned", paymentStatus: "refunded", paymentMethod: "paystack", customerIdx: 18 },
  // Refund flow
  { daysAgo: 11, status: "refund-requested", paymentStatus: "paid", paymentMethod: "paystack", customerIdx: 1 },
  { daysAgo: 13, status: "refund-approved", paymentStatus: "paid", paymentMethod: "paystack", customerIdx: 2 },
  { daysAgo: 16, status: "refunded", paymentStatus: "refunded", paymentMethod: "paystack", customerIdx: 3 },
  { daysAgo: 22, status: "partially-refunded", paymentStatus: "partially-refunded", paymentMethod: "paystack", customerIdx: 4 },
  // Pickup variants
  { daysAgo: 0, status: "payment-confirmed", paymentStatus: "paid", paymentMethod: "paystack", customerIdx: 20, deliveryMethod: "pickup" },
  { daysAgo: 1, status: "packed", paymentStatus: "paid", paymentMethod: "paystack", customerIdx: 21, deliveryMethod: "pickup" },
  { daysAgo: 2, status: "ready-for-pickup", paymentStatus: "paid", paymentMethod: "paystack", customerIdx: 22, deliveryMethod: "pickup" },
  { daysAgo: 3, status: "ready-for-pickup", paymentStatus: "pending", paymentMethod: "pod", customerIdx: 23, deliveryMethod: "pickup" },
  { daysAgo: 4, status: "picked-up", paymentStatus: "paid", paymentMethod: "paystack", customerIdx: 24, deliveryMethod: "pickup" },
  { daysAgo: 6, status: "picked-up", paymentStatus: "paid", paymentMethod: "pod", customerIdx: 25, deliveryMethod: "pickup" },
  { daysAgo: 15, status: "completed", paymentStatus: "paid", paymentMethod: "paystack", customerIdx: 26, deliveryMethod: "pickup" },
];

const productPool = MOCK_PRODUCTS.filter((p) => p.availableStock > 0 || p.soldStock > 30);

let runningSeed = 1;
function pickItems(count: number, deterministicOffset: number): OrderItem[] {
  return Array.from({ length: count }).map((_, j) => {
    const p = productPool[(deterministicOffset + j * 3) % productPool.length];
    const quantity = 1 + ((deterministicOffset + j) % 3);
    const unitPrice = p.retailPrice;
    return {
      productId: p.id,
      sku: p.sku,
      name: p.name,
      brand: p.brand,
      image: p.images[0],
      unitPrice,
      quantity,
      subtotal: quantity * unitPrice,
      costPrice: p.costPrice,
    };
  });
}

function buildTimeline(
  status: OrderStatus,
  daysAgo: number,
  paymentMethod: PaymentMethod,
  deliveryMethod: DeliveryMethod,
): AdminOrder["timeline"] {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const at = (offset: number, mins = 0) =>
    new Date(now - daysAgo * dayMs + offset * 60 * 60 * 1000 + mins * 60 * 1000).toISOString();

  const t: AdminOrder["timeline"] = [
    { status: "order-created", timestamp: at(0), by: "system" },
  ];

  if (paymentMethod === "paystack") {
    t.push({ status: "payment-confirmed", timestamp: at(0, 4), by: "paystack" });
  } else {
    t.push({ status: "pending-verification", timestamp: at(0, 5), by: "system", note: "Awaiting verification call." });
  }

  const homeFlow: OrderStatus[] = [
    "verified", "pending-fulfillment", "packed", "ready-for-dispatch", "in-transit", "delivered", "cash-collected", "completed",
  ];
  const pickupFlow: OrderStatus[] = [
    "verified", "pending-fulfillment", "packed", "ready-for-pickup", "picked-up", "cash-collected", "completed",
  ];
  const flow = deliveryMethod === "pickup" ? pickupFlow : homeFlow;
  const idx = flow.indexOf(status);
  if (idx >= 0) {
    flow.slice(0, idx + 1).forEach((s, i) => {
      t.push({ status: s, timestamp: at(1 + i, 0), by: i < 4 ? "Tope Bamidele" : "Musa Ibrahim" });
    });
  }

  if (status === "cancelled") {
    t.push({ status: "cancelled", timestamp: at(1), by: "Tope Bamidele", note: "Customer unreachable after 3 attempts." });
  }
  if (status === "failed-delivery") {
    t.push({ status: "failed-delivery", timestamp: at(2), by: "Musa Ibrahim", note: "Address not found, attempting again." });
  }
  if (status === "returned") {
    t.push({ status: "returned", timestamp: at(3), by: "Musa Ibrahim", note: "Returned to studio in good condition." });
  }
  if (status === "refund-requested") {
    t.push({ status: "refund-requested", timestamp: at(2), by: "customer", note: "Wrong item flavour delivered." });
  }
  if (status === "refund-approved") {
    t.push({ status: "refund-approved", timestamp: at(3), by: "Tope Bamidele" });
  }
  if (status === "refunded") {
    t.push({ status: "refunded", timestamp: at(4), by: "Nneka Eze", note: "Points reversed and stock returned." });
  }
  if (status === "partially-refunded") {
    t.push({ status: "partially-refunded", timestamp: at(4), by: "Nneka Eze", note: "Single item refunded." });
  }
  return t;
}

function buildOrder(recipe: OrderRecipe, runningNumber: number): AdminOrder {
  const customer = MOCK_CUSTOMERS[(recipe.customerIdx ?? runningNumber) % MOCK_CUSTOMERS.length];
  const deliveryMethod: DeliveryMethod = recipe.deliveryMethod ?? "home";
  const itemCount = recipe.itemCount ?? 1 + (runningNumber % 3);
  const items = pickItems(itemCount, runningNumber);
  const subtotal = items.reduce((acc, it) => acc + it.subtotal, 0);
  const costOfGoods = items.reduce((acc, it) => acc + it.costPrice * it.quantity, 0);

  const station = MOCK_PICKUP_STATIONS[runningNumber % MOCK_PICKUP_STATIONS.length];
  const pickupFee = station.fee;
  const homeFee = subtotal >= 50000 ? 0 : DEFAULT_DELIVERY_FEE;
  const deliveryFee = deliveryMethod === "pickup" ? pickupFee : homeFee;
  const total = subtotal + deliveryFee;
  const cityIdx = runningNumber % CITIES.length;

  const id = `ord_${String(runningNumber).padStart(4, "0")}`;
  const number = `HRB-${1000 + runningNumber}`;
  const createdAt = new Date(Date.now() - recipe.daysAgo * 24 * 60 * 60 * 1000).toISOString();
  const timeline = buildTimeline(recipe.status, recipe.daysAgo, recipe.paymentMethod, deliveryMethod);

  const isCollectedStatus = ["cash-collected", "completed"].includes(recipe.status);
  const podCollection: PodCollection | undefined =
    recipe.paymentMethod === "pod" && isCollectedStatus
      ? {
          amount: total,
          method: runningNumber % 2 === 0 ? "cash" : "bank-transfer",
          collectedBy: runningNumber % 2 === 0 ? "Musa Ibrahim" : "Kelechi Okoro",
          collectedAt: timeline[timeline.length - 1].timestamp,
          reference: `POD-${number}`,
          status: recipe.status === "completed" ? "reconciled" : "collected",
        }
      : undefined;

  const paystackPayment: PaystackPayment | undefined =
    recipe.paymentMethod === "paystack" && recipe.paymentStatus !== "pending"
      ? {
          reference: `psk_${id}`,
          amount: total,
          paidAt: timeline.find((t) => t.status === "payment-confirmed")?.timestamp ?? createdAt,
          gatewayFee: Math.round(total * 0.015),
          email: customer.email,
          settlementStatus: recipe.daysAgo > 2 ? "settled" : "pending",
        }
      : undefined;

  const address =
    deliveryMethod === "home"
      ? {
          fullName: customer.fullName,
          phone: customer.phone,
          street: `${10 + (runningNumber % 80)} ${["Bourdillon", "Adeola Odeku", "Awolowo", "Ahmadu Bello"][runningNumber % 4]} Road`,
          city: CITIES[cityIdx],
          state: STATES[cityIdx],
          country: "Nigeria",
          postalCode: undefined,
        }
      : undefined;

  const pickupStation: PickupStationSnapshot | undefined =
    deliveryMethod === "pickup"
      ? {
          id: station.id,
          name: station.name,
          state: station.state,
          city: station.city,
          address: station.address,
          fee: station.fee,
          hours: station.hours,
          phone: station.phone,
        }
      : undefined;

  const homeDeliveryStatuses: OrderStatus[] = [
    "packed", "ready-for-dispatch", "in-transit", "delivered", "cash-collected", "completed", "failed-delivery", "returned",
  ];
  const pickupHandoffStatuses: OrderStatus[] = [
    "packed", "ready-for-pickup", "picked-up", "cash-collected", "completed",
  ];

  const hasDeliveryRecord =
    deliveryMethod === "home" && homeDeliveryStatuses.includes(recipe.status);
  const hasPickupRecord =
    deliveryMethod === "pickup" && pickupHandoffStatuses.includes(recipe.status);

  return {
    id,
    number,
    createdAt,
    status: recipe.status,
    paymentStatus: recipe.paymentStatus,
    paymentMethod: recipe.paymentMethod,
    deliveryMethod,
    customerId: customer.id,
    customerName: customer.fullName,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    items,
    subtotal,
    deliveryFee,
    discount: 0,
    pointsApplied: 0,
    pointsValue: 0,
    pointsEarned: recipe.status === "completed" ? Math.floor(subtotal / 100) : 0,
    total,
    costOfGoods,
    estimatedProfit: subtotal - costOfGoods - deliveryFee,
    address,
    pickupStation,
    notes: undefined,
    estimatedDelivery: new Date(
      Date.now() - recipe.daysAgo * 24 * 60 * 60 * 1000 + 4 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    timeline,
    podCollection,
    paystackPayment,
    deliveryId: hasDeliveryRecord ? `del_${id}` : undefined,
    pickupHandoffId: hasPickupRecord ? `ph_${id}` : undefined,
    verifiedBy:
      ["verified", "packed", "ready-for-dispatch", "ready-for-pickup", "in-transit", "delivered", "picked-up", "cash-collected", "completed"].includes(recipe.status) &&
      recipe.paymentMethod === "pod"
        ? "Tope Bamidele"
        : undefined,
    internalNotes:
      runningNumber % 5 === 0
        ? [
            {
              id: `note_${id}`,
              by: "Tope Bamidele",
              at: timeline[1]?.timestamp ?? createdAt,
              body: "Customer is a returning buyer — fast-track if possible.",
            },
          ]
        : [],
  };
}

const generated: AdminOrder[] = [];
FIXED_RECIPES.forEach(() => {});
FIXED_RECIPES.forEach((r) => {
  generated.push(buildOrder(r, ++runningSeed));
});

// Pad with normal completed Paystack retail orders to reach ~80
const filler: OrderRecipe[] = [];
for (let i = 0; i < 50; i++) {
  const daysAgo = 30 + (i % 60);
  const paymentMethod: PaymentMethod = i % 3 === 0 ? "pod" : "paystack";
  filler.push({
    daysAgo,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod,
    deliveryMethod: i % 7 === 0 ? "pickup" : "home",
    customerIdx: (i + 5) % MOCK_CUSTOMERS.length,
  });
}
filler.forEach((r) => {
  generated.push(buildOrder(r, ++runningSeed));
});

export const MOCK_ORDERS: AdminOrder[] = generated.sort(
  (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
);
