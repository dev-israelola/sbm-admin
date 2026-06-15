import { useMemo } from "react";
import {
  ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip,
} from "recharts";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChartCard } from "@/components/ui/chart-card";
import { MoneyDisplay } from "@/components/ui/money";
import { Separator } from "@/components/ui/separator";
import { ReportExportControls } from "@/components/reports/ReportExportControls";
import { useProfitLossReport } from "@/features/accounting/useAccounting";
import { presetToDates } from "@/features/reports/useReports";
import { formatNaira } from "@/lib/format";
import { EXPENSE_CATEGORY_LABEL } from "@/types/accounting";

export function ProfitLossScreen() {
  const report = useProfitLossReport("30d");
  const s = report.data;

  const rows = useMemo(() => s ? [
    { label: "Gross sales", value: s.grossSales, kind: "in" },
    { label: "Discounts", value: -s.discounts, kind: "out" },
    { label: "Reward discounts", value: -s.rewardDiscounts, kind: "out" },
    { label: "Refunds", value: -s.refunds, kind: "out" },
    { label: "Net sales", value: s.netSales, kind: "subtotal" },
    { label: "Delivery fees charged", value: s.deliveryFeesCharged, kind: "in" },
    { label: "Cost of goods sold", value: -s.cogs, kind: "out" },
    { label: "Gateway fees", value: -s.gatewayFees, kind: "out" },
    { label: "Operating expenses", value: -s.expensesTotal, kind: "out" },
    { label: "Estimated profit", value: s.estimatedProfit, kind: "total" },
  ] : [], [s]);

  const chartData = useMemo(() => {
    if (!s) return [];
    const categoryRows = s.expensesByCategory.map((expense) => ({
      name: EXPENSE_CATEGORY_LABEL[expense.category as keyof typeof EXPENSE_CATEGORY_LABEL] ?? expense.category,
      value: expense.amount,
    }));
    return [
      { name: "COGS", value: s.cogs },
      { name: "Gateway fees", value: s.gatewayFees },
      ...categoryRows,
    ].filter((row) => row.value > 0);
  }, [s]);

  return (
    <div>
      <PageHeader
        eyebrow="Accounting"
        title="Profit & loss"
        description="Live 30-day P&L report from backend accounting records."
        actions={<ReportExportControls reportId="profit-loss" title="Profit & loss" range={presetToDates("30d")} />}
      />

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-4">
        <section className="card p-5">
          <dl className="divide-y divide-line/60 min-h-64">
            {report.isLoading && <p className="text-[12px] text-ink-muted py-3">Loading live P&L...</p>}
            {report.error && <p className="text-[12px] text-danger py-3">{report.error.message}</p>}
            {rows.map((r) => (
              <div key={r.label} className={`flex items-center justify-between py-2.5 ${r.kind === "subtotal" || r.kind === "total" ? "font-medium" : ""} ${r.kind === "total" ? "text-[15px] text-ink" : "text-[13px]"}`}>
                <dt className={r.kind === "in" ? "text-ink" : r.kind === "out" ? "text-ink-muted" : "text-ink"}>{r.label}</dt>
                <dd className={`tabular-nums ${r.kind === "out" ? "text-danger" : r.kind === "total" ? "text-success" : ""}`}>
                  <MoneyDisplay value={r.value} className="font-medium" tone={r.kind === "out" ? "negative" : r.kind === "total" ? "positive" : "default"} />
                </dd>
              </div>
            ))}
          </dl>
          <Separator className="my-4" />
          <p className="text-[11px] text-ink-muted">All values come from paid orders, refunds, accounting records, and logged expenses over the last 30 days.</p>
        </section>

        <ChartCard title="Where the money goes" description="Backend cost and expense components">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 4, left: 140, right: 16, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--line))" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `₦${(v / 100000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "hsl(var(--ink-muted))" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--ink))" }} axisLine={false} tickLine={false} width={140} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(var(--line))", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => formatNaira(v)} />
                <Bar dataKey="value" fill="hsl(161 33% 27%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
