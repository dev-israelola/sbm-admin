import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DEFAULT_PAGE_SIZE, paginated } from "@/lib/pagination";
import { qk } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import type { CustomerRewardsSummary, RewardActivity } from "@/types/rewards";

export function useRewards(params: { page?: number; limit?: number } = {}) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const page = params.page ?? 1;
  const limit = params.limit ?? DEFAULT_PAGE_SIZE;
  return useQuery({
    queryKey: qk.rewards(activePlatform, params),
    queryFn: async () => {
      const { data } = await api.get<CustomerRewardsSummary[] | { items?: CustomerRewardsSummary[]; meta?: any }>(
        `/admin/rewards?page=${page}&limit=${limit}`,
      );
      return paginated(data, page, limit);
    },
  });
}

export interface CustomerRewardsDetail extends CustomerRewardsSummary {
  activity: RewardActivity[];
}

export function useCustomerRewards(id: string | undefined) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.customerRewards(activePlatform, id ?? ""),
    queryFn: async () => {
      const { data } = await api.get<CustomerRewardsDetail>(`/admin/rewards/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useAdjustRewards() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      customerId,
      delta,
      reason,
    }: {
      customerId: string;
      delta: number;
      reason: string;
      by: string;
    }) => {
      const { data } = await api.post("/admin/rewards/adjust", {
        userId: customerId,
        points: delta,
        reason,
      });
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: qk.rewards(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.customerRewards(activePlatform, vars.customerId) });
    },
  });
}
