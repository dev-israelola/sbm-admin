import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { qk } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import type {
  AccountingSummary,
  Expense,
  ReconciliationRecord,
  SalesRecord,
} from "@/types/accounting";

export function useAccountingSummary() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.accountingSummary(activePlatform),
    queryFn: async () => {
      const { data } = await api.get<AccountingSummary>("/accounting/summary");
      return data;
    },
  });
}

export function useSales() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.sales(activePlatform),
    queryFn: async () => {
      const { data } = await api.get<SalesRecord[]>("/accounting/sales");
      return data;
    },
  });
}

export function useExpenses() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.expenses(activePlatform),
    queryFn: async () => {
      const { data } = await api.get<Expense[]>("/accounting/expenses");
      return data;
    },
  });
}

export function useCreateExpense() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Omit<Expense, "id" | "createdAt">) => {
      const { data } = await api.post<Expense>("/accounting/expenses", body);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.expenses(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.accountingSummary(activePlatform) });
    },
  });
}

export function useReconciliation() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.reconciliation(activePlatform),
    queryFn: async () => {
      const { data } = await api.get<ReconciliationRecord[]>("/accounting/reconciliation");
      return data;
    },
  });
}

export function useReconcile() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      note,
      by,
    }: {
      id: string;
      status: "reconciled" | "discrepancy";
      note?: string;
      by: string;
    }) => {
      const { data } = await api.post<ReconciliationRecord>(`/accounting/reconciliation/${id}`, {
        status,
        note,
        by,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.reconciliation(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.accountingSummary(activePlatform) });
    },
  });
}
