import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart, Line,
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  CreditCard,
  Gauge,
  PiggyBank,
  ReceiptText,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Warehouse,
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { paymentMethodShort } from "@/lib/admin-normalizers";
import { ChartCard } from "@/components/ui/chart-card";
import { PageHeader } from "@/components/layout/PageHeader";
import { MoneyDisplay } from "@/components/ui/money";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/orders/status-badges";
import { useAdminSummary } from "@/features/admin/useAdminSummary";
import { useOrders } from "@/features/orders/useOrders";
import { useInventory } from "@/features/products/useProducts";
import { useRefunds } from "@/features/refunds/useRefunds";
import { useDeliveries } from "@/features/delivery/useDeliveries";
import { formatDate, formatNaira } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";
import { inventoryStatus } from "@/types/product";
import { PLATFORM_CONFIG } from "@/types/platform";

const ACCENT = "hsl(161 33% 27%)";
const ACCENT_SOFT = "hsl(161 33% 60%)";
const WARN = "hsl(33 79% 44%)";
const DANGER = "hsl(4 78% 43%)";
const INFO = "hsl(222 89% 53%)";

interface Props {
  roleScope?: "admin" | "manager";
}

export function AdminOverview({ roleScope = "admin" }: Props) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const platform = PLATFORM_CONFIG[activePlatform];
  const summary = useAdminSummary();
  const orders = useOrders({});
  const inventory = useInventory();
  const refunds = useRefunds();
  const deliveries = useDeliveries({});
  const inventoryItems = inventory.data?.items ?? [];
  const deliveryItems = deliveries.data?.items ?? [];

  const s = summary.data?.summary;
  const counts = summary.data?.counts;

  const trendData = useMemo(() => {
    if (!orders.data?.items) return [];
    const buckets: Record<string, number> = {};
    const days = 14;
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      buckets[k] = 0;
    }
    orders.data.items.forEach((o) => {
      const k = o.createdAt.slice(0, 10);
      if (k in buckets) buckets[k] += o.subtotal;
    });
    return Object.entries(buckets).map(([date, sales]) => ({
      date: date.slice(5),
      sales,
    }));
  }, [orders.data]);

  const orderStatusData = useMemo(() => {
    if (!orders.data?.items) return [];
    const counts: Record<string, number> = {};
    orders.data.items.forEach((o) => {
      counts[o.status] = (counts[o.status] ?? 0) + 1;
    });
    return Object.entries(counts)
      .map(([k, v]) => ({ name: k.replace(/-/g, " "), value: v }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [orders.data]);

  const paymentMethodData = useMemo(() => {
    if (!orders.data?.items) return [];
    let paystack = 0, pod = 0;
    orders.data.items.forEach((o) => {
      if (o.paymentMethod === "paystack") paystack += 1;
      else pod += 1;
    });
    return [
      { name: "Paystack", value: paystack },
      { name: "POD", value: pod },
    ];
  }, [orders.data]);

  const topSellers = useMemo(() => {
    return [...inventoryItems]
      .sort((a, b) => b.soldStock - a.soldStock)
      .slice(0, 6)
      .map((p) => ({ name: p.name.length > 22 ? p.name.slice(0, 22) + "…" : p.name, sold: p.soldStock }));
  }, [inventoryItems]);

  const lowStock = useMemo(
    () =>
      inventoryItems
        .filter((p) => inventoryStatus(p) !== "in-stock")
        .sort((a, b) => a.availableStock - b.availableStock)
        .slice(0, 6),
    [inventoryItems],
  );

  const recentOrders = useMemo(() => orders.data?.items.slice(0, 6) ?? [], [orders.data]);
  const pendingVerification = useMemo(
    () => (orders.data?.items ?? []).filter((o) => o.status === "pending-verification").slice(0, 5),
    [orders.data],
  );
  const pendingRefunds = useMemo(
    () => (refunds.data?.items ?? []).filter((r) => ["submitted", "under-review"].includes(r.status)).slice(0, 5),
    [refunds.data],
  );
  const pendingPickup = useMemo(
    () => (orders.data?.items ?? []).filter((o) => o.status === "ready-for-pickup").slice(0, 5),
    [orders.data],
  );
  const deliveryExceptions = useMemo(
    () => deliveryItems.filter((d) => d.status === "failed-delivery" || d.collectionStatus === "discrepancy").slice(0, 5),
    [deliveryItems],
  );

  const basePath = roleScope === "manager" ? "/manager" : "/admin";

  return (
    <div>
      <PageHeader
        eyebrow={roleScope === "manager" ? "Manager · Overview" : "Admin · Overview"}
        title={`${platform.label} operations at a glance`}
        description={platform.overviewDescription}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to={`${basePath}/reports`}>
              View reports <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
        <MetricCard
          label="Gross sales (30d)"
          value={s ? formatNaira(s.grossSales) : "—"}
          sub={<>Net <MoneyDisplay value={s?.netSales ?? 0} size="sm" tone="muted" /></>}
          icon={Banknote}
          tone="accent"
          loading={summary.isLoading}
        />
        <MetricCard
          label="Estimated profit"
          value={s ? formatNaira(s.estimatedProfit) : "—"}
          sub={`After ${s ? formatNaira(s.expenses) : "₦0"} expenses`}
          icon={PiggyBank}
          tone={s && s.estimatedProfit >= 0 ? "success" : "danger"}
          loading={summary.isLoading}
        />
        <MetricCard
          label="Pending orders"
          value={counts?.pendingOrders ?? 0}
          sub={`${counts?.pendingVerification ?? 0} pending POD verification`}
          icon={ShoppingBag}
          tone="warn"
          loading={summary.isLoading}
        />
        <MetricCard
          label="POD orders"
          value={counts?.podOrders ?? 0}
          sub={`Paystack ${counts?.paystackOrders ?? 0}`}
          icon={CreditCard}
          loading={summary.isLoading}
        />
        <MetricCard
          label="Cash collected (POD)"
          value={s ? formatNaira(s.cashCollected) : "—"}
          sub={<><span className="text-danger">{s ? formatNaira(s.unreconciledPod) : "₦0"}</span> unreconciled</>}
          icon={ReceiptText}
          loading={summary.isLoading}
        />
        <MetricCard
          label="Low stock SKUs"
          value={counts?.lowStock ?? 0}
          sub="Items at or below threshold"
          icon={Warehouse}
          tone={(counts?.lowStock ?? 0) > 0 ? "warn" : "default"}
          loading={summary.isLoading}
        />
        <MetricCard
          label="Pending refunds"
          value={counts?.pendingRefunds ?? 0}
          sub="Awaiting decision"
          icon={RotateCcw}
          tone={(counts?.pendingRefunds ?? 0) > 0 ? "warn" : "default"}
          loading={summary.isLoading}
        />
        <MetricCard
          label="Pickup orders ready"
          value={counts?.pendingPickup ?? 0}
          sub="Awaiting customer collection"
          icon={Sparkles}
          loading={summary.isLoading}
        />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-3 lg:gap-4 mt-4">
        <ChartCard
          title="Sales trend"
          description="Subtotal per day, last 14 days"
          actions={<Badge variant="soft" className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> 14-day</Badge>}
        >
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 8, left: 8, right: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--line))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--ink-muted))" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--ink-muted))" }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} width={48} />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid hsl(var(--line))", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => formatNaira(v)}
                />
                <Area type="monotone" dataKey="sales" stroke={ACCENT} strokeWidth={2} fill="url(#salesFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Payment method" description="Last 30 days">
          <div className="h-[260px] grid grid-cols-[1.2fr_1fr] items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentMethodData} dataKey="value" innerRadius={48} outerRadius={80} paddingAngle={2}>
                  {paymentMethodData.map((entry, i) => (
                    <Cell key={i} fill={i === 0 ? ACCENT : WARN} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(var(--line))", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="space-y-2 text-[12px]">
              {paymentMethodData.map((d, i) => (
                <li key={d.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: i === 0 ? ACCENT : WARN }} />
                  <span className="text-ink">{d.name}</span>
                  <span className="ml-auto text-ink-muted tabular-nums">{d.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-3 lg:gap-4 mt-4">
        <ChartCard title="Revenue vs Expenses" description="30-day rolling">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Net sales", value: s?.netSales ?? 0 },
                  { name: "Cost of goods", value: s?.cogs ?? 0 },
                  { name: "Delivery", value: s?.deliveryFeesActual ?? 0 },
                  { name: "Packaging", value: s?.packagingCosts ?? 0 },
                  { name: "Gateway", value: s?.gatewayFees ?? 0 },
                  { name: "Expenses", value: s?.expenses ?? 0 },
                  { name: "Refunds", value: s?.refunds ?? 0 },
                ]}
                margin={{ top: 12, left: 8, right: 8, bottom: 0 }}
              >
                <CartesianGrid stroke="hsl(var(--line))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--ink-muted))" }} axisLine={false} tickLine={false} interval={0} />
                <YAxis tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "hsl(var(--ink-muted))" }} axisLine={false} tickLine={false} width={48} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(var(--line))", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => formatNaira(v)} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={ACCENT} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Top selling SKUs" description="Lifetime units sold">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSellers} layout="vertical" margin={{ top: 4, left: 110, right: 16, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--line))" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--ink-muted))" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--ink))" }} axisLine={false} tickLine={false} width={110} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(var(--line))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="sold" radius={[0, 6, 6, 0]} fill={ACCENT_SOFT} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-3 lg:gap-4 mt-4">
        <ChartCard
          title="Recent orders"
          description="Click to open"
          actions={
            <Button asChild size="sm" variant="ghost">
              <Link to={`${basePath}/orders`}>See all <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          }
          bodyClassName="p-0"
        >
          <ul className="divide-y divide-line/60">
            {recentOrders.map((o) => (
              <li key={o.id}>
                <Link
                  to={`${basePath}/orders/${o.id}`}
                  className="grid grid-cols-[1.4fr_1fr_auto_auto] items-center gap-4 px-5 py-3 hover:bg-surface-muted/60 transition-colors"
                >
                  <div>
                    <p className="text-[13px] font-medium text-ink">{o.number}</p>
                    <p className="text-[11px] text-ink-muted">{o.customerName} · {formatDate(o.createdAt)}</p>
                  </div>
                  <p className="text-[12px] text-ink-muted">
                    {paymentMethodShort(o.paymentMethod)} · {o.deliveryMethod === "pickup" ? "Pickup" : "Home"}
                  </p>
                  <OrderStatusBadge status={o.status} />
                  <MoneyDisplay value={o.total} className="font-medium" />
                </Link>
              </li>
            ))}
          </ul>
        </ChartCard>

        <ChartCard
          title="Order status breakdown"
          description="Live distribution"
        >
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={orderStatusData} dataKey="value" nameKey="name" outerRadius={86} innerRadius={48} paddingAngle={2}>
                  {orderStatusData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={
                        [ACCENT, ACCENT_SOFT, WARN, INFO, DANGER, "hsl(33 7% 41%)"][i % 6]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(var(--line))", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-3 lg:gap-4 mt-4">
        <ChartCard
          title="Pending POD verification"
          description="Verify customer before fulfilment"
          actions={
            <Button asChild size="sm" variant="ghost">
              <Link to={`${basePath}/orders?status=pending-verification`}>Open <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          }
          bodyClassName="p-0"
        >
          {pendingVerification.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-muted">All caught up.</p>
          ) : (
            <ul className="divide-y divide-line/60">
              {pendingVerification.map((o) => (
                <li key={o.id}>
                  <Link to={`${basePath}/orders/${o.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-surface-muted/60">
                    <div>
                      <p className="text-[13px] font-medium text-ink">{o.number}</p>
                      <p className="text-[11px] text-ink-muted">{o.customerName} · {formatDate(o.createdAt)}</p>
                    </div>
                    <MoneyDisplay value={o.total} className="font-medium" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>

        <ChartCard
          title="Refund requests"
          description="Awaiting decision"
          actions={
            <Button asChild size="sm" variant="ghost">
              <Link to={`${basePath}/refunds`}>Open <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          }
          bodyClassName="p-0"
        >
          {pendingRefunds.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-muted">No open refunds.</p>
          ) : (
            <ul className="divide-y divide-line/60">
              {pendingRefunds.map((r) => (
                <li key={r.id}>
                  <Link to={`${basePath}/refunds/${r.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-surface-muted/60">
                    <div>
                      <p className="text-[13px] font-medium text-ink">{r.orderNumber} · {r.productName}</p>
                      <p className="text-[11px] text-ink-muted">{r.reason} · {r.customerName}</p>
                    </div>
                    <MoneyDisplay value={r.amount} className="font-medium" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>

        <ChartCard
          title="Pickup orders ready"
          description="Awaiting customer collection"
          actions={
            <Button asChild size="sm" variant="ghost">
              <Link to={`${basePath}/pickup-handoffs`}>Open <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          }
          bodyClassName="p-0"
        >
          {pendingPickup.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-muted">No pickups awaiting.</p>
          ) : (
            <ul className="divide-y divide-line/60">
              {pendingPickup.map((o) => (
                <li key={o.id}>
                  <Link to={`${basePath}/orders/${o.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-surface-muted/60">
                    <div>
                      <p className="text-[13px] font-medium text-ink">{o.number}</p>
                      <p className="text-[11px] text-ink-muted">{o.pickupStation?.name ?? "—"} · {o.customerName}</p>
                    </div>
                    <MoneyDisplay value={o.total} className="font-medium" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>

        <ChartCard
          title="Delivery exceptions"
          description="Failed or discrepancy"
          actions={
            <Button asChild size="sm" variant="ghost">
              <Link to={`${basePath}/delivery`}>Open <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          }
          bodyClassName="p-0"
        >
          {deliveryExceptions.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-muted">No exceptions.</p>
          ) : (
            <ul className="divide-y divide-line/60">
              {deliveryExceptions.map((d) => (
                <li key={d.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-[13px] font-medium text-ink">{d.orderNumber}</p>
                    <p className="text-[11px] text-ink-muted">{d.customerName} · {d.city}</p>
                  </div>
                  <Badge variant="danger">
                    <AlertTriangle className="h-3 w-3" />
                    {d.status === "failed-delivery" ? "Failed" : "Discrepancy"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>
      </div>

      <div className="mt-4">
        <ChartCard
          title="Low stock alerts"
          description="At or below threshold"
          actions={
            <Button asChild size="sm" variant="ghost">
              <Link to={`${basePath}/inventory`}>Open inventory <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          }
          bodyClassName="p-0"
        >
          {lowStock.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-muted">All SKUs above threshold.</p>
          ) : (
            <ul className="divide-y divide-line/60">
              {lowStock.map((p) => (
                <li key={p.id} className="grid grid-cols-[1.5fr_1fr_auto] items-center gap-3 px-5 py-3">
                  <div>
                    <p className="text-[13px] font-medium text-ink">{p.name}</p>
                    <p className="text-[11px] text-ink-muted">SKU {p.sku}</p>
                  </div>
                  <p className="text-[12px] text-ink-muted">
                    <Gauge className="h-3 w-3 inline mr-1" />
                    Threshold {p.lowStockThreshold}
                  </p>
                  <Badge variant={p.availableStock <= 0 ? "danger" : "warn"}>
                    {p.availableStock <= 0 ? "Out" : `${p.availableStock} left`}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
