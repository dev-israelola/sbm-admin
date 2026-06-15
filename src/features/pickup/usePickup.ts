import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { qk } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import type { PickupHandoff, PickupStation } from "@/types/delivery";

export function usePickupHandoffs(params: { status?: string; stationId?: string } = {}) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.pickupHandoffs(activePlatform, params),
    queryFn: async () => {
      const search = new URLSearchParams();
      if (params.status) search.set("status", params.status);
      if (params.stationId) search.set("stationId", params.stationId);
      const { data } = await api.get<PickupHandoff[]>(`/pickup-handoffs?${search.toString()}`);
      return data;
    },
  });
}

export function useMarkPickupCollected() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, by }: { id: string; by: string }) => {
      const { data } = await api.post<PickupHandoff>(`/pickup-handoffs/${id}/collect`, { by });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.pickupHandoffs(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.orders(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.summary(activePlatform) });
    },
  });
}

export function usePickupStations() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.pickupStations(activePlatform),
    queryFn: async () => {
      const { data } = await api.get<PickupStation[]>("/pickup-stations");
      return data;
    },
  });
}

export function useCreatePickupStation() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Omit<PickupStation, "id">) => {
      const { data } = await api.post<PickupStation>("/pickup-stations", body);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.pickupStations(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.deliveryOptions(activePlatform) });
    },
  });
}

export function useUpdatePickupStation() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: PickupStation) => {
      const { data } = await api.patch<PickupStation>(`/pickup-stations/${id}`, body);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.pickupStations(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.deliveryOptions(activePlatform) });
    },
  });
}

export function useDeletePickupStation() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/pickup-stations/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.pickupStations(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.deliveryOptions(activePlatform) });
    },
  });
}
