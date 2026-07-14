import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { qk } from "@/lib/query-client";
import { DEFAULT_PAGE_SIZE, paginated } from "@/lib/pagination";
import { normalizeOrderStatus, normalizePaymentMethod, normalizeReconciliation } from "@/lib/admin-normalizers";
import { useAuthStore } from "@/store/auth-store";
import type {
  AccountingSummary,
  Expense,
  ExpenseCategory,
  ProfitLossReport,
  ReconciliationRecord,
  SalesRecord,
} from "@/types/accounting";
import { reportRangeParams, type ReportRange } from "@/features/reports/useReports";

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function normalizeAccountingSummary(data: Partial<AccountingSummary> & Record<string, unknown>): AccountingSummary {
  const unreconciled = data.unreconciled && typeof data.unreconciled === "object"
    ? data.unreconciled as { expectedAmount?: number }
    : undefined;
  return {
    grossSales: numberValue(data.grossSales),
    netSales: numberValue(data.netSales ?? data.netRevenue),
    discounts: numberValue(data.discounts),
    refunds: numberValue(data.refunds),
    cogs: numberValue(data.cogs),
    deliveryFeesCharged: numberValue(data.deliveryFeesCharged),
    deliveryFeesActual: numberValue(data.deliveryFeesActual),
    packagingCosts: numberValue(data.packagingCosts),
    gatewayFees: numberValue(data.gatewayFees),
    expenses: numberValue(data.expenses ?? data.expensesTotal),
    estimatedProfit: numberValue(data.estimatedProfit),
    cashCollected: numberValue(data.cashCollected),
    unreconciledPod: numberValue(data.unreconciledPod ?? unreconciled?.expectedAmount),
  };
}

const EXPENSE_CATEGORY_BY_BACKEND: Record<string, ExpenseCategory> = {
  PRODUCT_COST: "product-cost",
  PACKAGING_COST: "packaging",
  DELIVERY_COST: "delivery-cost",
  MARKETING_COST: "marketing",
  STAFF_EXPENSE: "staff",
  PLATFORM_CHARGES: "platform",
  PAYMENT_GATEWAY_CHARGES: "gateway-fee",
  REFUND_LOSS: "refund-loss",
  DAMAGED_PRODUCT_LOSS: "damaged-loss",
  MISCELLANEOUS: "misc",
};

const EXPENSE_CATEGORY_TO_BACKEND: Record<ExpenseCategory, string> = {
  "product-cost": "PRODUCT_COST",
  packaging: "PACKAGING_COST",
  "delivery-cost": "DELIVERY_COST",
  marketing: "MARKETING_COST",
  staff: "STAFF_EXPENSE",
  platform: "PLATFORM_CHARGES",
  "gateway-fee": "PAYMENT_GATEWAY_CHARGES",
  "refund-loss": "REFUND_LOSS",
  "damaged-loss": "DAMAGED_PRODUCT_LOSS",
  misc: "MISCELLANEOUS",
};

function normalizeExpenseCategory(value: unknown): ExpenseCategory {
  const key = String(value ?? "").toUpperCase();
  return EXPENSE_CATEGORY_BY_BACKEND[key] ?? "misc";
}

function displayName(raw: Record<string, any> | undefined) {
  if (!raw) return undefined;
  return raw.displayName || raw.fullName || [raw.firstName, raw.lastName].filter(Boolean).join(" ") || raw.email;
}

function normalizeSalesRecord(raw: Record<string, any>): SalesRecord {
  const total = numberValue(raw.grandTotal ?? raw.amount ?? raw.netAmount);
  return {
    id: raw.id,
    orderId: raw.orderId ?? raw.id,
    orderNumber: raw.orderNumber ?? raw.order?.orderNumber ?? raw.memo ?? raw.id,
    customerName: raw.customerName ?? raw.order?.shippingName ?? "Customer",
    paymentMethod: normalizePaymentMethod(raw.paymentMethod ?? raw.order?.paymentMethod),
    paymentStatus: "paid",
    orderStatus: normalizeOrderStatus(raw.status ?? raw.order?.status ?? "completed"),
    grossAmount: numberValue(raw.grossAmount ?? raw.subtotal ?? total),
    discount: numberValue(raw.discount ?? raw.discountTotal),
    netAmount: numberValue(raw.netAmount ?? raw.grandTotal ?? raw.amount),
    costOfGoods: numberValue(raw.costOfGoods ?? raw.costTotal),
    gatewayFee: numberValue(raw.gatewayFee ?? raw.fee),
    deliveryFeeCharged: numberValue(raw.deliveryFeeCharged ?? raw.deliveryFee),
    deliveryFeeActual: numberValue(raw.deliveryFeeActual),
    packagingCost: numberValue(raw.packagingCost),
    accountingStatus: "open",
    date: raw.createdAt ?? raw.occurredAt ?? new Date().toISOString(),
  };
}

function normalizeExpense(raw: Record<string, any>): Expense {
  const category = normalizeExpenseCategory(raw.category);
  return {
    id: raw.id,
    title: raw.title ?? raw.note ?? category,
    category,
    amount: numberValue(raw.amount),
    date: raw.incurredAt ?? raw.date ?? raw.createdAt ?? new Date().toISOString(),
    vendor: raw.vendor,
    paymentMethod: raw.paymentMethod ?? "Bank Transfer",
    note: raw.note,
    receiptFile: raw.receiptUrl ?? raw.receiptFile,
    recordedBy: displayName(raw.createdBy) ?? raw.recordedBy ?? "Admin",
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

export function useAccountingSummary() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.accountingSummary(activePlatform),
    queryFn: async () => {
      const { data } = await api.get<Partial<AccountingSummary> & Record<string, unknown>>("/accounting/summary");
      return normalizeAccountingSummary(data);
    },
  });
}

export function useProfitLossReport(range: ReportRange = "30d") {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.reports(activePlatform, `profit-loss:${range}`),
    queryFn: async () => {
      const params = reportRangeParams(range);
      const { data } = await api.get<ProfitLossReport>(`/reports/profit-loss?${params.toString()}`);
      return data;
    },
  });
}

export function useAllTransactions(params: { page?: number; limit?: number; dateFrom?: string; dateTo?: string } = {}) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const page = params.page ?? 1;
  const limit = params.limit ?? DEFAULT_PAGE_SIZE;
  return useQuery({
    queryKey: qk.accountingSummary(activePlatform).concat(["transactions", params] as any),
    queryFn: async () => {
      const search = new URLSearchParams();
      search.set("page", String(page));
      search.set("limit", String(limit));
      if (params.dateFrom) search.set("dateFrom", params.dateFrom);
      if (params.dateTo) search.set("dateTo", params.dateTo);
      const { data } = await api.get<any>(`/accounting/transactions?${search.toString()}`);
      return paginated(data, page, limit);
    },
  });
}

export function useSales(params: { page?: number; limit?: number; dateFrom?: string; dateTo?: string } = {}) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const page = params.page ?? 1;
  const limit = params.limit ?? DEFAULT_PAGE_SIZE;
  return useQuery({
    queryKey: qk.sales(activePlatform, params),
    queryFn: async () => {
      const search = new URLSearchParams();
      search.set("page", String(page));
      search.set("limit", String(limit));
      if (params.dateFrom) search.set("dateFrom", params.dateFrom);
      if (params.dateTo) search.set("dateTo", params.dateTo);
      const { data } = await api.get<unknown[] | { items?: unknown[]; meta?: any }>(`/reports/sales?${search.toString()}`);
      const result = paginated(data, page, limit);
      return {
        items: result.items.map((item) => normalizeSalesRecord(item as Record<string, any>)),
        meta: result.meta,
      };
    },
  });
}

export function useExpenses(params: { category?: string; page?: number; limit?: number } = {}) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const page = params.page ?? 1;
  const limit = params.limit ?? DEFAULT_PAGE_SIZE;
  return useQuery({
    queryKey: qk.expenses(activePlatform, params),
    queryFn: async () => {
      const search = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (params.category) search.set("category", EXPENSE_CATEGORY_TO_BACKEND[params.category as ExpenseCategory] ?? params.category);
      const { data } = await api.get<unknown[] | { items?: unknown[]; meta?: any }>(`/accounting/expenses?${search.toString()}`);
      const result = paginated(data, page, limit);
      return {
        items: result.items.map((item) => normalizeExpense(item as Record<string, any>)),
        meta: result.meta,
      };
    },
  });
}

export function useCreateExpense() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Omit<Expense, "id" | "createdAt">) => {
      const note = [
        body.title,
        body.vendor ? `Vendor: ${body.vendor}` : undefined,
        body.paymentMethod ? `Payment: ${body.paymentMethod}` : undefined,
        body.note,
      ].filter(Boolean).join("\n");
      const { data } = await api.post<Record<string, any>>("/accounting/expenses", {
        category: EXPENSE_CATEGORY_TO_BACKEND[body.category],
        amount: body.amount,
        note,
        receiptUrl: body.receiptFile,
        incurredAt: new Date(body.date).toISOString(),
      });
      return normalizeExpense(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.expenses(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.accountingSummary(activePlatform) });
    },
  });
}

export function useReconciliation(params: { status?: string; page?: number; limit?: number } = {}) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const page = params.page ?? 1;
  const limit = params.limit ?? DEFAULT_PAGE_SIZE;
  return useQuery({
    queryKey: qk.reconciliation(activePlatform, params),
    queryFn: async () => {
      const search = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (params.status) search.set("status", params.status.toUpperCase().replace(/-/g, "_"));
      const { data } = await api.get<unknown[] | { items?: unknown[]; meta?: any }>(`/accounting/reconciliation?${search.toString()}`);
      const result = paginated(data, page, limit);
      return {
        items: result.items.map((item) => normalizeReconciliation(item as Record<string, any>)),
        meta: result.meta,
      };
    },
  });
}

export function useReconcile() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      note,
    }: {
      id: string;
      status: "reconciled" | "discrepancy";
      note: string;
    }) => {
      const endpoint = status === "reconciled" ? "mark-reconciled" : "flag-discrepancy";
      const { data } = await api.post<ReconciliationRecord>(`/accounting/reconciliation/${id}/${endpoint}`, {
        note,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.reconciliation(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.accountingSummary(activePlatform) });
    },
  });
}
