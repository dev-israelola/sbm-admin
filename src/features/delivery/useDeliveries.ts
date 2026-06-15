import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { normalizeDelivery, toBackendDeliveryStatus } from "@/lib/admin-normalizers";
import { DEFAULT_PAGE_SIZE, paginated } from "@/lib/pagination";
import { qk } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import type { DeliveryAssignment, DeliveryStatus } from "@/types/delivery";

export interface DeliveryParams {
  assigneeId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export function useDeliveries(params: DeliveryParams = {}) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const page = params.page ?? 1;
  const limit = params.limit ?? DEFAULT_PAGE_SIZE;
  return useQuery({
    queryKey: qk.deliveries(activePlatform, params),
    queryFn: async () => {
      const search = new URLSearchParams();
      search.set("page", String(page));
      search.set("limit", String(limit));
      if (params.status) search.set("status", toBackendDeliveryStatus(params.status as DeliveryStatus));
      const { data } = await api.get<unknown[] | { items?: unknown[]; meta?: any }>(`/deliveries?${search.toString()}`);
      const result = paginated(data, page, limit);
      let items = result.items.map((item) => normalizeDelivery(item as Record<string, any>));
      if (params.assigneeId) items = items.filter((item) => item.assigneeId === params.assigneeId);
      return { items, meta: result.meta };
    },
  });
}

export function useDelivery(id: string | undefined) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.delivery(activePlatform, id ?? ""),
    queryFn: async () => {
      const { data } = await api.get<Record<string, any>>(`/deliveries/${id}`);
      return normalizeDelivery(data);
    },
    enabled: !!id,
  });
}

export function useAssignDelivery() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, type, assigneeId, provider, trackingNumber, deliveryFee }: any) => {
      const { data: delivery } = await api.get<Record<string, any>>(`/deliveries/${id}`);
      const orderId = delivery.orderId;
      if (!orderId) throw new Error("Delivery is missing its order id.");
      const { data } = await api.post<Record<string, any>>(`/orders/${orderId}/assign-delivery`, {
        deliveryType: type === "third-party" ? "THIRD_PARTY_LOGISTICS" : "INTERNAL_RIDER",
        assignedToUserId: type === "internal" ? assigneeId : undefined,
        logisticsProvider: type === "third-party" ? provider : undefined,
        trackingNumber,
        deliveryFee,
      });
      return normalizeDelivery(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.deliveries(activePlatform) });
      // Refresh order views so the dispatch step un-gates without a manual reload.
      qc.invalidateQueries({
        predicate: (q) => {
          const k = q.queryKey?.[0];
          return k === "orders" || k === "order";
        },
      });
    },
  });
}

export function useUpdateDeliveryStatus() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, note }: { id: string; status: DeliveryStatus; note?: string }) => {
      const { data } = await api.patch<Record<string, any>>(`/deliveries/${id}/status`, {
        status: toBackendDeliveryStatus(status),
        note,
      });
      return normalizeDelivery(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.deliveries(activePlatform) }),
  });
}
