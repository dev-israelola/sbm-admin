import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { normalizeProduct } from "@/lib/admin-normalizers";
import { DEFAULT_PAGE_SIZE, paginated } from "@/lib/pagination";
import { qk } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import type { Product } from "@/types/product";
import type { InventoryMovement, InventoryMovementType } from "@/types/inventory";

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
}

export function useProducts(params?: { q?: string; category?: string; status?: string; page?: number; limit?: number }) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const page = params?.page ?? 1;
  const limit = params?.limit ?? DEFAULT_PAGE_SIZE;
  return useQuery({
    queryKey: qk.products(activePlatform, params),
    queryFn: async () => {
      const search = new URLSearchParams();
      search.set("page", String(page));
      search.set("limit", String(limit));
      if (params?.q) search.set("search", params.q);
      if (params?.category) search.set("category", params.category);
      const { data } = await api.get<{ items?: unknown[]; total?: number; meta?: any } | unknown[]>(
        `/products?${search.toString()}`,
      );
      const result = paginated(data, page, limit);
      let items = result.items.map((item) => normalizeProduct(item as Record<string, any>));
      if (params?.status) items = items.filter((item) => item.status === params.status);
      return { items, total: params?.status ? items.length : result.meta.total, meta: result.meta };
    },
  });
}

export function useProduct(id: string | undefined) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.product(activePlatform, id ?? ""),
    queryFn: async () => {
      const { data } = await api.get<Record<string, any>>(`/products/id/${id}`);
      return normalizeProduct(data);
    },
    enabled: !!id,
  });
}

export function useCategories() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: ["categories", activePlatform] as const,
    queryFn: async () => {
      const { data } = await api.get<CategoryRecord[]>("/categories");
      return data;
    },
  });
}

export function useCreateProduct() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Record<string, any>) => {
      const { data } = await api.post<Record<string, any>>("/products", body);
      return normalizeProduct(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.products(activePlatform) }),
  });
}

export function useUpdateProduct() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & Record<string, any>) => {
      const { data } = await api.patch<Record<string, any>>(`/products/${id}`, body);
      return normalizeProduct(data);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: qk.products(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.product(activePlatform, vars.id) });
    },
  });
}

export function useInventory(params: { q?: string; page?: number; limit?: number } = {}) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const page = params.page ?? 1;
  const limit = params.limit ?? DEFAULT_PAGE_SIZE;
  return useQuery({
    queryKey: qk.inventory(activePlatform, params),
    queryFn: async () => {
      const search = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (params.q?.trim()) search.set("search", params.q.trim());
      const { data } = await api.get<{ items?: unknown[]; total?: number; meta?: any } | unknown[]>(`/products?${search.toString()}`);
      const result = paginated(data, page, limit);
      return {
        items: result.items.map((item) => normalizeProduct(item as Record<string, any>)),
        meta: result.meta,
      };
    },
  });
}

export function useMovements(params: { page?: number; limit?: number } = {}) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const page = params.page ?? 1;
  const limit = params.limit ?? DEFAULT_PAGE_SIZE;
  return useQuery({
    queryKey: qk.movements(activePlatform, params),
    queryFn: async () => {
      const { data } = await api.get<unknown[] | { items?: unknown[]; meta?: any }>(`/inventory/movements?page=${page}&limit=${limit}`);
      const result = paginated(data, page, limit);
      return {
        items: result.items.map((item) => normalizeInventoryMovement(item as Record<string, any>)),
        meta: result.meta,
      };
    },
  });
}

const MOVEMENT_TYPE_BY_BACKEND: Record<string, InventoryMovementType> = {
  STOCK_ADDED: "stock-added",
  STOCK_RESERVED: "stock-reserved",
  RESERVATION_RELEASED: "reservation-released",
  STOCK_SOLD: "stock-sold",
  STOCK_RETURNED: "stock-returned",
  STOCK_DAMAGED: "stock-damaged",
  STOCK_ADJUSTED: "stock-adjusted",
};

function actorName(raw: Record<string, any>) {
  return raw.actor?.displayName || raw.actor?.email || raw.actorId || "System";
}

function normalizeInventoryMovement(raw: Record<string, any>): InventoryMovement {
  return {
    id: raw.id,
    productId: raw.productId,
    productName: raw.product?.name ?? "Product",
    sku: raw.product?.sku ?? "",
    type: MOVEMENT_TYPE_BY_BACKEND[String(raw.type)] ?? "stock-adjusted",
    quantity: raw.quantity,
    reason: raw.note,
    orderNumber: raw.reference,
    by: actorName(raw),
    at: raw.createdAt,
  };
}

export function useAdjustInventory() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, delta, reason }: { id: string; delta: number; reason: string; by: string }) => {
      const { data } = await api.post<Record<string, any>>("/inventory/adjustments", {
        productId: id,
        delta,
        reason,
      });
      return normalizeInventoryMovement(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.inventory(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.movements(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.products(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.summary(activePlatform) });
    },
  });
}
