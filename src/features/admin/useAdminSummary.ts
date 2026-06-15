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

export function useAdminSummary() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: qk.summary(activePlatform),
    queryFn: async () => {
      // Let failures reject so React Query retries (e.g. on a cold-start 5xx)
      // and the UI shows its loading state — never swallow into fake zeros,
      // which would cache a misleading ₦0 as a "successful" result.
      const [summaryRes, countsRes] = await Promise.all([
        api.get<Partial<AccountingSummary> & Record<string, unknown>>("/accounting/summary"),
        api.get<AdminSummary["counts"]>("/admin/summary"),
      ]);

      return {
        summary: normalizeAccountingSummary(summaryRes.data as Partial<AccountingSummary> & Record<string, unknown>),
        counts: countsRes.data,
      } satisfies AdminSummary;
    },
    // Cold starts can take a few seconds; retry a bit more than the global
    // default so a transient first-load failure recovers without a refresh.
    retry: 3,
    enabled: user?.role === "admin" || user?.role === "manager",
  });
}
