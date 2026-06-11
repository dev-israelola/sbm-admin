import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { qk } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import type { DeliveryAssignment, DeliveryStatus } from "@/types/delivery";

export interface DeliveryParams {
  assigneeId?: string;
  status?: string;
}

export function useDeliveries(params: DeliveryParams = {}) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.deliveries(activePlatform, params),
    queryFn: async () => {
      const search = new URLSearchParams();
      if (params.assigneeId) search.set("assigneeId", params.assigneeId);
      if (params.status) search.set("status", params.status);
      const { data } = await api.get<DeliveryAssignment[]>(`/deliveries?${search.toString()}`);
      return data;
    },
  });
}

export function useDelivery(id: string | undefined) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.delivery(activePlatform, id ?? ""),
    queryFn: async () => {
      const { data } = await api.get<DeliveryAssignment>(`/deliveries/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useAssignDelivery() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: any) => {
      const { data } = await api.post<DeliveryAssignment>(`/deliveries/${id}/assign`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.deliveries(activePlatform) }),
  });
}

export function useUpdateDeliveryStatus() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, note }: { id: string; status: DeliveryStatus; note?: string }) => {
      const { data } = await api.post<DeliveryAssignment>(`/deliveries/${id}/status`, {
        status,
        note,
      });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.deliveries(activePlatform) }),
  });
}
