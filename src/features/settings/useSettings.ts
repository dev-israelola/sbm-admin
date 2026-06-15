import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

export interface SettingRow {
  key: string;
  value: unknown;
}

export function useSettings() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: ["settings", activePlatform] as const,
    queryFn: async () => {
      const { data } = await api.get<SettingRow[]>("/settings");
      return data;
    },
  });
}

export function useSaveSettings() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { data } = await api.patch<SettingRow[]>("/settings", { values });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", activePlatform] });
    },
  });
}
