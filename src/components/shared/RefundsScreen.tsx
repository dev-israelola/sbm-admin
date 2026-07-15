import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { FilterBar } from "@/components/ui/filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { MoneyDisplay } from "@/components/ui/money";
import { RefundStatusBadge } from "@/components/refunds/status-badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRefunds } from "@/features/refunds/useRefunds";
import { formatDate } from "@/lib/format";
import type { RefundRequest, RefundStatus } from "@/types/refund";

const PAGE_SIZE = 10;

export function RefundsScreen({ rolePath }: { rolePath: string }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<RefundStatus | "all">("all");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(q);
  const { data, isLoading, isFetching } = useRefunds({
    page,
    limit: PAGE_SIZE,
    status,
    search: deferredSearch,
  });

  useEffect(() => {
    setPage(1);
  }, [deferredSearch, status]);

  const rows = data?.items;
  const meta = data?.meta;
  const resultLabel = useMemo(() => {
    if (!meta) return "Loading refunds...";
    if (meta.total === 0) return "No refunds found";
    const start = (meta.page - 1) * meta.limit + 1;
    const end = Math.min(meta.page * meta.limit, meta.total);
    return `Showing ${start}-${end} of ${meta.total} refunds`;
  }, [meta]);

  const columns: DataTableColumn<RefundRequest>[] = [
    {
      key: "order",
      header: "Order",
      render: (r) => (
        <div>
          <Link to={`${rolePath}/refunds/${r.id}`} className="text-[13px] font-medium text-ink hover:text-accent">
            {r.orderNumber}
          </Link>
          <p className="data-muted">{r.productName}</p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (r) => (
        <div>
          <p className="data-cell">{r.customerName}</p>
          <p className="data-muted">{r.reason}</p>
        </div>
      ),
    },
    { key: "amount", header: "Amount", align: "right", render: (r) => <MoneyDisplay value={r.amount} className="font-medium" /> },
    { key: "status", header: "Status", render: (r) => <RefundStatusBadge status={r.status} /> },
    { key: "reviewer", header: "Reviewer", render: (r) => <span className="data-muted">{r.assignedReviewer ?? "Unassigned"}</span> },
    { key: "date", header: "Date", align: "right", render: (r) => <span className="data-muted">{formatDate(r.createdAt)}</span> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <Link to={`${rolePath}/refunds/${r.id}`}>
          <Button variant="outline" size="sm" className="h-8">View</Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Refunds"
        description="Review, approve, or reject customer refund requests. Approved refunds reverse rewards and adjust accounting."
      />

      <FilterBar searchValue={q} onSearchChange={setQ} searchPlaceholder="Search order or customer…" className="mb-4">
        <Select value={status} onValueChange={(value) => setStatus(value as RefundStatus | "all")}>
          <SelectTrigger className="w-44 h-9 text-[12px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="under-review">Under review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="partially-refunded">Partially refunded</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      <DataTable
        rows={rows}
        columns={columns}
        loading={isLoading}
        rowKey={(r) => r.id}
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <RotateCcw className="h-5 w-5 text-ink-muted" />
            <span>No refund requests yet.</span>
          </div>
        }
      />

      <div className="mt-3 flex flex-col gap-2 text-[12px] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <span>{isFetching && !isLoading ? "Refreshing..." : resultLabel}</span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!meta?.hasPrev || isFetching}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>
          <span className="min-w-20 text-center">
            Page {meta?.page ?? page} of {meta?.totalPages ?? 1}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!meta?.hasNext || isFetching}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
