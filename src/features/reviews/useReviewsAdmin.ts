import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface AdminReviewDto {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  isApproved: boolean;
  createdAt: string;
  product: { name: string; slug: string };
}

export interface PaginatedReviews {
  items: AdminReviewDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useAdminReviews(params: { page: number; dateFrom?: string; dateTo?: string }) {
  return useQuery({
    queryKey: ["admin_reviews", params],
    queryFn: async () => {
      const q = new URLSearchParams();
      q.set("page", params.page.toString());
      if (params.dateFrom) q.set("dateFrom", params.dateFrom);
      if (params.dateTo) q.set("dateTo", params.dateTo);

      const { data } = await api.get<PaginatedReviews>(`/reviews/admin?${q.toString()}`);
      return data;
    },
    refetchInterval: 30_000,
  });
}

export function useSetReviewVisibility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const { data } = await api.patch(`/reviews/admin/${id}/visibility`, { approved });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_reviews"] });
    },
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/reviews/admin/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_reviews"] });
    },
  });
}
