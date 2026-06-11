import { DEFAULT_DELIVERY_FEE } from "@/lib/constants";
import type { AccountingSummary, Expense, SalesRecord } from "@/types/accounting";
import type { Customer } from "@/types/user";
import type { AdminOrder, OrderItem, PaystackPayment, PodCollection } from "@/types/order";
import type { Product } from "@/types/product";
import type { Platform } from "@/types/platform";
import { MOCK_PRODUCTS } from "./mock-products";
import { MOCK_CUSTOMERS } from "./mock-customers";
import { MOCK_ORDERS } from "./mock-orders";
import { ALL_DELIVERIES, MOCK_PICKUP_HANDOFFS } from "./mock-deliveries";
import { MOCK_PICKUP_STATIONS } from "./mock-delivery-options";
import { MOCK_REFUNDS } from "./mock-refunds";
import { MOCK_CONSULTATIONS, MOCK_RECOMMENDATIONS } from "./mock-consultations";
import { MOCK_EXPENSES } from "./mock-expenses";
import { MOCK_RECONCILIATION } from "./mock-reconciliation";
import { MOCK_INVENTORY_MOVEMENTS } from "./mock-inventory-movements";
import { MOCK_REWARDS, MOCK_REWARD_ACTIVITY } from "./mock-rewards";
import { HOLISTIC_PRODUCTS } from "./holistic-admin-catalog";

type DeliveryRecord = (typeof ALL_DELIVERIES)[number];
type PickupHandoff = (typeof MOCK_PICKUP_HANDOFFS)[number];
type PickupStation = (typeof MOCK_PICKUP_STATIONS)[number];
type RefundRecord = (typeof MOCK_REFUNDS)[number];
type ConsultationRecord = (typeof MOCK_CONSULTATIONS)[number];
type RecommendationRecord = (typeof MOCK_RECOMMENDATIONS)[number];
type ReconciliationRecord = (typeof MOCK_RECONCILIATION)[number];
type InventoryMovementRecord = (typeof MOCK_INVENTORY_MOVEMENTS)[number];
type RewardRecord = (typeof MOCK_REWARDS)[number];
type RewardActivityRecord = (typeof MOCK_REWARD_ACTIVITY)[number];

interface PlatformState {
  products: Product[];
  customers: Customer[];
  orders: AdminOrder[];
  deliveries: DeliveryRecord[];
  pickupHandoffs: PickupHandoff[];
  pickupStations: PickupStation[];
  refunds: RefundRecord[];
  consultations: ConsultationRecord[];
  recommendations: RecommendationRecord[];
  expenses: Expense[];
  reconciliation: ReconciliationRecord[];
  movements: InventoryMovementRecord[];
  rewards: RewardRecord[];
  rewardActivity: RewardActivityRecord[];
}

const HOLISTIC_CATEGORY_PREFIX: Record<string, string> = {
  "gut-digestion": "GUT",
  "womens-health": "WMN",
  "mens-wellness": "MEN",
  "detox-cleanses": "DTX",
  "immunity-relief": "IMM",
  "superfoods-wellness": "SFW",
};

const HOLISTIC_CONCERNS = [
  "Gut reset & bloating relief",
  "Womb wellness & cycle support",
  "Hormone balance",
  "Detox & cleansing support",
  "Immune recovery",
  "Men's vitality support",
  "Stress, sleep & nervous system care",
  "Energy restoration",
];

const HOLISTIC_GOALS = [
  "Restore digestive ease over 4 weeks",
  "Support a calmer cycle and less discomfort",
  "Improve daily energy without stimulants",
  "Build a simple holistic healing routine",
  "Reduce recurring flare-ups naturally",
  "Support fertility and reproductive wellness",
  "Reset after stress, burnout, or poor sleep",
  "Create a food, herb, and supplement rhythm that feels sustainable",
];

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function normalizeText(value: string, max = 140) {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function toAdminHolisticProducts(): Product[] {
  return HOLISTIC_PRODUCTS.map((product, index) => {
    const numeric = String(index + 1).padStart(3, "0");
    const costPrice = Math.max(2500, Math.round(product.retailPrice * (0.46 + ((index % 4) * 0.03))));
    return {
      id: `hp_${numeric}`,
      sku: `HLT-${HOLISTIC_CATEGORY_PREFIX[product.category]}-${numeric}`,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      category: product.category as Product["category"],
      description: product.description,
      shortDescription: normalizeText(product.description, 110),
      benefits: product.benefits,
      ingredients: product.ingredients,
      howToUse: product.howToUse,
      images: product.images.length >= 2 ? product.images : [product.images[0], product.images[0]],
      retailPrice: product.retailPrice,
      costPrice,
      availableStock: product.availableStock,
      reservedStock: product.reservedStock,
      soldStock: product.soldStock,
      returnedStock: 0,
      damagedStock: product.damagedStock,
      lowStockThreshold: Math.max(2, Math.min(8, Math.ceil(product.availableStock * 0.25))),
      status: "active",
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
      isNewArrival: product.isNewArrival,
      tags: product.tags,
      seoTitle: undefined,
      seoDescription: undefined,
      createdAt: new Date(2025, index % 12, ((index + 5) * 2) % 27 + 1).toISOString(),
      updatedAt: new Date(2026, 4, ((index + 2) * 3) % 27 + 1).toISOString(),
    };
  });
}

function toHolisticCustomers(): Customer[] {
  return MOCK_CUSTOMERS.map((customer, index) => ({
    ...customer,
    id: `hc_${String(index + 1).padStart(3, "0")}`,
    email: `${customer.fullName.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "")}@holisticmail.com`,
    lifetimeSpend: Math.round(customer.lifetimeSpend * 1.3),
    rewardsBalance: Math.max(0, Math.round(customer.rewardsBalance * 0.6)),
  }));
}

function toHolisticOrders(products: Product[], customers: Customer[]) {
  const productPool = products.filter((product) => product.availableStock > 0);
  return MOCK_ORDERS.map((order, orderIndex) => {
    const customer = customers[orderIndex % customers.length];
    const items: OrderItem[] = order.items.map((item, itemIndex) => {
      const product = productPool[(orderIndex * 2 + itemIndex) % productPool.length];
      const quantity = item.quantity;
      return {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        brand: product.brand,
        image: product.images[0],
        unitPrice: product.retailPrice,
        quantity,
        subtotal: product.retailPrice * quantity,
        costPrice: product.costPrice,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const costOfGoods = items.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
    const deliveryFee = order.deliveryMethod === "pickup" ? Math.max(order.deliveryFee, 3000) : Math.max(order.deliveryFee, DEFAULT_DELIVERY_FEE);
    const total = subtotal + deliveryFee - order.discount;
    const id = `hord_${String(orderIndex + 1).padStart(4, "0")}`;
    const number = `HLT-${2000 + orderIndex}`;

    const podCollection: PodCollection | undefined = order.podCollection
      ? {
          ...order.podCollection,
          amount: total,
          reference: `POD-${number}`,
        }
      : undefined;

    const paystackPayment: PaystackPayment | undefined = order.paystackPayment
      ? {
          ...order.paystackPayment,
          amount: total,
          reference: `hsk_${id}`,
          email: customer.email,
          gatewayFee: Math.round(total * 0.015),
        }
      : undefined;

    return {
      ...order,
      id,
      number,
      customerId: customer.id,
      customerName: customer.fullName,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      items,
      subtotal,
      deliveryFee,
      total,
      costOfGoods,
      estimatedProfit: total - costOfGoods - Math.round(deliveryFee * 0.85),
      address: order.address
        ? {
            ...order.address,
            fullName: customer.fullName,
            phone: customer.phone,
          }
        : undefined,
      podCollection,
      paystackPayment,
      deliveryId: order.deliveryId ? `hdlv_${String(orderIndex + 1).padStart(4, "0")}` : undefined,
      pickupHandoffId: order.pickupHandoffId ? `hph_${String(orderIndex + 1).padStart(4, "0")}` : undefined,
      internalNotes: order.internalNotes.map((note, noteIndex) => ({
        ...note,
        id: `hnote_${orderIndex}_${noteIndex}`,
      })),
    };
  });
}

function buildReplacements(
  products: Product[],
  customers: Customer[],
  orders: AdminOrder[],
) {
  const replacements = new Map<string, string>();

  MOCK_PRODUCTS.forEach((product, index) => {
    const next = products[index % products.length];
    replacements.set(product.id, next.id);
    replacements.set(product.sku, next.sku);
    replacements.set(product.name, next.name);
    replacements.set(product.brand, next.brand);
    replacements.set(product.images[0], next.images[0]);
  });

  MOCK_CUSTOMERS.forEach((customer, index) => {
    const next = customers[index % customers.length];
    replacements.set(customer.id, next.id);
    replacements.set(customer.fullName, next.fullName);
    replacements.set(customer.email, next.email);
    replacements.set(customer.phone, next.phone);
  });

  MOCK_ORDERS.forEach((order, index) => {
    const next = orders[index % orders.length];
    replacements.set(order.id, next.id);
    replacements.set(order.number, next.number);
    replacements.set(`sale_${order.id}`, `sale_${next.id}`);
    replacements.set(`ref_${order.id}`, `ref_${next.id}`);
  });

  return [...replacements.entries()].sort((a, b) => b[0].length - a[0].length);
}

function replaceString(input: string, replacements: Array<[string, string]>) {
  return replacements.reduce(
    (acc, [from, to]) => (acc.includes(from) ? acc.split(from).join(to) : acc),
    input,
  );
}

function deepReplace<T>(value: T, replacements: Array<[string, string]>): T {
  if (typeof value === "string") return replaceString(value, replacements) as T;
  if (Array.isArray(value)) return value.map((item) => deepReplace(item, replacements)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, deepReplace(entry, replacements)]),
    ) as T;
  }
  return value;
}

function toHolisticExpenses(replacements: Array<[string, string]>) {
  return MOCK_EXPENSES.map((expense, index) => ({
    ...deepReplace(expense, replacements),
    id: `hexp_${String(index + 1).padStart(3, "0")}`,
    title:
      index % 4 === 0
        ? replaceString(expense.title, replacements).replace("harbs", "SBM Holistic Farmacy")
        : replaceString(expense.title, replacements),
    amount: Math.round(expense.amount * (1.08 + ((index % 3) * 0.05))),
  }));
}

function toHolisticPickupStations(stations: PickupStation[]): PickupStation[] {
  const names = [
    "Holistic Hub Gbagada",
    "Wellness Pickup Lekki",
    "Holistic Hub Abuja",
    "Plant Care Pickup Ibadan",
  ];
  const addresses = [
    "Plot 12 Trem Drive Way, Landmark Trem Headquarters, Gbagada Express Way",
    "18 Admiralty Way, Lekki Phase 1",
    "42 Aminu Kano Crescent, Wuse 2",
    "5 Ring Road Wellness Arcade, Ibadan",
  ];

  return stations.map((station, index) => ({
    ...station,
    name: names[index % names.length],
    address: addresses[index % addresses.length],
    hours: index % 2 === 0 ? "Mon-Sat · 9am-6pm" : "Mon-Fri · 10am-5pm",
    phone: index % 2 === 0 ? "+2348055530827" : "+2348091124400",
  }));
}

function toHolisticDeliveries(
  deliveries: DeliveryRecord[],
  customers: Customer[],
): DeliveryRecord[] {
  const providers = ["Holistic Dispatch", "Plant Care Rider", "GIG Logistics", "Wellness Route"];
  const pendingCities = ["Gbagada", "Lekki", "Wuse 2", "Ibadan"];

  return deliveries.map((delivery, index) => {
    const customer = customers[index % customers.length];
    const isPending = delivery.status === "pending-assignment";
    return {
      ...delivery,
      orderId: isPending ? `hord_pending_${String(index + 1).padStart(3, "0")}` : delivery.orderId,
      orderNumber: isPending ? `HLT-${2200 + index}` : delivery.orderNumber,
      customerName: isPending ? customer.fullName : delivery.customerName,
      customerPhone: isPending ? customer.phone : delivery.customerPhone,
      city: isPending ? pendingCities[index % pendingCities.length] : delivery.city,
      state: isPending ? (index % 2 === 0 ? "Lagos" : index % 3 === 0 ? "Abuja" : "Oyo") : delivery.state,
      street: isPending ? `${12 + index} Wellness Crescent` : delivery.street,
      provider: providers[index % providers.length],
      trackingNumber: delivery.type === "third-party" ? `HLT-TRK-${(4100 + index).toString(36).toUpperCase()}` : delivery.trackingNumber,
      exceptionNote: delivery.status === "failed-delivery" ? "Customer requested a therapy-session follow-up before redelivery." : delivery.exceptionNote,
      proofFile: delivery.status === "delivered" ? "holistic_delivery_proof.jpg" : delivery.proofFile,
    };
  });
}

function toHolisticPickupHandoffs(
  handoffs: PickupHandoff[],
  stations: PickupStation[],
): PickupHandoff[] {
  return handoffs.map((handoff, index) => {
    const station = stations[index % stations.length];
    return {
      ...handoff,
      stationId: station.id,
      stationName: station.name,
      stationCity: station.city,
      stationState: station.state,
      stationAddress: station.address,
      pickupCode: `HLT-PU-${String(700 + index).padStart(3, "0")}`,
      notes: handoff.status === "ready-for-pickup" ? "Customer asked to collect after therapy-session check-in." : handoff.notes,
    };
  });
}

function toHolisticConsultations(
  consultations: ConsultationRecord[],
  customers: Customer[],
): ConsultationRecord[] {
  return consultations.map((consultation, index) => {
    const customer = customers[index % customers.length];
    return {
      ...consultation,
      id: `hcon_${String(index + 1).padStart(3, "0")}`,
      customerId: customer.id,
      customerName: customer.fullName,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      primaryConcern: HOLISTIC_CONCERNS[index % HOLISTIC_CONCERNS.length],
      goal: HOLISTIC_GOALS[index % HOLISTIC_GOALS.length],
      notes:
        index % 3 === 0
          ? "Client wants a plant-based protocol that combines herbs, nutrition, and lifestyle support."
          : index % 4 === 0
            ? "Requested guidance before starting cleanse or reproductive support products."
            : consultation.notes,
      recommendationId:
        consultation.status === "recommendation-sent" || consultation.status === "completed"
          ? `hrec_${String(index + 1).padStart(3, "0")}`
          : undefined,
    };
  });
}

function toHolisticRecommendations(
  consultations: ConsultationRecord[],
  products: Product[],
): RecommendationRecord[] {
  const pool = products.filter((product) => product.availableStock > 0);

  return consultations
    .filter((consultation) => consultation.recommendationId)
    .map((consultation, index) => {
      const picks = [
        pool[(index * 2) % pool.length],
        pool[(index * 2 + 1) % pool.length],
        pool[(index * 2 + 2) % pool.length],
      ];

      return {
        id: consultation.recommendationId!,
        consultationId: consultation.id,
        consultantId: consultation.consultantId ?? "u_consultant_1",
        consultantName: consultation.consultantName ?? "Ifeoma Nweke",
        title: `${consultation.primaryConcern} therapy plan`,
        note:
          "This plan combines targeted herbs, food rhythm, and supportive lifestyle steps so the client can heal more holistically and consistently.",
        routine: [
          {
            time: "Morning",
            steps: [
              `${picks[0].name} — follow label dose after breakfast`,
              "Begin the day with warm water, light movement, and a simple anti-inflammatory breakfast.",
            ],
          },
          {
            time: "Evening",
            steps: [
              `${picks[1].name} — use as guided during the wind-down routine`,
              `${picks[2].name} — take as the main support product for this protocol`,
            ],
          },
          {
            time: "Weekly",
            steps: [
              "Track symptoms, meals, sleep, and stress triggers before the next therapy check-in.",
            ],
          },
        ],
        products: picks.map((product, productIndex) => ({
          productId: product.id,
          usage: productIndex === 0 ? "Morning support" : productIndex === 1 ? "Evening support" : "Core protocol product",
        })),
        additionalAdvice:
          "Reduce ultra-processed foods, improve hydration, and re-assess with the therapy team in 3 to 6 weeks.",
        sent: consultation.status === "recommendation-sent",
        createdAt: consultation.createdAt,
      };
    });
}

function toHolisticRewards(customers: Customer[]): RewardRecord[] {
  return customers.map((customer, index) => ({
    customerId: customer.id,
    customerName: customer.fullName,
    customerEmail: customer.email,
    current: 90 + ((index * 23) % 420),
    lifetime: 260 + ((index * 37) % 900),
    redeemed: 40 + ((index * 11) % 240),
    lastActivity: new Date(Date.now() - (index + 2) * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  }));
}

function toHolisticRewardActivity(
  rewards: RewardRecord[],
  orders: AdminOrder[],
): RewardActivityRecord[] {
  return rewards.slice(0, 12).flatMap((reward, index) => [
    {
      id: `hrw_${reward.customerId}_1`,
      customerId: reward.customerId,
      date: new Date(Date.now() - (2 + index) * 24 * 60 * 60 * 1000).toISOString(),
      type: "earned",
      points: 70 + index * 9,
      orderNumber: orders[index]?.number,
      note: "Holistic order completed",
    },
    {
      id: `hrw_${reward.customerId}_2`,
      customerId: reward.customerId,
      date: new Date(Date.now() - (12 + index) * 24 * 60 * 60 * 1000).toISOString(),
      type: "redeemed",
      points: -(35 + index * 4),
      orderNumber: orders[index + 3]?.number,
      note: "Applied to therapy-ready wellness checkout",
    },
    ...(index % 4 === 0
      ? [
          {
            id: `hrw_${reward.customerId}_3`,
            customerId: reward.customerId,
            date: new Date(Date.now() - (24 + index) * 24 * 60 * 60 * 1000).toISOString(),
            type: "adjusted" as const,
            points: 20 + index,
            note: "Wellness loyalty bonus after therapy-session follow-up",
            by: "Adaeze Okafor",
          },
        ]
      : []),
  ]);
}

function computeSummaryFromState(state: Pick<PlatformState, "orders" | "expenses">): AccountingSummary {
  const last30Orders = state.orders.filter((order) => {
    const age = Date.now() - Date.parse(order.createdAt);
    return age < 30 * 24 * 60 * 60 * 1000 && !["cancelled", "pending-verification", "pending-payment"].includes(order.status);
  });

  const grossSales = last30Orders.reduce((sum, order) => sum + order.subtotal, 0);
  const netSales = last30Orders.reduce((sum, order) => sum + (order.subtotal - order.discount), 0);
  const discounts = last30Orders.reduce((sum, order) => sum + order.discount, 0);
  const refunds = state.orders
    .filter((order) => order.status === "refunded" || order.status === "partially-refunded")
    .reduce((sum, order) => sum + order.total * (order.status === "partially-refunded" ? 0.5 : 1), 0);
  const cogs = last30Orders.reduce((sum, order) => sum + order.costOfGoods, 0);
  const deliveryFeesCharged = last30Orders.reduce((sum, order) => sum + order.deliveryFee, 0);
  const deliveryFeesActual = Math.round(last30Orders.reduce((sum, order) => sum + order.deliveryFee * 0.85, 0));
  const packagingCosts = last30Orders.reduce((sum, _order, index) => sum + 350 + ((index % 5) * 80), 0);
  const gatewayFees = last30Orders.reduce((sum, order) => sum + (order.paystackPayment?.gatewayFee ?? 0), 0);
  const expenses = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const cashCollected = state.orders
    .filter((order) => order.paymentMethod === "pod" && order.podCollection?.status === "reconciled")
    .reduce((sum, order) => sum + order.total, 0);
  const unreconciledPod = state.orders
    .filter((order) => order.paymentMethod === "pod" && order.podCollection && order.podCollection.status !== "reconciled")
    .reduce((sum, order) => sum + order.total, 0);

  return {
    grossSales,
    netSales,
    discounts,
    refunds,
    cogs,
    deliveryFeesCharged,
    deliveryFeesActual,
    packagingCosts,
    gatewayFees,
    expenses,
    estimatedProfit: netSales - cogs - deliveryFeesActual - packagingCosts - gatewayFees - refunds - expenses,
    cashCollected,
    unreconciledPod,
  };
}

export function createPlatformStateStore(): Record<Platform, PlatformState> {
  const harbs: PlatformState = {
    products: clone(MOCK_PRODUCTS),
    customers: clone(MOCK_CUSTOMERS),
    orders: clone(MOCK_ORDERS),
    deliveries: clone(ALL_DELIVERIES),
    pickupHandoffs: clone(MOCK_PICKUP_HANDOFFS),
    pickupStations: clone(MOCK_PICKUP_STATIONS),
    refunds: clone(MOCK_REFUNDS),
    consultations: clone(MOCK_CONSULTATIONS),
    recommendations: clone(MOCK_RECOMMENDATIONS),
    expenses: clone(MOCK_EXPENSES),
    reconciliation: clone(MOCK_RECONCILIATION),
    movements: clone(MOCK_INVENTORY_MOVEMENTS),
    rewards: clone(MOCK_REWARDS),
    rewardActivity: clone(MOCK_REWARD_ACTIVITY),
  };

  const holisticProducts = toAdminHolisticProducts();
  const holisticCustomers = toHolisticCustomers();
  const holisticOrders = toHolisticOrders(holisticProducts, holisticCustomers);
  const replacements = buildReplacements(holisticProducts, holisticCustomers, holisticOrders);
  const holisticPickupStations = toHolisticPickupStations(
    deepReplace(clone(MOCK_PICKUP_STATIONS), replacements),
  );
  const holisticConsultations = toHolisticConsultations(
    deepReplace(clone(MOCK_CONSULTATIONS), replacements),
    holisticCustomers,
  );
  const holisticRecommendations = toHolisticRecommendations(holisticConsultations, holisticProducts);
  const holisticRewards = toHolisticRewards(holisticCustomers);
  const holisticRewardActivity = toHolisticRewardActivity(holisticRewards, holisticOrders);

  const holistic: PlatformState = {
    products: clone(holisticProducts),
    customers: clone(holisticCustomers),
    orders: clone(holisticOrders),
    deliveries: toHolisticDeliveries(
      deepReplace(clone(ALL_DELIVERIES), replacements),
      holisticCustomers,
    ),
    pickupHandoffs: toHolisticPickupHandoffs(
      deepReplace(clone(MOCK_PICKUP_HANDOFFS), replacements),
      holisticPickupStations,
    ),
    pickupStations: holisticPickupStations,
    refunds: deepReplace(clone(MOCK_REFUNDS), replacements),
    consultations: holisticConsultations,
    recommendations: holisticRecommendations,
    expenses: toHolisticExpenses(replacements),
    reconciliation: deepReplace(clone(MOCK_RECONCILIATION), replacements),
    movements: deepReplace(clone(MOCK_INVENTORY_MOVEMENTS), replacements),
    rewards: holisticRewards,
    rewardActivity: holisticRewardActivity,
  };

  return { harbs, holistic };
}

export function getPlatformSummary(state: Pick<PlatformState, "orders" | "expenses">) {
  return computeSummaryFromState(state);
}

export function getPlatformSalesRecords(orders: AdminOrder[]): SalesRecord[] {
  return orders
    .filter((order) => !["cancelled", "pending-verification", "pending-payment"].includes(order.status))
    .map((order, index) => {
      const isPaid = order.paymentStatus === "paid" || order.paymentStatus === "partially-refunded" || order.paymentStatus === "refunded";
      return {
        id: `sale_${order.id}`,
        orderId: order.id,
        orderNumber: order.number,
        customerName: order.customerName,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus === "failed" ? "pending" : order.paymentStatus,
        orderStatus: order.status,
        grossAmount: order.subtotal,
        discount: order.discount,
        netAmount: order.subtotal - order.discount,
        costOfGoods: order.costOfGoods,
        gatewayFee: order.paystackPayment?.gatewayFee ?? 0,
        deliveryFeeCharged: order.deliveryFee,
        deliveryFeeActual: Math.round(order.deliveryFee * 0.85),
        packagingCost: 350 + ((index % 5) * 80),
        accountingStatus:
          order.paymentMethod === "pod"
            ? order.podCollection?.status === "reconciled"
              ? "reconciled"
              : "open"
            : isPaid
              ? "reconciled"
              : "open",
        date: order.createdAt,
      };
    });
}
