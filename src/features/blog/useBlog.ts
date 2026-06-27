import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

export interface AdminBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover: string;
  author: string;
  readTime: string;
  body: string[];
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null;
  createdAt: string;
}

const KEY = (p: string) => ["blog-posts", p] as const;

export function useBlogPosts() {
  const platform = useAuthStore((s) => s.activePlatform);
  return useQuery({
    queryKey: KEY(platform),
    queryFn: async () => {
      const { data } = await api.get<AdminBlogPost[]>("/blog/admin");
      return data;
    },
  });
}

export function useCreateBlogPost() {
  const platform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const { data } = await api.post<AdminBlogPost>("/blog/admin", body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY(platform) }),
  });
}

export function useUpdateBlogPost() {
  const platform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & Record<string, unknown>) => {
      const { data } = await api.patch<AdminBlogPost>(`/blog/admin/${id}`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY(platform) }),
  });
}

export function useDeleteBlogPost() {
  const platform = useAuthStore((s) => s.activePlatform);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/blog/admin/${id}`);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY(platform) }),
  });
}
