import { useState } from "react";
import { Link } from "react-router-dom";
import { Receipt } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { MoneyDisplay } from "@/components/ui/money";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { useAllTransactions } from "@/features/accounting/useAccounting";
import { PaginationFooter } from "@/components/ui/pagination-footer";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { formatDate } from "@/lib/format";

export function TransactionsScreen() {
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();
  
  const { data, isLoading } = useAllTransactions({ page, dateFrom, dateTo, limit: DEFAULT_PAGE_SIZE });

  const columns: DataTableColumn<any>[] = [
    { key: "date", header: "Date", render: (r) => <span className="text-[12px] text-ink-muted">{formatDate(r.occurredAt)}</span> },
    { key: "direction", header: "Type", render: (r) => (
      <Badge variant={r.direction === "INFLOW" ? "success" : "danger"}>
        {r.type.replace(/_/g, " ")}
      </Badge>
    ) },
    { key: "ref", header: "Audit trace Reference", render: (r) => (
      <div className="flex flex-col">
        <span className="font-mono text-[12px] text-ink truncate max-w-[240px]" title={r.reference}>
          {r.reference || <span className="text-ink-muted italic">Internal</span>}
        </span>
        {r.gateway && <span className="text-[10px] text-ink-muted uppercase">{r.gateway.replace("_", " ")}</span>}
      </div>
    ) },
    { key: "target", header: "Linked Entity", render: (r) => (
       <div className="flex flex-col">
          <span className="text-[13px]">{r.targetName || "System"}</span>
          {r.orderNumber && (
            <Link to={`/admin/orders/${r.orderId || r.order?.id || r.id}`} className="text-[11px] text-primary hover:underline">
              Order: {r.orderNumber}
            </Link>
          )}
       </div>
    ) },
    { key: "amount", header: "Ledger Amount", align: "right", render: (r) => (
      <MoneyDisplay 
        value={r.amount} 
        className={`font-medium ${r.direction === "INFLOW" ? "text-green-600" : "text-red-500"}`} 
      />
    ) },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Finance & Overrides"
        title="All Transactions"
        description="Unified global tracking ledger to audit external paystack references, cash allocations, and internal outflows."
      />
      <div className="mb-4 flex items-center justify-between bg-surface/50 border border-line rounded-xl p-2 px-3">
        <DateRangeFilter
          defaultPreset="30d"
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
        rowKey={(r: any) => r.id}
        dense
        emptyState={
          <div className="flex flex-col items-center gap-2 py-6">
            <Receipt className="h-5 w-5 text-ink-muted" />
            <span className="text-[13px] text-ink-muted">No transactions recorded in this period.</span>
          </div>
        }
      />
      <PaginationFooter meta={data?.meta} page={page} loading={isLoading} itemLabel="transactions" onPageChange={setPage} />
    </div>
  );
}
