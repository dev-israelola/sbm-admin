import { useState } from "react";
import { Activity } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { useAuditLogs, type FrontendAuditLog } from "@/features/admin/useAuditLogs";
import { PaginationFooter } from "@/components/ui/pagination-footer";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";

function formatFullDate(isoString: string) {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function AuditLogsScreen() {
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();
  const { data, isLoading } = useAuditLogs({ page, dateFrom, dateTo, limit: DEFAULT_PAGE_SIZE });

  const columns: DataTableColumn<FrontendAuditLog>[] = [
    { key: "time", header: "Timestamp", render: (r) => <span className="text-[12px] text-ink">{formatFullDate(r.createdAt)}</span> },
    { key: "actor", header: "Staff Member", render: (r) => (
      <div>
        <p className="text-[13px] font-medium text-ink">{r.actorName}</p>
        <p className="data-muted">{r.actorRole.replace(/_/g, " ")}</p>
      </div>
    ) },
    { key: "action", header: "Action Executed", render: (r) => <Badge variant="soft">{r.action}</Badge> },
    { key: "resource", header: "Target Resource", render: (r) => (
      r.resourceType ? <span className="text-[12px] text-ink capitalize">{r.resourceType.toLowerCase()} <span className="text-ink-muted">({r.resourceId?.split('-')[0]})</span></span> : <span className="text-ink-muted">—</span>
    ) },
    { key: "ip", header: "Client IP", align: "right", render: (r) => <span className="text-[12px] text-ink-muted font-mono">{r.ipAddress || "Unknown"}</span> },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Security & Governance"
        title="Global Audit Logs"
        description="Immutable telemetry detailing all administrative behaviors, parameter mutations, and state changes."
      />
      
      <div className="mb-4 flex items-center justify-between bg-surface/50 border border-line rounded-xl p-2 px-3">
        <DateRangeFilter
          defaultPreset="today"
          onRangeChange={(range) => {
            setDateFrom(range.dateFrom);
            setDateTo(range.dateTo);
            setPage(1);
          }}
        />
      </div>

      <DataTable
        rows={data?.items}
        columns={columns}
        loading={isLoading}
        rowKey={(r) => r.id}
        dense
        emptyState={
          <div className="flex flex-col items-center gap-2 py-6">
            <Activity className="h-5 w-5 text-ink-muted" />
            <span className="text-[13px] text-ink-muted">No telemetry captured in this timeframe.</span>
          </div>
        }
      />
      <PaginationFooter meta={data?.meta} page={page} loading={isLoading} itemLabel="logs" onPageChange={setPage} />
    </div>
  );
}
