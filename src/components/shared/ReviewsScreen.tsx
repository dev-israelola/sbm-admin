import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquareText, Star, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FilterBar } from "@/components/ui/filter-bar";
import { PaginationFooter } from "@/components/ui/pagination-footer";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { formatDate } from "@/lib/format";
import { useAdminReviews, useSetReviewVisibility, useDeleteReview, type AdminReviewDto } from "@/features/reviews/useReviewsAdmin";

export function ReviewsScreen({ rolePath }: { rolePath: string }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState<string>();
  const [dateTo, setDateTo] = useState<string>();
  const [deleteTarget, setDeleteTarget] = useState<AdminReviewDto | null>(null);

  const reviewsQuery = useAdminReviews({ page, dateFrom, dateTo });
  const visibilityMutation = useSetReviewVisibility();
  const deleteMutation = useDeleteReview();

  const filtered = useMemo(() => {
    if (!reviewsQuery.data?.items) return [];
    if (!q) return reviewsQuery.data.items;
    const lower = q.toLowerCase();
    return reviewsQuery.data.items.filter(
      (r) =>
        r.authorName.toLowerCase().includes(lower) ||
        r.product.name.toLowerCase().includes(lower) ||
        r.title.toLowerCase().includes(lower) ||
        r.body.toLowerCase().includes(lower)
    );
  }, [reviewsQuery.data, q]);

  const columns: DataTableColumn<AdminReviewDto>[] = useMemo(
    () => [
      {
        key: "date",
        header: "Date",
        width: "100px",
        render: (r) => <span className="text-[12px] text-ink-muted">{formatDate(r.createdAt)}</span>,
      },
      {
        key: "product",
        header: "Product & Author",
        render: (r) => (
          <div>
            <Link to={`${rolePath}/products/${r.product.slug}/edit`} className="text-[13px] font-medium text-ink hover:text-accent line-clamp-1">
              {r.product.name}
            </Link>
            <p className="text-[12px] text-ink-muted">by {r.authorName}</p>
          </div>
        ),
      },
      {
        key: "rating",
        header: "Rating",
        width: "120px",
        render: (r) => (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "fill-surface-muted text-line"}`}
              />
            ))}
          </div>
        ),
      },
      {
        key: "review",
        header: "Review",
        render: (r) => (
          <div className="max-w-md">
            <p className="text-[13px] font-medium text-ink line-clamp-1">{r.title || "No Title"}</p>
            <p className="text-[12px] text-ink-muted line-clamp-2">{r.body}</p>
          </div>
        ),
      },
      {
        key: "approved",
        header: "Visible",
        width: "80px",
        align: "right",
        render: (r) => (
          <div className="flex justify-end">
            <Switch
              checked={r.isApproved}
              onCheckedChange={(checked) => visibilityMutation.mutate({ id: r.id, approved: checked })}
              disabled={visibilityMutation.isPending}
            />
          </div>
        ),
      },
      {
        key: "actions",
        header: "",
        width: "60px",
        align: "right",
        render: (r) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-ink-muted hover:text-red-500"
              onClick={() => setDeleteTarget(r)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [rolePath, visibilityMutation, deleteMutation]
  );

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Product Reviews"
        description="Monitor, approve, and remove customer reviews submitted from your storefront."
      />

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterBar searchValue={q} onSearchChange={setQ} searchPlaceholder="Search text, product, or author..." />
        <DateRangeFilter
          onRangeChange={(range) => {
            setDateFrom(range?.dateFrom);
            setDateTo(range?.dateTo);
            setPage(1); // Reset page on filter changes
          }}
        />
      </div>

      <DataTable
        rows={filtered}
        columns={columns}
        loading={reviewsQuery.isLoading}
        rowKey={(r) => r.id}
        emptyState={
          <div className="flex flex-col items-center gap-2 py-8">
            <MessageSquareText className="h-6 w-6 text-ink-muted" />
            <p className="text-sm font-medium">No reviews found</p>
            <p className="text-xs text-ink-muted max-w-sm text-center">
              Customer reviews will automatically appear here once submitted. You can hide or delete abusive comments.
            </p>
          </div>
        }
      />

      {reviewsQuery.data && reviewsQuery.data.totalPages > 1 && (
        <PaginationFooter 
          page={page} 
          itemLabel="reviews"
          meta={{
            page: reviewsQuery.data.page,
            limit: reviewsQuery.data.limit,
            total: reviewsQuery.data.total,
            totalPages: reviewsQuery.data.totalPages,
            hasNext: reviewsQuery.data.page < reviewsQuery.data.totalPages,
            hasPrev: reviewsQuery.data.page > 1
          }} 
          onPageChange={setPage} 
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Delete Review?"
        description="This action cannot be undone. Removing this review will permanently delete it and recalculate the product rating."
        confirmLabel="Delete Review"
        destructive
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteMutation.mutateAsync(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
