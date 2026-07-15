import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { qk } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import type { RefundRequest, RefundStatus } from "@/types/refund";

function normalizeItems<T>(data: T[] | { items?: T[] }) {
  return Array.isArray(data) ? data : data.items ?? [];
}

interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface RefundListParams {
  page?: number;
  limit?: number;
  status?: RefundStatus | "all";
  search?: string;
}

const STATUS_TO_BACKEND: Record<RefundStatus, string> = {
  submitted: "SUBMITTED",
  "under-review": "UNDER_REVIEW",
  approved: "APPROVED",
  rejected: "REJECTED",
  refunded: "REFUNDED",
  "partially-refunded": "PARTIALLY_REFUNDED",
};

const REASON_TO_BACKEND: Record<string, string> = {
  "Wrong item delivered": "WRONG_ITEM_DELIVERED",
  "Damaged product": "DAMAGED_PRODUCT",
  "Expired product": "EXPIRED_PRODUCT",
  "Failed delivery": "FAILED_DELIVERY",
  "Payment issue": "PAYMENT_ISSUE",
  "Duplicate order": "DUPLICATE_ORDER",
  "Customer changed mind": "CUSTOMER_CHANGED_MIND",
  "Ordered by mistake": "CUSTOMER_CHANGED_MIND",
  "Found a better price": "CUSTOMER_CHANGED_MIND",
  "Changed my mind": "CUSTOMER_CHANGED_MIND",
  "Taking too long to ship": "OTHER",
  "Other": "OTHER"
};

const EMPTY_META = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
};

function paginated<T>(data: T[] | PaginatedResponse<T>, fallbackLimit: number): PaginatedResponse<T> {
  if (Array.isArray(data)) {
    return {
      items: data,
      meta: { ...EMPTY_META, limit: fallbackLimit, total: data.length, totalPages: 1 },
    };
  }
  return data;
}

function normalizeRefund(raw: Record<string, any>): RefundRequest {
  const item = raw.items?.[0] ?? {};
  const customerName =
    raw.order?.shippingName ||
    raw.order?.billingName ||
    raw.customerName ||
    raw.order?.user?.displayName ||
    [raw.order?.user?.firstName, raw.order?.user?.lastName].filter(Boolean).join(" ") ||
    "Customer";
  return {
    id: raw.id,
    orderId: raw.orderId,
    orderNumber: raw.order?.orderNumber ?? raw.orderNumber ?? raw.orderId,
    customerId: raw.order?.userId ?? raw.userId ?? raw.customerId ?? "",
    customerName,
    customerEmail: raw.order?.customerEmail ?? raw.order?.user?.email ?? raw.customerEmail ?? "",
    productId: item.productId ?? raw.productId ?? "",
    productName: item.name ?? raw.productName ?? "Refunded item",
    reason: String(raw.reason ?? "OTHER").toLowerCase().replace(/_/g, " ") as RefundRequest["reason"],
    description: raw.customerNote ?? raw.description ?? raw.note ?? "",
    preferredResolution: raw.preferredResolution ?? "Refund",
    amount: raw.amount ?? item.amount ?? 0,
    status: String(raw.status ?? "submitted").toLowerCase().replace(/_/g, "-") as RefundRequest["status"],
    assignedReviewer: (() => {
      const actor = raw.refundedBy || raw.reviewedBy;
      if (!actor) return undefined;
      return actor.displayName || [actor.firstName, actor.lastName].filter(Boolean).join(" ") || actor.email || "Admin";
    })(),
    decisionNote: raw.internalNote ?? raw.decisionNote,
    evidenceFile: raw.evidenceFileName ?? raw.evidenceFile,
    createdAt: raw.createdAt,
    decidedAt: raw.decidedAt ?? raw.updatedAt,
  };
}

export function useRefunds(params: RefundListParams = {}) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const queryParams = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    status: params.status ?? "all",
    search: params.search?.trim() ?? "",
  };
  return useQuery({
    queryKey: qk.refunds(activePlatform, queryParams),
    queryFn: async () => {
      const search = new URLSearchParams({
        page: String(queryParams.page),
        limit: String(queryParams.limit),
      });
      if (queryParams.status !== "all") search.set("status", STATUS_TO_BACKEND[queryParams.status as RefundStatus]);
      if (queryParams.search) search.set("search", queryParams.search);

      const { data } = await api.get<unknown[] | PaginatedResponse<unknown>>(`/refunds?${search.toString()}`);
      const result = paginated(data, queryParams.limit);
      return {
        items: normalizeItems(result).map((item) => normalizeRefund(item as Record<string, any>)),
        meta: result.meta,
      };
    },
    placeholderData: (previous) => previous,
  });
}

export function useRefund(id: string | undefined) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.refund(activePlatform, id ?? ""),
    queryFn: async () => {
      const { data } = await api.get<Record<string, any>>(`/refunds/${id}`);
      return normalizeRefund(data);
    },
    enabled: !!id,
  });
}

export function useCreateAdminRefund() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      orderId: string;
      orderNumber: string;
      orderItemId?: string;
      productId: string;
      productName: string;
      reason: string;
      description: string;
      preferredResolution: string;
      evidenceFileName?: string;
    }) => {
      const { data } = await api.post<Record<string, any>>(`/admin/orders/${payload.orderId}/refunds`, {
        reason: REASON_TO_BACKEND[payload.reason] ?? "OTHER",
        customerNote: payload.description,
        preferredResolution: payload.preferredResolution,
        evidenceFileName: payload.evidenceFileName,
        items: payload.orderItemId
          ? [{ orderItemId: payload.orderItemId, quantity: 1, condition: "GOOD" }]
          : undefined, // undefined Means FULL ORDER REFUND
      });
      return normalizeRefund(data);
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: qk.refunds(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.order(activePlatform, variables.orderId) });
    },
  });
}

export function useDecideRefund() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      decision,
      note,
    }: {
      id: string;
      decision: "review" | "approve" | "reject" | "refund";
      note: string;
      by: string;
    }) => {
      const endpoint =
        decision === "review"
          ? "start-review"
          : decision === "approve"
          ? "approve"
          : decision === "reject"
            ? "reject"
            : "mark-refunded";
      const { data } = await api.post<Record<string, any>>(`/refunds/${id}/${endpoint}`, { note });
      return normalizeRefund(data);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: qk.refunds(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.refund(activePlatform, vars.id) });
      qc.invalidateQueries({ queryKey: qk.summary(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.accountingSummary(activePlatform) });
    },
  });
}
