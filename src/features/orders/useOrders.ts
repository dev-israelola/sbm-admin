import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { qk } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import type { AdminOrder, OrderStatus } from "@/types/order";

export interface OrdersParams {
  q?: string;
  status?: string;
  paymentMethod?: string;
  deliveryMethod?: string;
}

export function useOrders(params: OrdersParams = {}) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.orders(activePlatform, params),
    queryFn: async () => {
      const search = new URLSearchParams();
      if (params.q) search.set("q", params.q);
      if (params.status) search.set("status", params.status);
      if (params.paymentMethod) search.set("paymentMethod", params.paymentMethod);
      if (params.deliveryMethod) search.set("deliveryMethod", params.deliveryMethod);
      const { data } = await api.get<{ items: AdminOrder[]; total: number } | AdminOrder[]>(
        `/orders?${search.toString()}`,
      );
      // Tolerate either shape — bare array or { items, total }
      if (Array.isArray(data)) return { items: data, total: data.length };
      return { items: data.items ?? [], total: data.total ?? data.items?.length ?? 0 };
    },
  });
}

export function useOrder(id: string | undefined) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.order(activePlatform, id ?? ""),
    queryFn: async () => {
      const { data } = await api.get<AdminOrder>(`/orders/${id}`);
      return data;
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
      ...body
    }: {
      id: string;
      result: "verified" | "rejected";
      note: string;
      contactMethod?: string;
      expectedDelivery?: string;
      by: string;
    }) => {
      const { data } = await api.post<AdminOrder>(`/orders/${id}/verify-pod`, body);
      return data;
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
      by,
    }: {
      id: string;
      status: OrderStatus;
      note?: string;
      by: string;
    }) => {
      const { data } = await api.post<AdminOrder>(`/orders/${id}/status`, { status, note, by });
      return data;
    },
    onSuccess: (d) => invalidate(qc, activePlatform, d.id),
  });
}

export function useAddOrderNote() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body, by }: { id: string; body: string; by: string }) => {
      const { data } = await api.post<AdminOrder>(`/orders/${id}/notes`, { body, by });
      return data;
    },
    onSuccess: (d) => invalidate(qc, activePlatform, d.id),
  });
}

export function useConfirmPodPayment() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: any) => {
      const { data } = await api.post<AdminOrder>(`/orders/${id}/pod-collection`, body);
      return data;
    },
    onSuccess: (d) => invalidate(qc, activePlatform, d.id),
  });
}

export function useReconcileOrder() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: any) => {
      const { data } = await api.post<AdminOrder>(`/orders/${id}/reconcile`, body);
      return data;
    },
    onSuccess: (d) => invalidate(qc, activePlatform, d.id),
  });
}
