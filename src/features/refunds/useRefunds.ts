import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { qk } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import type { RefundRequest } from "@/types/refund";

export function useRefunds() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.refunds(activePlatform),
    queryFn: async () => {
      const { data } = await api.get<RefundRequest[]>("/refunds");
      return data;
    },
  });
}

export function useRefund(id: string | undefined) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.refund(activePlatform, id ?? ""),
    queryFn: async () => {
      const { data } = await api.get<RefundRequest>(`/refunds/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useDecideRefund() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      decision,
      note,
      by,
    }: {
      id: string;
      decision: "approve" | "reject" | "refund" | "partial";
      note: string;
      by: string;
    }) => {
      const { data } = await api.post<RefundRequest>(`/refunds/${id}/decide`, {
        decision,
        note,
        by,
      });
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: qk.refunds(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.refund(activePlatform, vars.id) });
      qc.invalidateQueries({ queryKey: qk.summary(activePlatform) });
    },
  });
}
