import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { qk } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import type { AccountingSummary } from "@/types/accounting";

export interface AdminSummary {
  summary: AccountingSummary;
  counts: {
    pendingOrders: number;
    pendingVerification: number;
    podOrders: number;
    paystackOrders: number;
    lowStock: number;
    pendingRefunds: number;
    pendingPickup: number;
  };
}

export function useAdminSummary() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.summary(activePlatform),
    queryFn: async () => {
      const { data } = await api.get<AdminSummary>("/admin/summary");
      return data;
    },
  });
}
