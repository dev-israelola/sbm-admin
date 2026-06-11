import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { qk } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import type { CustomerRewardsSummary, RewardActivity } from "@/types/rewards";

export function useRewards() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.rewards(activePlatform),
    queryFn: async () => {
      const { data } = await api.get<CustomerRewardsSummary[]>("/rewards");
      return data;
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
      const { data } = await api.get<CustomerRewardsDetail>(`/rewards/${id}`);
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
      by,
    }: {
      customerId: string;
      delta: number;
      reason: string;
      by: string;
    }) => {
      const { data } = await api.post(`/rewards/${customerId}/adjust`, { delta, reason, by });
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: qk.rewards(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.customerRewards(activePlatform, vars.customerId) });
    },
  });
}
