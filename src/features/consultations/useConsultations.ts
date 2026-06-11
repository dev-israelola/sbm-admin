import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { qk } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth-store";
import type { Consultation, ConsultationRecommendation } from "@/types/consultation";

export function useConsultations() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.consultations(activePlatform),
    queryFn: async () => {
      const { data } = await api.get<Consultation[]>("/consultations");
      return data;
    },
  });
}

export function useConsultation(id: string | undefined) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.consultation(activePlatform, id ?? ""),
    queryFn: async () => {
      const { data } = await api.get<Consultation>(`/consultations/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useRecommendation(id: string | undefined) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: qk.recommendation(activePlatform, id ?? ""),
    queryFn: async () => {
      const { data } = await api.get<ConsultationRecommendation>(`/recommendations/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useAssignConsultant() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, consultantId, consultantName }: any) => {
      const { data } = await api.post<Consultation>(`/consultations/${id}/assign`, {
        consultantId,
        consultantName,
      });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.consultations(activePlatform) }),
  });
}

export function useCreateRecommendation() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: any) => {
      const { data } = await api.post<ConsultationRecommendation>(
        `/consultations/${id}/recommendation`,
        body,
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.consultations(activePlatform) });
    },
  });
}
