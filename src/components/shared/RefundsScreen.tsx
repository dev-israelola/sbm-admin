import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { FilterBar } from "@/components/ui/filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { MoneyDisplay } from "@/components/ui/money";
import { RefundStatusBadge } from "@/components/refunds/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRefunds } from "@/features/refunds/useRefunds";
import { formatDate } from "@/lib/format";
import type { RefundRequest } from "@/types/refund";

export function RefundsScreen({ rolePath }: { rolePath: string }) {
  const { data, isLoading } = useRefunds();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    if (!data) return undefined;
    const search = q.toLowerCase();
    return data.filter((r) => {
      if (search && !`${r.orderNumber} ${r.customerName} ${r.productName}`.toLowerCase().includes(search)) return false;
      if (status !== "all" && r.status !== status) return false;
      return true;
    });
  }, [data, q, status]);

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
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Refunds"
        description="Review, approve, or reject customer refund requests. Approved refunds reverse rewards and adjust accounting."
      />

      <FilterBar searchValue={q} onSearchChange={setQ} searchPlaceholder="Search order or customer…" className="mb-4">
        <Select value={status} onValueChange={setStatus}>
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
        rows={filtered}
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
    </div>
  );
}
