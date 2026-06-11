import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const REPORTS: { id: string; title: string; description: string; tag: string }[] = [
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

export function ReportsScreen() {
  const [range, setRange] = useState("30d");
  function fakeExport(format: string, title: string) {
    toast.success(`Generating ${format.toUpperCase()} for ${title}…`, { description: "Mocked — wire to backend later." });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Reports"
        title="Operational & financial reports"
        description="Snapshot views — export to CSV or PDF for finance/ops review."
        actions={
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-36 h-9 text-[12px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS.map((r) => (
          <article key={r.id} className="card p-5 flex flex-col gap-3">
            <div>
              <Badge variant="soft" className="mb-2">{r.tag}</Badge>
              <h2 className="font-display text-base text-ink">{r.title}</h2>
              <p className="text-[12px] text-ink-muted leading-relaxed mt-1">{r.description}</p>
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <Button size="xs" variant="outline" onClick={() => fakeExport("csv", r.title)}>
                <FileSpreadsheet className="h-3 w-3" /> CSV
              </Button>
              <Button size="xs" variant="outline" onClick={() => fakeExport("pdf", r.title)}>
                <FileText className="h-3 w-3" /> PDF
              </Button>
              <Button size="xs" variant="ghost" onClick={() => fakeExport("print", r.title)}>
                <Printer className="h-3 w-3" /> Print
              </Button>
              <Button size="xs" variant="ghost" className="ml-auto" onClick={() => fakeExport("download", r.title)}>
                <Download className="h-3 w-3" /> View
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
