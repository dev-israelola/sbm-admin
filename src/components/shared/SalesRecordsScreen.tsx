import { useState } from "react";
import { Receipt } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { MoneyDisplay } from "@/components/ui/money";
import { ReportExportControls } from "@/components/reports/ReportExportControls";
import { useSales } from "@/features/accounting/useAccounting";
import { PaginationFooter } from "@/components/ui/pagination-footer";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { formatDate } from "@/lib/format";
import type { SalesRecord } from "@/types/accounting";

export function SalesRecordsScreen() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSales({ page, limit: DEFAULT_PAGE_SIZE });

  const columns: DataTableColumn<SalesRecord>[] = [
    { key: "no", header: "Order", render: (r) => <span className="text-[13px] font-medium text-ink">{r.orderNumber}</span> },
    { key: "cust", header: "Customer", render: (r) => <span className="data-cell">{r.customerName}</span> },
    { key: "pm", header: "Payment", render: (r) => (
      <div className="flex flex-col gap-1">
        <Badge variant={r.paymentMethod === "paystack" ? "info" : "warn"}>
          {r.paymentMethod === "paystack" ? "Paystack" : "POD"}
        </Badge>
        <span className="text-[11px] text-ink-muted capitalize">{r.paymentStatus}</span>
      </div>
    ) },
    { key: "gross", header: "Gross", align: "right", render: (r) => <MoneyDisplay value={r.grossAmount} /> },
    { key: "disc", header: "Discount", align: "right", render: (r) => <MoneyDisplay value={-r.discount} tone="muted" /> },
    { key: "net", header: "Net", align: "right", render: (r) => <MoneyDisplay value={r.netAmount} className="font-medium" /> },
    { key: "fee", header: "Gateway fee", align: "right", render: (r) => <MoneyDisplay value={r.gatewayFee} tone="muted" /> },
    { key: "stat", header: "Accounting", render: (r) => (
      <Badge variant={r.accountingStatus === "reconciled" ? "success" : r.accountingStatus === "discrepancy" ? "danger" : "warn"}>
        {r.accountingStatus}
      </Badge>
    ) },
    { key: "date", header: "Date", align: "right", render: (r) => <span className="data-muted">{formatDate(r.date)}</span> },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Accounting"
        title="Sales records"
        description="Every order that has cleared the basic stages."
        actions={<ReportExportControls reportId="sales" title="Sales report" />}
      />
      <DataTable
        rows={data?.items}
        columns={columns}
        loading={isLoading}
        rowKey={(r) => r.id}
        dense
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <Receipt className="h-5 w-5 text-ink-muted" />
            <span>No sales recorded yet.</span>
          </div>
        }
      />
      <PaginationFooter meta={data?.meta} page={page} loading={isLoading} itemLabel="sales" onPageChange={setPage} />
    </div>
  );
}
