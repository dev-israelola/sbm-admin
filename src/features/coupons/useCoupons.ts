import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

export interface AdminCoupon {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  userId: string | null;
  source: string | null;
  minOrderKobo: number;
  maxDiscountKobo: number | null;
  usageLimit: number;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

const KEY = (platform: string) => ["coupons", platform] as const;

export function useCoupons() {
  const platform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: KEY(platform),
    queryFn: async () => {
      const { data } = await api.get<AdminCoupon[]>("/coupons");
      return data;
    },
  });
}

export function useCreateCoupon() {
  const platform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const { data } = await api.post<AdminCoupon>("/coupons", body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY(platform) }),
  });
}

export function useUpdateCoupon() {
  const platform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & Record<string, unknown>) => {
      const { data } = await api.patch<AdminCoupon>(`/coupons/${id}`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY(platform) }),
  });
}

export function useDeleteCoupon() {
  const platform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/coupons/${id}`);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY(platform) }),
  });
}
