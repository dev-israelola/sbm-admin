import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { qk } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import type { Product } from "@/types/product";
import type { InventoryMovement } from "@/types/inventory";

export function useProducts(params?: { q?: string; category?: string; status?: string }) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.products(activePlatform, params),
    queryFn: async () => {
      const search = new URLSearchParams();
      if (params?.q) search.set("q", params.q);
      if (params?.category) search.set("category", params.category);
      if (params?.status) search.set("status", params.status);
      const { data } = await api.get<{ items: Product[]; total: number } | Product[]>(
        `/products?${search.toString()}`,
      );
      if (Array.isArray(data)) return { items: data, total: data.length };
      return { items: data.items ?? [], total: data.total ?? data.items?.length ?? 0 };
    },
  });
}

export function useProduct(id: string | undefined) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.product(activePlatform, id ?? ""),
    queryFn: async () => {
      const { data } = await api.get<Product>(`/products/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Partial<Product>) => {
      const { data } = await api.post<Product>("/products", body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.products(activePlatform) }),
  });
}

export function useUpdateProduct() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & Partial<Product>) => {
      const { data } = await api.put<Product>(`/products/${id}`, body);
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: qk.products(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.product(activePlatform, vars.id) });
    },
  });
}

export function useInventory() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.inventory(activePlatform),
    queryFn: async () => {
      const { data } = await api.get<Product[]>("/inventory");
      return data;
    },
  });
}

export function useMovements() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.movements(activePlatform),
    queryFn: async () => {
      const { data } = await api.get<InventoryMovement[]>("/inventory/movements");
      return data;
    },
  });
}

export function useAdjustInventory() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, delta, reason, by }: { id: string; delta: number; reason: string; by: string }) => {
      const { data } = await api.post<Product>(`/inventory/${id}/adjust`, { delta, reason, by });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.inventory(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.movements(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.products(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.summary(activePlatform) });
    },
  });
}
