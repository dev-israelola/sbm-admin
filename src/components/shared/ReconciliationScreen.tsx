import { useMemo, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { FilterBar } from "@/components/ui/filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoneyDisplay } from "@/components/ui/money";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ReportExportControls } from "@/components/reports/ReportExportControls";
import { useReconciliation, useReconcile } from "@/features/accounting/useAccounting";
import { PaginationFooter } from "@/components/ui/pagination-footer";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatDateTime, formatNaira } from "@/lib/format";
import type { ReconciliationRecord } from "@/types/accounting";

export function ReconciliationScreen() {
  const reconcile = useReconcile();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useReconciliation({
    status: status === "all" ? undefined : status,
    page,
    limit: DEFAULT_PAGE_SIZE,
  });
  const [pending, setPending] = useState<{ r: ReconciliationRecord; mode: "reconciled" | "discrepancy" } | null>(null);

  const filtered = useMemo(() => {
    if (!data?.items) return undefined;
    const s = q.toLowerCase();
    return data.items.filter((r) => {
      if (s && !`${r.orderNumber} ${r.customerName}`.toLowerCase().includes(s)) return false;
      return true;
    });
  }, [data, q, status]);

  const columns: DataTableColumn<ReconciliationRecord>[] = [
    { key: "order", header: "Order", render: (r) => <span className="text-[13px] font-medium text-ink">{r.orderNumber}</span> },
    { key: "cust", header: "Customer", render: (r) => <span className="data-cell">{r.customerName}</span> },
    { key: "exp", header: "Expected", align: "right", render: (r) => <MoneyDisplay value={r.amountExpected} /> },
    { key: "col", header: "Collected", align: "right", render: (r) => <MoneyDisplay value={r.amountCollected} className="font-medium" /> },
    { key: "diff", header: "Δ", align: "right", render: (r) => <MoneyDisplay value={r.difference} tone={r.difference < 0 ? "negative" : r.difference > 0 ? "positive" : "muted"} /> },
    { key: "method", header: "Method", render: (r) => <span className="data-muted capitalize">{r.collectionMethod.replace("-", " ")}</span> },
    { key: "by", header: "Collected by", render: (r) => <span className="data-muted">{r.collectedBy}</span> },
    { key: "status", header: "Status", render: (r) => (
      <Badge variant={r.status === "reconciled" ? "success" : r.status === "discrepancy" ? "danger" : r.status === "pending-review" ? "warn" : "neutral"}>
        {r.status.replace("-", " ")}
      </Badge>
    ) },
    { key: "act", header: "", align: "right", render: (r) => (
      r.status === "reconciled" ? (
        <span className="text-[11px] text-ink-muted">{r.reconciledBy}</span>
      ) : (
        <div className="flex gap-1 justify-end">
          <Button size="xs" variant="outline" onClick={() => setPending({ r, mode: "reconciled" })}>Reconcile</Button>
          <Button size="xs" variant="outline" onClick={() => setPending({ r, mode: "discrepancy" })}>Flag</Button>
        </div>
      )
    ) },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Accounting"
        title="Cash collection reconciliation"
        description="Verify collected POD payments against expected order totals. Discrepancies flag for follow-up."
        actions={<ReportExportControls reportId="cash-collection" title="Cash collection" />}
      />
      <FilterBar searchValue={q} onSearchChange={(value) => { setQ(value); setPage(1); }} searchPlaceholder="Search order or customer…" className="mb-4">
        <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
          <SelectTrigger className="w-44 h-9 text-[12px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="unreconciled">Unreconciled</SelectItem>
            <SelectItem value="pending-review">Pending review</SelectItem>
            <SelectItem value="reconciled">Reconciled</SelectItem>
            <SelectItem value="discrepancy">Discrepancy</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>
      <DataTable
        rows={filtered}
        columns={columns}
        loading={isLoading}
        rowKey={(r) => r.id}
        dense
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <ClipboardCheck className="h-5 w-5 text-ink-muted" />
            <span>Everything reconciled.</span>
          </div>
        }
      />
      <PaginationFooter meta={data?.meta} page={page} loading={isLoading} itemLabel="reconciliation records" onPageChange={setPage} />

      <ConfirmDialog
        open={!!pending}
        onOpenChange={(v) => !v && setPending(null)}
        title={pending?.mode === "reconciled" ? "Mark payment reconciled?" : "Flag discrepancy?"}
        description={
          pending
            ? pending.mode === "reconciled"
              ? `Confirm ${pending.r.orderNumber}: ${formatNaira(pending.r.amountCollected)} matches expected total.`
              : `Flag ${pending.r.orderNumber} for follow-up. Difference: ${formatNaira(pending.r.difference)}.`
            : ""
        }
        requireNote={pending?.mode === "discrepancy"}
        destructive={pending?.mode === "discrepancy"}
        confirmLabel={pending?.mode === "reconciled" ? "Reconcile" : "Flag discrepancy"}
        onConfirm={async (note) => {
          if (!pending) return;
          // The backend requires a note (3–500 chars) on both actions; supply a
          // sensible default when the accountant didn't type one (reconcile path).
          const finalNote =
            note && note.trim().length >= 3
              ? note.trim()
              : pending.mode === "reconciled"
                ? `Confirmed: ${formatNaira(pending.r.amountCollected)} matches expected total.`
                : "Flagged for follow-up.";
          await reconcile.mutateAsync({ id: pending.r.id, status: pending.mode, note: finalNote });
          toast.success(pending.mode === "reconciled" ? "Reconciled." : "Discrepancy flagged.");
        }}
      />
    </div>
  );
}
