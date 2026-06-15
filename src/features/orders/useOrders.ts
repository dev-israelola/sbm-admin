import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { normalizeOrder, toBackendDeliveryMethod, toBackendOrderStatus, toBackendPaymentMethod } from "@/lib/admin-normalizers";
import { DEFAULT_PAGE_SIZE, paginated } from "@/lib/pagination";
import { qk } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import type { AdminOrder, DeliveryMethod, OrderStatus, PaymentMethod } from "@/types/order";

export interface OrdersParams {
  q?: string;
  status?: string;
  paymentMethod?: string;
  deliveryMethod?: string;
  page?: number;
  limit?: number;
}

export function useOrders(params: OrdersParams = {}) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const page = params.page ?? 1;
  const limit = params.limit ?? DEFAULT_PAGE_SIZE;
  return useQuery({
    queryKey: qk.orders(activePlatform, params),
    queryFn: async () => {
      const search = new URLSearchParams();
      search.set("page", String(page));
      search.set("limit", String(limit));
      if (params.q?.trim()) search.set("search", params.q.trim());
      if (params.status) search.set("status", toBackendOrderStatus(params.status as OrderStatus));
      if (params.paymentMethod) search.set("paymentMethod", toBackendPaymentMethod(params.paymentMethod as PaymentMethod));
      if (params.deliveryMethod) search.set("deliveryMethod", toBackendDeliveryMethod(params.deliveryMethod as DeliveryMethod));
      const { data } = await api.get<{ items?: unknown[]; meta?: any; total?: number } | unknown[]>(
        `/admin/orders?${search.toString()}`,
      );
      const result = paginated(data, page, limit);
      const items = result.items.map((item) => normalizeOrder(item as Record<string, any>));
      return { items, meta: result.meta, total: result.meta.total };
    },
  });
}

export function useOrder(id: string | undefined) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.order(activePlatform, id ?? ""),
    queryFn: async () => {
      const { data } = await api.get<Record<string, any>>(`/admin/orders/${id}`);
      return normalizeOrder(data);
    },
    enabled: !!id,
  });
}

function invalidate(qc: ReturnType<typeof useQueryClient>, platform: ReturnType<typeof useAuthStore.getState>["activePlatform"], id?: string) {
  qc.invalidateQueries({ queryKey: qk.orders(platform) });
  qc.invalidateQueries({ queryKey: qk.summary(platform) });
  if (id) qc.invalidateQueries({ queryKey: qk.order(platform, id) });
}

export function useVerifyPod() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      result,
      note,
      contactMethod,
      expectedDelivery,
    }: {
      id: string;
      result: "verified" | "rejected";
      note: string;
      contactMethod?: string;
      expectedDelivery?: string;
      by: string;
    }) => {
      const { data } = await api.post<Record<string, any>>(`/admin/orders/${id}/verify-pod`, {
        verificationResult: result.toUpperCase(),
        verificationNote: note,
        customerContacted: Boolean(contactMethod),
        contactMethod,
        expectedDeliveryDate: expectedDelivery,
      });
      return normalizeOrder(data);
    },
    onSuccess: (d) => invalidate(qc, activePlatform, d.id),
  });
}

export function useUpdateOrderStatus() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      note,
    }: {
      id: string;
      status: OrderStatus;
      note?: string;
      by: string;
    }) => {
      const { data } = await api.patch<Record<string, any>>(`/admin/orders/${id}/status`, {
        status: toBackendOrderStatus(status),
        note,
      });
      return normalizeOrder(data);
    },
    onSuccess: (d) => invalidate(qc, activePlatform, d.id),
  });
}

export function useAddOrderNote() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: string; by: string }) => {
      const { data } = await api.post<Record<string, any>>(`/admin/orders/${id}/notes`, { body });
      return normalizeOrder(data);
    },
    onSuccess: (d) => invalidate(qc, activePlatform, d.id),
  });
}

export function useConfirmPodPayment() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, amount, method, collectedAt, reference, note, proofUrl }: any) => {
      const { data } = await api.post<Record<string, any>>(`/orders/${id}/pod-collection`, {
        amountCollected: amount,
        collectionMethod: String(method ?? "cash").toUpperCase().replace(/-/g, "_"),
        collectionDate: collectedAt,
        referenceNumber: reference,
        note,
        proofUrl,
      });
      return normalizeOrder(data);
    },
    onSuccess: (d) => invalidate(qc, activePlatform, d.id),
  });
}

export function useReconcileOrder() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation<AdminOrder, Error, { id: string; status: "reconciled" | "discrepancy"; note?: string; by: string }>({
    mutationFn: async ({ id, status, note }) => {
      const { data } = await api.post<Record<string, any>>(`/admin/orders/${id}/reconcile`, { status, note });
      return normalizeOrder(data);
    },
    onSuccess: (d) => invalidate(qc, activePlatform, d.id),
  });
}
