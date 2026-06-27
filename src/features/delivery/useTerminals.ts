import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

export interface AdminDeliveryCompany {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  isActive: boolean;
  position: number;
  _count?: { terminals: number };
}

export interface AdminDeliveryTerminal {
  id: string;
  companyId: string;
  state: string;
  name: string;
  address: string;
  code: string | null;
  phone: string | null;
  price: number; // kobo
  isActive: boolean;
  position: number;
}

const COMPANIES_KEY = (p: string) => ["delivery-companies", p] as const;
const TERMINALS_KEY = (p: string, companyId: string) => ["delivery-terminals", p, companyId] as const;

export function useDeliveryCompanies() {
  const platform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: COMPANIES_KEY(platform),
    queryFn: async () => {
      const { data } = await api.get<AdminDeliveryCompany[]>("/delivery/admin/companies");
      return data;
    },
  });
}

export function useDeliveryTerminals(companyId: string | undefined) {
  const platform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: TERMINALS_KEY(platform, companyId ?? ""),
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await api.get<AdminDeliveryTerminal[]>("/delivery/admin/terminals", {
        params: { companyId },
      });
      return data;
    },
  });
}

export function useCreateCompany() {
  const platform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const { data } = await api.post("/delivery/admin/companies", body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: COMPANIES_KEY(platform) }),
  });
}

export function useUpdateCompany() {
  const platform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & Record<string, unknown>) => {
      const { data } = await api.patch(`/delivery/admin/companies/${id}`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: COMPANIES_KEY(platform) }),
  });
}

export function useDeleteCompany() {
  const platform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/delivery/admin/companies/${id}`);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: COMPANIES_KEY(platform) }),
  });
}

export function useCreateTerminal() {
  const platform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const { data } = await api.post("/delivery/admin/terminals", body);
      return data;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: TERMINALS_KEY(platform, String((vars as any).companyId ?? "")) });
      qc.invalidateQueries({ queryKey: COMPANIES_KEY(platform) });
    },
  });
}

export function useUpdateTerminal(companyId: string | undefined) {
  const platform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & Record<string, unknown>) => {
      const { data } = await api.patch(`/delivery/admin/terminals/${id}`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: TERMINALS_KEY(platform, companyId ?? "") }),
  });
}

export function useDeleteTerminal(companyId: string | undefined) {
  const platform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/delivery/admin/terminals/${id}`);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TERMINALS_KEY(platform, companyId ?? "") });
      qc.invalidateQueries({ queryKey: COMPANIES_KEY(platform) });
    },
  });
}
