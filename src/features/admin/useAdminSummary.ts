import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { qk } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import { normalizeAccountingSummary } from "@/features/accounting/useAccounting";
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

function zeroSummary(): AccountingSummary {
  return {
    grossSales: 0,
    netSales: 0,
    discounts: 0,
    refunds: 0,
    cogs: 0,
    deliveryFeesCharged: 0,
    deliveryFeesActual: 0,
    packagingCosts: 0,
    gatewayFees: 0,
    expenses: 0,
    estimatedProfit: 0,
    cashCollected: 0,
    unreconciledPod: 0,
  };
}

export function useAdminSummary() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: qk.summary(activePlatform),
    queryFn: async () => {
      const [summaryRes, countsRes] = await Promise.all([
        api.get<Partial<AccountingSummary> & Record<string, unknown>>("/accounting/summary").catch(() => ({ data: zeroSummary() })),
        api.get<AdminSummary["counts"]>("/admin/summary").catch(() => ({
          data: {
            pendingOrders: 0,
            pendingVerification: 0,
            podOrders: 0,
            paystackOrders: 0,
            lowStock: 0,
            pendingRefunds: 0,
            pendingPickup: 0,
          },
        })),
      ]);

      return {
        summary: normalizeAccountingSummary(summaryRes.data as Partial<AccountingSummary> & Record<string, unknown>),
        counts: countsRes.data,
      } satisfies AdminSummary;
    },
    enabled: user?.role === "admin" || user?.role === "manager",
  });
}
