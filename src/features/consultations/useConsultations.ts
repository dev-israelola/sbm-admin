import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DEFAULT_PAGE_SIZE, paginated } from "@/lib/pagination";
import { qk } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import type { Consultation, ConsultationBlock, ConsultationRecommendation } from "@/types/consultation";

function normalizeConsultation(raw: Record<string, any>): Consultation {
  return {
    id: raw.id,
    isGuest: !raw.userId,
    customerId: raw.userId ?? raw.customerId ?? "",
    customerName: raw.customerName ?? raw.user?.displayName ?? raw.guestName ?? "Guest",
    customerEmail: raw.customerEmail ?? raw.user?.email ?? raw.guestEmail ?? "",
    customerPhone: raw.customerPhone ?? raw.user?.phone ?? raw.guestPhone ?? "",
    primaryConcern: raw.primaryConcern ?? "",
    goal: raw.wellnessGoal ?? raw.goal ?? "",
    preferredDate: raw.preferredDate ?? raw.createdAt,
    preferredTime: raw.preferredTime ?? "",
    notes: raw.notes,
    status: String(raw.status ?? "pending").toLowerCase().replace(/_/g, "-") as Consultation["status"],
    consultantId: raw.assignedConsultantId ?? raw.consultantId,
    consultantName: raw.consultantName,
    recommendationId: raw.recommendationId ?? raw.id,
    scheduledAt: raw.scheduledAt ?? null,
    fee: raw.fee ?? 0,
    paymentStatus: String(raw.paymentStatus ?? "").toLowerCase(),
    paymentMethod: raw.paymentMethod ?? null,
    createdAt: raw.createdAt,
  };
}

function normalizeRecommendation(raw: Record<string, any>): ConsultationRecommendation {
  return {
    id: raw.id,
    consultationId: raw.consultationId,
    consultantId: raw.consultantId ?? "",
    consultantName: raw.consultantName ?? "Consultant",
    title: raw.title ?? "Recommendation",
    note: raw.consultantNote ?? raw.note ?? "",
    routine: raw.routine ?? [],
    products: (raw.products ?? []).map((item: Record<string, any>) => ({
      productId: item.productId,
      usage: item.note ?? item.usage ?? "",
    })),
    additionalAdvice: raw.usageInstructions ?? raw.additionalAdvice,
    sent: true,
    createdAt: raw.createdAt,
  };
}

export function useConsultations(params: { status?: string; page?: number; limit?: number } = {}) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const page = params.page ?? 1;
  const limit = params.limit ?? DEFAULT_PAGE_SIZE;
  return useQuery({
    queryKey: qk.consultations(activePlatform, params),
    queryFn: async () => {
      const search = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (params.status) search.set("status", params.status.toUpperCase().replace(/-/g, "_"));
      const { data } = await api.get<unknown[] | { items?: unknown[]; meta?: any }>(`/consultations?${search.toString()}`);
      const result = paginated(data, page, limit);
      return {
        items: result.items.map((item) => normalizeConsultation(item as Record<string, any>)),
        meta: result.meta,
      };
    },
  });
}

export function useConsultation(id: string | undefined) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.consultation(activePlatform, id ?? ""),
    queryFn: async () => {
      const { data } = await api.get<Record<string, any>>(`/consultations/${id}`);
      return normalizeConsultation(data);
    },
    enabled: !!id,
  });
}

export function useRecommendation(id: string | undefined) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.recommendation(activePlatform, id ?? ""),
    queryFn: async () => {
      const { data } = await api.get<unknown[] | { items?: unknown[] }>(`/consultations/${id}/recommendations`);
      const items = Array.isArray(data) ? data : data.items ?? [];
      if (!items[0]) throw new Error("Recommendation not found");
      return normalizeRecommendation(items[0] as Record<string, any>);
    },
    enabled: !!id,
  });
}

export function useAssignConsultant() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, consultantId }: any) => {
      const { data } = await api.patch<Record<string, any>>(`/consultations/${id}/assign`, {
        assignedConsultantId: consultantId,
      });
      return normalizeConsultation(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.consultations(activePlatform) }),
  });
}

export function useConfirmConsultationPayment() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<Record<string, any>>(`/consultations/${id}/confirm-payment`, {});
      return normalizeConsultation(data);
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: qk.consultations(activePlatform) });
      qc.invalidateQueries({ queryKey: qk.consultation(activePlatform, id) });
    },
  });
}

const BLOCKS_KEY = (platform: string) => ["consultation-blocks", platform] as const;

export function useConsultationBlocks() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: BLOCKS_KEY(activePlatform),
    queryFn: async () => {
      const { data } = await api.get<ConsultationBlock[]>("/consultations/blocks");
      return data;
    },
  });
}

export function useCreateConsultationBlock() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { startsAt: string; endsAt: string; reason?: string }) => {
      const { data } = await api.post<ConsultationBlock>("/consultations/blocks", body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: BLOCKS_KEY(activePlatform) }),
  });
}

export function useDeleteConsultationBlock() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/consultations/blocks/${id}`);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: BLOCKS_KEY(activePlatform) }),
  });
}

export function useCreateRecommendation() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, note, products, title, additionalAdvice }: any) => {
      const { data } = await api.post<Record<string, any>>(
        `/consultations/${id}/recommendations`,
        {
          title,
          consultantNote: note,
          usageInstructions: additionalAdvice,
          products: (products ?? []).map((item: Record<string, any>) => ({
            productId: item.productId,
            note: item.usage,
          })),
        },
      );
      return normalizeRecommendation(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.consultations(activePlatform) });
    },
  });
}
