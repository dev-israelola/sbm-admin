import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { FilterBar } from "@/components/ui/filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useConsultations } from "@/features/consultations/useConsultations";
import { PaginationFooter } from "@/components/ui/pagination-footer";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { formatDate } from "@/lib/format";
import type { Consultation } from "@/types/consultation";

const STATUS_BADGE: Record<Consultation["status"], any> = {
  pending: "warn",
  scheduled: "info",
  completed: "success",
  cancelled: "danger",
  "recommendation-sent": "soft",
};

export function ConsultationsScreen({ rolePath }: { rolePath: string }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useConsultations({
    status: status === "all" ? undefined : status,
    page,
    limit: DEFAULT_PAGE_SIZE,
  });

  useEffect(() => {
    setPage(1);
  }, [q, status]);

  const filtered = useMemo(() => {
    if (!data?.items) return undefined;
    const search = q.toLowerCase();
    return data.items.filter((c) => {
      if (search && !`${c.customerName} ${c.primaryConcern}`.toLowerCase().includes(search)) return false;
      return true;
    });
  }, [data, q, status]);

  const columns: DataTableColumn<Consultation>[] = [
    {
      key: "customer",
      header: "Customer",
      render: (c) => (
        <div>
          <Link to={`${rolePath}/consultations/${c.id}`} className="text-[13px] font-medium text-ink hover:text-accent">
            {c.customerName}
          </Link>
          <p className="data-muted">{c.customerEmail}</p>
        </div>
      ),
    },
    { key: "concern", header: "Concern", render: (c) => <span className="data-cell">{c.primaryConcern}</span> },
    { key: "date", header: "Preferred date", render: (c) => <span className="data-muted">{formatDate(c.preferredDate)} · {c.preferredTime}</span> },
    { key: "consultant", header: "Consultant", render: (c) => <span className="data-muted">{c.consultantName ?? "Unassigned"}</span> },
    { key: "status", header: "Status", render: (c) => <Badge variant={STATUS_BADGE[c.status]}>{c.status.replace("-", " ")}</Badge> },
    { key: "created", header: "Created", align: "right", render: (c) => <span className="data-muted">{formatDate(c.createdAt)}</span> },
  ];

  return (
    <div>
      <PageHeader eyebrow="Operations" title="Consultations" description="Schedule, assign and build herbal protocols for customers." />
      <FilterBar searchValue={q} onSearchChange={setQ} searchPlaceholder="Search customer or concern…" className="mb-4">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44 h-9 text-[12px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="recommendation-sent">Recommendation sent</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>
      <DataTable
        rows={filtered}
        columns={columns}
        loading={isLoading}
        rowKey={(c) => c.id}
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <MessageSquare className="h-5 w-5 text-ink-muted" />
            <span>No consultations match these filters.</span>
          </div>
        }
      />
      <PaginationFooter meta={data?.meta} page={page} loading={isLoading} itemLabel="consultations" onPageChange={setPage} />
    </div>
  );
}
