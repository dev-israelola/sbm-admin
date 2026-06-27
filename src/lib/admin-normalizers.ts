import type { DeliveryAssignment, DeliveryStatus, DeliveryType } from "@/types/delivery";
import type { AdminOrder, DeliveryMethod, OrderStatus, PaymentMethod, PaymentStatus } from "@/types/order";
import type { Product, ProductStatus } from "@/types/product";
import type { ReconciliationRecord, ReconciliationStatus } from "@/types/accounting";

type AnyRecord = Record<string, any>;

const kebab = (value: unknown) => String(value ?? "").toLowerCase().replace(/_/g, "-");
const upperSnake = (value: string) => value.toUpperCase().replace(/-/g, "_");

function actorName(actor: AnyRecord | null | undefined) {
  if (!actor) return "Admin";
  return actor.displayName || [actor.firstName, actor.lastName].filter(Boolean).join(" ") || actor.email || "Admin";
}

export function toBackendOrderStatus(status: OrderStatus) {
  return status === "cash-collected" ? "CASH_TRANSFER_COLLECTED" : upperSnake(status);
}

export function toBackendPaymentMethod(method: PaymentMethod) {
  if (method === "pod") return "PAYMENT_ON_DELIVERY";
  if (method === "bank_transfer") return "BANK_TRANSFER";
  return "PAYSTACK";
}

export function toBackendDeliveryMethod(method: DeliveryMethod) {
  return method === "pickup" ? "PICKUP_STATION" : "HOME_DELIVERY";
}

export function toBackendDeliveryStatus(status: DeliveryStatus) {
  return upperSnake(status);
}

export function normalizePaymentMethod(value: unknown): PaymentMethod {
  if (value === "BANK_TRANSFER" || value === "bank_transfer") return "bank_transfer";
  if (value === "PAYMENT_ON_DELIVERY" || value === "pod") return "pod";
  return "paystack";
}

export function paymentMethodLabel(method: PaymentMethod): string {
  if (method === "paystack") return "Paystack";
  if (method === "bank_transfer") return "Bank transfer";
  return "Payment on delivery";
}

export function paymentMethodShort(method: PaymentMethod): string {
  if (method === "paystack") return "Paystack";
  if (method === "bank_transfer") return "Transfer";
  return "POD";
}

export function normalizePaymentStatus(value: unknown): PaymentStatus {
  return kebab(value) as PaymentStatus;
}

export function normalizeOrderStatus(value: unknown): OrderStatus {
  const next = kebab(value);
  return (next === "cash-transfer-collected" ? "cash-collected" : next) as OrderStatus;
}

export function normalizeProductStatus(value: unknown): ProductStatus {
  return kebab(value) as ProductStatus;
}

export function normalizeProduct(raw: AnyRecord): Product {
  const images = Array.isArray(raw.images)
    ? raw.images.map((image: AnyRecord | string) => (typeof image === "string" ? image : image.url)).filter(Boolean)
    : [];
  const contentSections = Array.isArray(raw.contentSections) ? raw.contentSections : [];
  const sectionBody = (key: string) => {
    const section = contentSections.find((item: AnyRecord) => item.tabKey === key || item.title?.toLowerCase() === key);
    if (!section?.body) return [];
    return String(section.body).split(/\n+/).map((line) => line.trim()).filter(Boolean);
  };

  return {
    id: raw.id,
    sku: raw.sku ?? "",
    name: raw.name ?? "",
    slug: raw.slug ?? raw.id,
    brand: raw.brand ?? raw.category?.name ?? "SBM",
    category: raw.category?.slug ?? raw.category ?? "herbal-wellness",
    categoryId: raw.category?.id ?? raw.categoryId,
    description: raw.description ?? "",
    shortDescription: raw.shortDescription ?? String(raw.description ?? "").slice(0, 140),
    benefits: raw.benefits ?? sectionBody("benefits"),
    ingredients: raw.ingredients ?? sectionBody("ingredients"),
    howToUse: raw.howToUse ?? sectionBody("how-to-use"),
    images,
    retailPrice: raw.retailPrice ?? 0,
    costPrice: raw.costPrice ?? 0,
    availableStock: raw.availableStock ?? 0,
    reservedStock: raw.reservedStock ?? 0,
    soldStock: raw.soldStock ?? raw.totalSales ?? 0,
    returnedStock: raw.returnedStock ?? 0,
    damagedStock: raw.damagedStock ?? 0,
    lowStockThreshold: raw.lowStockThreshold ?? 5,
    status: normalizeProductStatus(raw.status ?? "active"),
    isFeatured: Boolean(raw.isFeatured),
    isBestSeller: Boolean(raw.isBestSeller),
    isNewArrival: Boolean(raw.isNewArrival),
    concerns: Array.isArray(raw.concerns)
      ? raw.concerns.map((c: AnyRecord | string) => (typeof c === "string" ? c : c.slug)).filter(Boolean)
      : [],
    bulkMinQty: raw.bulkMinQty ?? null,
    bulkDiscountType: raw.bulkDiscountType ?? null,
    bulkDiscountValue: raw.bulkDiscountValue ?? null,
    tags: raw.tags ?? [],
    seoTitle: raw.seoTitle,
    seoDescription: raw.seoDescription,
    createdAt: raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? raw.createdAt ?? new Date().toISOString(),
  };
}

export function normalizeOrder(raw: AnyRecord): AdminOrder {
  const items = Array.isArray(raw.items) ? raw.items : [];
  const subtotal = raw.subtotal ?? 0;
  const discount = (raw.discountTotal ?? 0) + (raw.rewardDiscount ?? 0);
  const total = raw.grandTotal ?? raw.total ?? subtotal + (raw.deliveryFee ?? 0) - discount;
  const customerName = raw.shippingName ?? raw.customerName ?? "Customer";
  const createdAt = raw.createdAt ?? new Date().toISOString();

  return {
    id: raw.id,
    number: raw.orderNumber ?? raw.number ?? raw.id,
    createdAt,
    status: normalizeOrderStatus(raw.status),
    paymentStatus: normalizePaymentStatus(raw.paymentStatus),
    paymentMethod: normalizePaymentMethod(raw.paymentMethod),
    deliveryMethod: (raw.deliveryMethod === "PICKUP_STATION" ? "pickup" : "home") as DeliveryMethod,
    pickupStation:
      raw.deliveryMethod === "PICKUP_STATION" && (raw.pickupStationName || raw.pickupStationAddress)
        ? {
            id: raw.pickupStationId ?? "",
            name: raw.pickupStationName ?? "Pickup station",
            address: raw.pickupStationAddress ?? "",
            city: raw.pickupStationCity ?? "",
            state: raw.pickupStationState ?? "",
            hours: "",
            phone: "",
            fee: raw.deliveryFee ?? 0,
          }
        : raw.pickupStation,
    delivery: raw.delivery
      ? {
          id: raw.delivery.id,
          status: kebab(raw.delivery.status) as DeliveryStatus,
          deliveryType: raw.delivery.deliveryType === "THIRD_PARTY_LOGISTICS" ? "third-party" : "internal",
          assigneeId: raw.delivery.assignedToUserId ?? undefined,
          assigneeName: raw.delivery.assignedTo
            ? raw.delivery.assignedTo.displayName ||
              [raw.delivery.assignedTo.firstName, raw.delivery.assignedTo.lastName].filter(Boolean).join(" ") ||
              undefined
            : undefined,
          provider: raw.delivery.logisticsProvider ?? undefined,
          trackingNumber: raw.delivery.trackingNumber ?? undefined,
        }
      : undefined,
    customerId: raw.userId ?? raw.customerId ?? "",
    customerName,
    customerEmail: raw.customerEmail ?? "",
    customerPhone: raw.customerPhone ?? "",
    items: items.map((item: AnyRecord) => ({
      productId: item.productId ?? item.id,
      sku: item.sku ?? "",
      name: item.name ?? "",
      brand: item.brand ?? "SBM",
      image: item.image ?? "",
      unitPrice: item.unitPrice ?? 0,
      quantity: item.quantity ?? 0,
      subtotal: item.lineTotal ?? item.subtotal ?? 0,
      costPrice: item.costPrice ?? 0,
    })),
    subtotal,
    deliveryFee: raw.deliveryFee ?? 0,
    discount,
    pointsApplied: raw.rewardPointsUsed ?? raw.pointsApplied ?? 0,
    pointsValue: raw.rewardDiscount ?? raw.pointsValue ?? 0,
    pointsEarned: raw.pointsEarned ?? 0,
    total,
    costOfGoods: raw.costTotal ?? 0,
    estimatedProfit: total - (raw.costTotal ?? 0),
    address: {
      fullName: customerName,
      phone: raw.customerPhone ?? "",
      street: raw.shippingLine1 ?? "",
      city: raw.shippingCity ?? "",
      state: raw.shippingState ?? "",
      country: raw.shippingCountry ?? "NG",
    },
    notes: raw.customerNote ?? "",
    estimatedDelivery: raw.delivery?.estimatedDeliveryDate ?? createdAt,
    timeline: (raw.statusHistory ?? [{ status: raw.status, createdAt }]).map((entry: AnyRecord) => ({
      status: normalizeOrderStatus(entry.status),
      timestamp: entry.createdAt ?? createdAt,
      note: entry.note,
    })),
    internalNotes: (raw.internalNotes ?? []).map((note: AnyRecord) => ({
      id: note.id,
      by: note.by ?? actorName(note.actor),
      at: note.at ?? note.createdAt,
      body: note.body,
    })),
    deliveryId: raw.delivery?.id,
  };
}

export function normalizeDelivery(raw: AnyRecord): DeliveryAssignment {
  const status = kebab(raw.status) as DeliveryStatus;
  const type: DeliveryType = raw.deliveryType === "THIRD_PARTY_LOGISTICS" ? "third-party" : "internal";
  return {
    id: raw.id,
    orderId: raw.orderId ?? "",
    orderNumber: raw.order?.orderNumber ?? raw.orderNumber ?? raw.orderId ?? "",
    customerName: raw.order?.shippingName ?? raw.customerName ?? "Customer",
    customerPhone: raw.order?.customerPhone ?? raw.customerPhone ?? "",
    city: raw.order?.shippingCity ?? raw.city ?? "",
    state: raw.order?.shippingState ?? raw.state ?? "",
    street: raw.order?.shippingLine1 ?? raw.street ?? "",
    type,
    provider: raw.logisticsProvider ?? raw.provider,
    trackingNumber: raw.trackingNumber,
    assigneeId: raw.assignedToUserId ?? raw.assigneeId,
    assigneeName: raw.assignedTo
      ? actorName(raw.assignedTo)
      : raw.assignedToUser?.displayName ?? raw.assigneeName,
    status,
    paymentMethod: normalizePaymentMethod(raw.order?.paymentMethod ?? raw.paymentMethod),
    amountToCollect: raw.order?.grandTotal ?? raw.amountToCollect ?? 0,
    collectionStatus: "not-applicable",
    deliveryFee: raw.deliveryFee ?? raw.order?.deliveryFee ?? 0,
    exceptionNote: raw.deliveryNote ?? raw.exceptionNote,
    proofFile: raw.proofOfDeliveryUrl ?? raw.proofUrl ?? raw.proofFile,
    scheduledFor: raw.estimatedDeliveryDate ?? raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? raw.createdAt ?? new Date().toISOString(),
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

function normalizeCollectionMethod(value: unknown): ReconciliationRecord["collectionMethod"] {
  const v = kebab(value);
  return v === "bank-transfer" || v === "pos" ? v : "cash";
}

export function normalizeReconciliation(raw: AnyRecord): ReconciliationRecord {
  const expected = raw.expectedAmount ?? raw.amountExpected ?? 0;
  const collected = raw.amountCollected ?? 0;
  return {
    id: raw.id,
    orderId: raw.orderId ?? "",
    orderNumber: raw.order?.orderNumber ?? raw.orderNumber ?? raw.orderId ?? "",
    customerName: raw.order?.shippingName ?? raw.order?.customerEmail ?? raw.customerName ?? "Customer",
    amountExpected: expected,
    amountCollected: collected,
    difference: raw.discrepancyAmount ?? raw.difference ?? collected - expected,
    collectionMethod: normalizeCollectionMethod(raw.collectionMethod),
    collectedBy: raw.collectedBy ? actorName(raw.collectedBy) : raw.collectedByName ?? "-",
    collectedAt: raw.collectionDate ?? raw.collectedAt ?? raw.createdAt ?? new Date().toISOString(),
    status: kebab(raw.status) as ReconciliationStatus,
    reconciledBy: raw.reconciledBy ? actorName(raw.reconciledBy) : raw.reconciledByName,
    reconciledAt: raw.reconciledAt ?? undefined,
    note: raw.accountantNote ?? raw.note ?? undefined,
  };
}
