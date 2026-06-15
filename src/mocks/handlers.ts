import { http, HttpResponse, delay } from "msw";
import { MOCK_STAFF, DEMO_CREDENTIALS } from "@/data/mock-users";
import { MOCK_DELIVERY_OPTIONS } from "@/data/mock-delivery-options";
import {
  createPlatformStateStore,
  getPlatformSalesRecords,
  getPlatformSummary,
} from "@/data/platform-mocks";
import { uid } from "@/lib/utils";
import type { AdminOrder, OrderStatus } from "@/types/order";
import type { PickupHandoff, PickupStation } from "@/types/delivery";
import type { Platform } from "@/types/platform";

const lag = () => delay(220 + Math.random() * 220);

const stateByPlatform = createPlatformStateStore();
const state = stateByPlatform.naturale;

function resolvePlatform(request: Request): Platform {
  return request.headers.get("x-platform") === "holistic" ? "holistic" : "naturale";
}

function currentState(request: Request) {
  return stateByPlatform[resolvePlatform(request)];
}

function transitionOrder(order: AdminOrder, status: OrderStatus, by: string, note?: string) {
  order.status = status;
  order.timeline = [
    ...order.timeline,
    { status, timestamp: new Date().toISOString(), by, note },
  ];
}

function buildDeliveryOptions(current = state) {
  return {
    ...MOCK_DELIVERY_OPTIONS,
    pickupStations: current.pickupStations.filter((s) => s.active),
  };
}

export const handlers = [
  // ---------- auth ----------
  http.post("/api/auth/login", async ({ request }) => {
    await lag();
    const body = (await request.json()) as { email: string; password: string };
    const match = DEMO_CREDENTIALS.find((c) => c.email === body.email);
    if (!match) {
      return HttpResponse.json({ message: "Unknown email" }, { status: 401 });
    }
    const user = MOCK_STAFF.find((u) => u.email === match.email)!;
    return HttpResponse.json({
      token: `mock-${user.id}`,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        platforms: user.platforms,
      },
    });
  }),

  http.get("/api/me", async () => {
    await lag();
    return HttpResponse.json({ ok: true });
  }),

  http.get("/api/users", async () => {
    await lag();
    return HttpResponse.json(MOCK_STAFF);
  }),

  http.get("/api/customers", async ({ request }) => {
    await lag();
    return HttpResponse.json(currentState(request).customers);
  }),

  // ---------- summary ----------
  http.get("/api/admin/summary", async ({ request }) => {
    await lag();
    const current = currentState(request);
    const summary = getPlatformSummary(current);
    const pendingVerification = current.orders.filter((o) => o.status === "pending-verification").length;
    const podOrders = current.orders.filter((o) => o.paymentMethod === "pod").length;
    const paystackOrders = current.orders.filter((o) => o.paymentMethod === "paystack").length;
    const lowStock = current.products.filter((p) => p.availableStock <= p.lowStockThreshold).length;
    const pendingRefunds = current.refunds.filter((r) =>
      ["submitted", "under-review"].includes(r.status),
    ).length;
    const pendingPickup = current.orders.filter((o) => o.status === "ready-for-pickup").length;
    return HttpResponse.json({
      summary,
      counts: {
        pendingOrders: current.orders.filter((o) =>
          ["order-created", "pending-payment", "pending-verification", "verified", "pending-fulfillment", "packed", "ready-for-dispatch"].includes(o.status),
        ).length,
        pendingVerification,
        podOrders,
        paystackOrders,
        lowStock,
        pendingRefunds,
        pendingPickup,
      },
    });
  }),

  // ---------- products ----------
  http.get("/api/products", async ({ request }) => {
    await lag();
    const current = currentState(request);
    const url = new URL(request.url);
    const search = url.searchParams.get("q")?.toLowerCase() ?? "";
    const category = url.searchParams.get("category");
    const status = url.searchParams.get("status");
    let items = current.products;
    if (search) items = items.filter((p) => (`${p.name} ${p.sku}`).toLowerCase().includes(search));
    if (category) items = items.filter((p) => p.category === category);
    if (status) items = items.filter((p) => p.status === status);
    return HttpResponse.json({ items, total: items.length });
  }),

  http.get("/api/products/:id", async ({ params, request }) => {
    await lag();
    const product = currentState(request).products.find((p) => p.id === params.id || p.slug === params.id);
    if (!product) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(product);
  }),

  http.post("/api/products", async ({ request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as any;
    const product = {
      ...body,
      id: uid("p"),
      sku: body.sku ?? `${resolvePlatform(request) === "holistic" ? "HLT" : "HRB"}-NEW-${current.products.length + 1}`,
      reservedStock: 0,
      soldStock: 0,
      returnedStock: 0,
      damagedStock: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    current.products = [product, ...current.products];
    return HttpResponse.json(product);
  }),

  http.put("/api/products/:id", async ({ params, request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as any;
    current.products = current.products.map((p) =>
      p.id === params.id ? { ...p, ...body, updatedAt: new Date().toISOString() } : p,
    );
    const updated = current.products.find((p) => p.id === params.id);
    return HttpResponse.json(updated);
  }),

  // ---------- inventory ----------
  http.get("/api/inventory", async ({ request }) => {
    await lag();
    return HttpResponse.json(currentState(request).products);
  }),
  http.get("/api/inventory/movements", async ({ request }) => {
    await lag();
    return HttpResponse.json(currentState(request).movements);
  }),
  http.post("/api/inventory/:id/adjust", async ({ params, request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as { delta: number; reason: string; by: string };
    current.products = current.products.map((p) =>
      p.id === params.id
        ? {
            ...p,
            availableStock: Math.max(0, p.availableStock + body.delta),
            updatedAt: new Date().toISOString(),
        }
        : p,
    );
    const p = current.products.find((p) => p.id === params.id);
    current.movements = [
      {
        id: uid("mov"),
        productId: p!.id,
        productName: p!.name,
        sku: p!.sku,
        type: "stock-adjusted",
        quantity: body.delta,
        reason: body.reason,
        by: body.by,
        at: new Date().toISOString(),
      },
      ...current.movements,
    ];
    return HttpResponse.json(p);
  }),

  // ---------- orders ----------
  http.get("/api/orders", async ({ request }) => {
    await lag();
    const current = currentState(request);
    const url = new URL(request.url);
    const search = url.searchParams.get("q")?.toLowerCase() ?? "";
    const status = url.searchParams.get("status");
    const paymentMethod = url.searchParams.get("paymentMethod");
    const deliveryMethod = url.searchParams.get("deliveryMethod");
    let items = current.orders;
    if (search) items = items.filter((o) => (`${o.number} ${o.customerName}`).toLowerCase().includes(search));
    if (status) items = items.filter((o) => o.status === status);
    if (paymentMethod) items = items.filter((o) => o.paymentMethod === paymentMethod);
    if (deliveryMethod) items = items.filter((o) => o.deliveryMethod === deliveryMethod);
    return HttpResponse.json({ items, total: items.length });
  }),

  http.get("/api/orders/:id", async ({ params, request }) => {
    await lag();
    const order = currentState(request).orders.find((o) => o.id === params.id || o.number === params.id);
    if (!order) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(order);
  }),

  http.post("/api/orders/:id/verify-pod", async ({ params, request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as { result: "verified" | "rejected"; note: string; contactMethod?: string; expectedDelivery?: string; by: string };
    const order = current.orders.find((o) => o.id === params.id);
    if (!order) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    if (body.result === "verified") {
      transitionOrder(order, "verified", body.by, body.note);
      order.verifiedBy = body.by;
      if (body.expectedDelivery) order.estimatedDelivery = body.expectedDelivery;
    } else {
      transitionOrder(order, "cancelled", body.by, body.note);
    }
    return HttpResponse.json(order);
  }),

  http.post("/api/orders/:id/status", async ({ params, request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as { status: OrderStatus; note?: string; by: string };
    const order = current.orders.find((o) => o.id === params.id);
    if (!order) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    transitionOrder(order, body.status, body.by, body.note);
    return HttpResponse.json(order);
  }),

  http.post("/api/orders/:id/notes", async ({ params, request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as { body: string; by: string };
    const order = current.orders.find((o) => o.id === params.id);
    if (!order) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    order.internalNotes = [
      ...order.internalNotes,
      { id: uid("note"), at: new Date().toISOString(), by: body.by, body: body.body },
    ];
    return HttpResponse.json(order);
  }),

  http.post("/api/orders/:id/pod-collection", async ({ params, request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as any;
    const order = current.orders.find((o) => o.id === params.id);
    if (!order) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    order.podCollection = { ...body, status: "collected" };
    transitionOrder(order, "cash-collected", body.collectedBy, "Cash/transfer collected on delivery.");
    return HttpResponse.json(order);
  }),

  http.post("/api/orders/:id/reconcile", async ({ params, request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as { status: "reconciled" | "discrepancy"; note?: string; by: string };
    const order = current.orders.find((o) => o.id === params.id);
    if (!order) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    if (order.podCollection) {
      order.podCollection.status = body.status;
      order.podCollection.reconciliationNote = body.note;
    }
    if (body.status === "reconciled") {
      transitionOrder(order, "completed", body.by, "Payment reconciled.");
    }
    return HttpResponse.json(order);
  }),

  // ---------- deliveries (home) ----------
  http.get("/api/deliveries", async ({ request }) => {
    await lag();
    const current = currentState(request);
    const url = new URL(request.url);
    const assigneeId = url.searchParams.get("assigneeId");
    const status = url.searchParams.get("status");
    let items = current.deliveries;
    if (assigneeId) items = items.filter((d) => d.assigneeId === assigneeId);
    if (status) items = items.filter((d) => d.status === status);
    return HttpResponse.json(items);
  }),

  http.get("/api/deliveries/:id", async ({ params, request }) => {
    await lag();
    const d = currentState(request).deliveries.find((d) => d.id === params.id);
    if (!d) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(d);
  }),

  http.post("/api/deliveries/:id/assign", async ({ params, request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as any;
    const d = current.deliveries.find((d) => d.id === params.id);
    if (!d) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    Object.assign(d, body, { status: "assigned", updatedAt: new Date().toISOString() });
    return HttpResponse.json(d);
  }),

  http.post("/api/deliveries/:id/status", async ({ params, request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as any;
    const d = current.deliveries.find((d) => d.id === params.id);
    if (!d) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    d.status = body.status;
    d.exceptionNote = body.note;
    d.updatedAt = new Date().toISOString();
    return HttpResponse.json(d);
  }),

  // ---------- pickup handoffs ----------
  http.get("/api/pickup-handoffs", async ({ request }) => {
    await lag();
    const current = currentState(request);
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const stationId = url.searchParams.get("stationId");
    let items = current.pickupHandoffs;
    if (status) items = items.filter((h) => h.status === status);
    if (stationId) items = items.filter((h) => h.stationId === stationId);
    return HttpResponse.json(items);
  }),
  http.post("/api/pickup-handoffs/:id/collect", async ({ params, request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as { by: string };
    const h = current.pickupHandoffs.find((h) => h.id === params.id);
    if (!h) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    h.status = "picked-up";
    h.pickedUpAt = new Date().toISOString();
    h.updatedAt = h.pickedUpAt;
    const order = current.orders.find((o) => o.id === h.orderId);
    if (order) transitionOrder(order, "picked-up", body.by, "Customer collected at pickup station.");
    return HttpResponse.json(h);
  }),

  // ---------- pickup stations CRUD ----------
  http.get("/api/pickup-stations", async ({ request }) => {
    await lag();
    return HttpResponse.json(currentState(request).pickupStations);
  }),
  http.post("/api/pickup-stations", async ({ request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as Omit<PickupStation, "id">;
    const station: PickupStation = { id: uid("ps"), ...body };
    current.pickupStations = [station, ...current.pickupStations];
    return HttpResponse.json(station);
  }),
  http.put("/api/pickup-stations/:id", async ({ params, request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as PickupStation;
    current.pickupStations = current.pickupStations.map((s) =>
      s.id === params.id ? { ...s, ...body, id: s.id } : s,
    );
    const updated = current.pickupStations.find((s) => s.id === params.id);
    return HttpResponse.json(updated);
  }),
  http.delete("/api/pickup-stations/:id", async ({ params, request }) => {
    await lag();
    const current = currentState(request);
    current.pickupStations = current.pickupStations.filter((s) => s.id !== params.id);
    return HttpResponse.json({ ok: true });
  }),

  // ---------- delivery options (for Client storefront mirror) ----------
  http.get("/api/delivery/options", async ({ request }) => {
    await lag();
    return HttpResponse.json(buildDeliveryOptions(currentState(request)));
  }),

  // ---------- refunds ----------
  http.get("/api/refunds", async ({ request }) => {
    await lag();
    return HttpResponse.json(currentState(request).refunds);
  }),
  http.get("/api/refunds/:id", async ({ params, request }) => {
    await lag();
    const r = currentState(request).refunds.find((r) => r.id === params.id);
    if (!r) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(r);
  }),
  http.post("/api/refunds/:id/decide", async ({ params, request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as { decision: "approve" | "reject" | "refund" | "partial"; note: string; by: string };
    const r = current.refunds.find((r) => r.id === params.id);
    if (!r) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    r.status =
      body.decision === "approve"
        ? "approved"
        : body.decision === "reject"
          ? "rejected"
          : body.decision === "refund"
            ? "refunded"
            : "partially-refunded";
    r.decisionNote = body.note;
    r.assignedReviewer = body.by;
    r.decidedAt = new Date().toISOString();
    return HttpResponse.json(r);
  }),

  // ---------- consultations ----------
  http.get("/api/consultations", async ({ request }) => {
    await lag();
    return HttpResponse.json(currentState(request).consultations);
  }),
  http.get("/api/consultations/:id", async ({ params, request }) => {
    await lag();
    const c = currentState(request).consultations.find((c) => c.id === params.id);
    if (!c) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(c);
  }),
  http.post("/api/consultations/:id/assign", async ({ params, request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as { consultantId: string; consultantName: string };
    const c = current.consultations.find((c) => c.id === params.id);
    if (!c) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    c.consultantId = body.consultantId;
    c.consultantName = body.consultantName;
    if (c.status === "pending") c.status = "scheduled";
    return HttpResponse.json(c);
  }),
  http.post("/api/consultations/:id/recommendation", async ({ params, request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as any;
    const c = current.consultations.find((c) => c.id === params.id);
    if (!c) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    const rec = {
      ...body,
      id: uid("rec"),
      consultationId: c.id,
      sent: !!body.sent,
      createdAt: new Date().toISOString(),
    };
    current.recommendations = [rec, ...current.recommendations];
    c.recommendationId = rec.id;
    c.status = body.sent ? "recommendation-sent" : "completed";
    return HttpResponse.json(rec);
  }),
  http.get("/api/recommendations/:id", async ({ params, request }) => {
    await lag();
    const rec = currentState(request).recommendations.find((r) => r.id === params.id);
    if (!rec) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(rec);
  }),

  // ---------- rewards ----------
  http.get("/api/rewards", async ({ request }) => {
    await lag();
    return HttpResponse.json(currentState(request).rewards);
  }),
  http.get("/api/rewards/:customerId", async ({ params, request }) => {
    await lag();
    const current = currentState(request);
    const r = current.rewards.find((reward) => reward.customerId === params.customerId);
    const activity = current.rewardActivity.filter((entry) => entry.customerId === params.customerId);
    if (!r) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json({ ...r, activity });
  }),
  http.post("/api/rewards/:customerId/adjust", async ({ params, request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as { delta: number; reason: string; by: string };
    const r = current.rewards.find((reward) => reward.customerId === params.customerId);
    if (!r) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    r.current = Math.max(0, r.current + body.delta);
    return HttpResponse.json(r);
  }),

  // ---------- accounting ----------
  http.get("/api/accounting/summary", async ({ request }) => {
    await lag();
    return HttpResponse.json(getPlatformSummary(currentState(request)));
  }),
  http.get("/api/accounting/sales", async ({ request }) => {
    await lag();
    return HttpResponse.json(getPlatformSalesRecords(currentState(request).orders));
  }),
  http.get("/api/accounting/expenses", async ({ request }) => {
    await lag();
    return HttpResponse.json(currentState(request).expenses);
  }),
  http.post("/api/accounting/expenses", async ({ request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as any;
    const expense = { ...body, id: uid("exp"), createdAt: new Date().toISOString() };
    current.expenses = [expense, ...current.expenses];
    return HttpResponse.json(expense);
  }),
  http.get("/api/accounting/reconciliation", async ({ request }) => {
    await lag();
    return HttpResponse.json(currentState(request).reconciliation);
  }),
  http.post("/api/accounting/reconciliation/:id", async ({ params, request }) => {
    await lag();
    const current = currentState(request);
    const body = (await request.json()) as { status: "reconciled" | "discrepancy"; note?: string; by: string };
    const r = current.reconciliation.find((r) => r.id === params.id);
    if (!r) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    r.status = body.status;
    r.note = body.note;
    if (body.status === "reconciled") {
      r.reconciledBy = body.by;
      r.reconciledAt = new Date().toISOString();
    }
    return HttpResponse.json(r);
  }),
];
