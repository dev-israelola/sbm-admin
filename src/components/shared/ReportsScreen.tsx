import { useState } from "react";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReportExportControls } from "@/components/reports/ReportExportControls";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import {
  presetToDates,
  type DateRange,
  type ReportData,
  type ReportId,
  type ReportRange,
  useReport,
} from "@/features/reports/useReports";
import { formatNaira } from "@/lib/format";

const REPORTS: { id: ReportId; title: string; description: string; tag: string }[] = [
  { id: "sales", title: "Sales report", description: "Orders, gross, net, taxes and net per period.", tag: "Accounting" },
  { id: "inventory", title: "Inventory report", description: "Available, reserved, sold, returned, damaged per SKU.", tag: "Catalog" },
  { id: "orders", title: "Order report", description: "Full lifecycle status counts per period.", tag: "Operations" },
  { id: "refunds", title: "Refund report", description: "Refund volume by reason and resolution.", tag: "Operations" },
  { id: "delivery", title: "Delivery report", description: "On-time, failed, returned per delivery type.", tag: "Operations" },
  { id: "pickup", title: "Pickup-station report", description: "Pickup handoffs, dwell time, station throughput.", tag: "Operations" },
  { id: "customer", title: "Customer report", description: "Acquisition, retention, AOV cohorts.", tag: "Commercial" },
  { id: "profit-loss", title: "Profit & loss report", description: "Detailed P&L with category breakdown.", tag: "Accounting" },
  { id: "cash-collection", title: "Cash collection report", description: "POD collections, reconciliations and discrepancies.", tag: "Accounting" },
  { id: "low-stock", title: "Low-stock report", description: "All SKUs at or below their threshold.", tag: "Catalog" },
];

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function asArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.map(asRecord) : [];
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function labelize(value: unknown) {
  return String(value ?? "unknown").replace(/_/g, " ").toLowerCase();
}

function summarizeReport(id: ReportId, data?: ReportData) {
  if (!data) return "Waiting for live data";
  const totals = asRecord(data.totals);
  const items = asArray(data.items);
  const byStatus = asArray(data.byStatus);

  if (id === "sales") {
    return `${asNumber(totals.orders)} paid orders - ${formatNaira(asNumber(totals.gross))} gross`;
  }
  if (id === "refunds") {
    return `${asNumber(totals.count)} refunds - ${formatNaira(asNumber(totals.amount))}`;
  }
  if (id === "orders") {
    return `${asNumber(data.total)} orders across ${byStatus.length} statuses`;
  }
  if (id === "delivery") {
    return byStatus.length ? byStatus.map((row) => `${labelize(row.status)}: ${asNumber(row.count)}`).join(", ") : "No delivery records in range";
  }
  if (id === "pickup") {
    return `${asNumber(data.activeStationCount)} active pickup stations - ${asNumber(data.total)} handoffs`;
  }
  if (id === "customer") {
    return `${items.length} top customers in selected range`;
  }
  if (id === "profit-loss") {
    return `Net sales ${formatNaira(asNumber(data.netSales))} - profit ${formatNaira(asNumber(data.estimatedProfit))}`;
  }
  if (id === "cash-collection") {
    const expected = byStatus.reduce((sum, row) => sum + asNumber(row.expected), 0);
    const collected = byStatus.reduce((sum, row) => sum + asNumber(row.collected), 0);
    return `${formatNaira(collected)} collected of ${formatNaira(expected)} expected`;
  }
  return `${asNumber(data.total) || items.length} rows available`;
}

function ReportCard({ report, range }: { report: (typeof REPORTS)[number]; range: DateRange }) {
  const query = useReport(report.id, range);
  const data = query.data;

  return (
    <article className="card p-5 flex flex-col gap-3">
      <div>
        <Badge variant="soft" className="mb-2">{report.tag}</Badge>
        <h2 className="font-display text-base text-ink">{report.title}</h2>
        <p className="text-[12px] text-ink-muted leading-relaxed mt-1">{report.description}</p>
      </div>
      <div className="rounded-xl bg-cream/60 border border-line/70 px-3 py-2 text-[11px] text-ink-muted min-h-12">
        {query.isLoading ? (
          <span className="inline-flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading live report...</span>
        ) : query.error ? (
          <span className="text-danger">{query.error.message}</span>
        ) : (
          <span>{summarizeReport(report.id, data)}</span>
        )}
      </div>
      <div className="mt-auto">
        <ReportExportControls
          reportId={report.id}
          title={report.title}
          range={range}
          disabled={query.isLoading || !!query.error}
        />
      </div>
    </article>
  );
}

export function ReportsScreen() {
  const [effective, setEffective] = useState<DateRange>(presetToDates("30d"));

  const fromLabel = new Date(effective.dateFrom).toLocaleDateString("en-NG");
  const toLabel = new Date(effective.dateTo).toLocaleDateString("en-NG");

  return (
    <div>
      <PageHeader
        eyebrow="Reports"
        title="Operational & financial reports"
        description={`Live backend reports from ${fromLabel} to ${toLabel}.`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <DateRangeFilter
              defaultPreset="30d"
              onRangeChange={(range) => {
                if (range.dateFrom && range.dateTo) {
                  setEffective({ dateFrom: range.dateFrom, dateTo: range.dateTo });
                }
              }}
            />
          </div>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS.map((r) => (
          <ReportCard key={r.id} report={r} range={effective} />
        ))}
      </div>
    </div>
  );
}
