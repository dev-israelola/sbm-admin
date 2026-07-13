import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

export function useCreateCategory() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Record<string, any>) => {
      const { data } = await api.post("/categories", body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories", activePlatform] }),
  });
}

export function useUpdateCategory() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & Record<string, any>) => {
      const { data } = await api.patch(`/categories/${id}`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories", activePlatform] }),
  });
}

export function useDeleteCategory() {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories", activePlatform] });
    },
  });
}

export function useCategory(slug: string | undefined) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: ["category", activePlatform, slug] as const,
    queryFn: async () => {
      const { data } = await api.get(`/categories/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
}

