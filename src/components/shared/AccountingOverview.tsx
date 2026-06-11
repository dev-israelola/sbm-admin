import { useMemo } from "react";
import {
  Banknote, CreditCard, Receipt, RotateCcw, PiggyBank, Wallet, FileText, AlertTriangle,
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { ChartCard } from "@/components/ui/chart-card";
import { PageHeader } from "@/components/layout/PageHeader";
import { MoneyDisplay } from "@/components/ui/money";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { useAccountingSummary, useSales, useExpenses } from "@/features/accounting/useAccounting";
import { formatNaira } from "@/lib/format";
import { EXPENSE_CATEGORY_LABEL } from "@/types/accounting";

export function AccountingOverview() {
  const summary = useAccountingSummary();
  const sales = useSales();
  const expenses = useExpenses();
  const s = summary.data;

  const expenseByCategory = useMemo(() => {
    if (!expenses.data) return [];
    const byCat: Record<string, number> = {};
    expenses.data.forEach((e) => {
      byCat[e.category] = (byCat[e.category] ?? 0) + e.amount;
    });
    return Object.entries(byCat)
      .map(([k, v]) => ({ name: EXPENSE_CATEGORY_LABEL[k as keyof typeof EXPENSE_CATEGORY_LABEL] ?? k, amount: v }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses.data]);

  const salesByDay = useMemo(() => {
    if (!sales.data) return [];
    const buckets: Record<string, { date: string; gross: number; net: number }> = {};
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      buckets[k] = { date: k.slice(5), gross: 0, net: 0 };
    }
    sales.data.forEach((r) => {
      const k = r.date.slice(0, 10);
      if (k in buckets) {
        buckets[k].gross += r.grossAmount;
        buckets[k].net += r.netAmount;
      }
    });
    return Object.values(buckets);
  }, [sales.data]);

  return (
    <div>
      <PageHeader eyebrow="Accounting · Overview" title="Dashboard" description="Last 30 days. All figures are NGN unless stated." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        <MetricCard label="Gross sales" value={s ? formatNaira(s.grossSales) : "—"} icon={Banknote} tone="accent" loading={summary.isLoading} sub={<>Net <MoneyDisplay value={s?.netSales ?? 0} size="sm" tone="muted" /></>} />
        <MetricCard label="Estimated profit" value={s ? formatNaira(s.estimatedProfit) : "—"} icon={PiggyBank} tone={s && s.estimatedProfit >= 0 ? "success" : "danger"} loading={summary.isLoading} sub={`Expenses ${s ? formatNaira(s.expenses) : "₦0"}`} />
        <MetricCard label="Refunds" value={s ? formatNaira(s.refunds) : "—"} icon={RotateCcw} tone={(s?.refunds ?? 0) > 0 ? "warn" : "default"} loading={summary.isLoading} />
        <MetricCard label="COGS" value={s ? formatNaira(s.cogs) : "—"} icon={Receipt} loading={summary.isLoading} />
        <MetricCard label="Delivery fees charged" value={s ? formatNaira(s.deliveryFeesCharged) : "—"} icon={Wallet} loading={summary.isLoading} sub={`Actual cost ${s ? formatNaira(s.deliveryFeesActual) : "₦0"}`} />
        <MetricCard label="Packaging cost" value={s ? formatNaira(s.packagingCosts) : "—"} icon={Receipt} loading={summary.isLoading} />
        <MetricCard label="Gateway fees (Paystack)" value={s ? formatNaira(s.gatewayFees) : "—"} icon={CreditCard} loading={summary.isLoading} />
        <MetricCard label="Cash collected (POD)" value={s ? formatNaira(s.cashCollected) : "—"} icon={Banknote} loading={summary.isLoading} sub={<><AlertTriangle className="h-3 w-3 inline mr-1 text-danger" />{s ? formatNaira(s.unreconciledPod) : "₦0"} unreconciled</>} />
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-3 lg:gap-4 mt-4">
        <ChartCard title="Sales trend" description="Gross vs net, last 14 days">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesByDay} margin={{ top: 8, left: 8, right: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="grossF" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(161 33% 27%)" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(161 33% 27%)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="netF" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(33 79% 44%)" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(33 79% 44%)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--line))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--ink-muted))" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "hsl(var(--ink-muted))" }} axisLine={false} tickLine={false} width={48} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(var(--line))", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => formatNaira(v)} />
                <Area type="monotone" dataKey="gross" stroke="hsl(161 33% 27%)" strokeWidth={2} fill="url(#grossF)" />
                <Area type="monotone" dataKey="net" stroke="hsl(33 79% 44%)" strokeWidth={2} fill="url(#netF)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Expenses by category" description="Last 30 days">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseByCategory} layout="vertical" margin={{ top: 4, left: 120, right: 16, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--line))" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--ink-muted))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--ink))" }} axisLine={false} tickLine={false} width={120} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(var(--line))", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => formatNaira(v)} />
                <Bar dataKey="amount" fill="hsl(161 33% 27%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
