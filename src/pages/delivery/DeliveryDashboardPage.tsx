import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Truck, Wallet, Clock } from "lucide-react";
import { useDeliveries } from "@/features/delivery/useDeliveries";
import { useAuthStore } from "@/store/auth-store";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/ui/metric-card";
import { ChartCard } from "@/components/ui/chart-card";
import { DeliveryStatusBadge, CollectionStatusBadge } from "@/components/delivery/status-badge";
import { MoneyDisplay } from "@/components/ui/money";
import { Button } from "@/components/ui/button";
import { formatDate, formatNaira } from "@/lib/format";

export default function DeliveryDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data } = useDeliveries({ assigneeId: user?.id });
  const deliveries = data?.items ?? [];

  const today = useMemo(() => {
    const todayDate = new Date().toISOString().slice(0, 10);
    return deliveries.filter((d) => d.scheduledFor.slice(0, 10) === todayDate);
  }, [deliveries]);

  const cashExpected = useMemo(
    () => today.filter((d) => d.paymentMethod === "pod").reduce((acc, d) => acc + d.amountToCollect, 0),
    [today],
  );

  const inProgress = deliveries.filter((d) => ["assigned", "picked-up", "in-transit"].includes(d.status)).length;
  const completed = deliveries.filter((d) => d.status === "delivered").length;

  return (
    <div>
      <PageHeader
        eyebrow="Delivery"
        title={`Today's deliveries, ${user?.fullName?.split(" ")[0] ?? ""}`}
        description="Update each assignment as you go. Tap an order to start."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Today" value={today.length} icon={Clock} tone="accent" sub="Scheduled today" />
        <MetricCard label="In progress" value={inProgress} icon={Truck} sub="Active routes" />
        <MetricCard label="Completed" value={completed} icon={CheckCircle2} tone="success" sub="Delivered this week" />
        <MetricCard label="Cash expected (POD)" value={formatNaira(cashExpected)} icon={Wallet} sub="Across today's POD orders" />
      </div>

      <div className="mt-4">
        <ChartCard
          title="My assignments"
          description="Tap to open and update status"
          bodyClassName="p-0"
          actions={
            <Button asChild size="sm" variant="ghost">
              <Link to="/delivery/assignments">All assignments <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          }
        >
          {deliveries.length === 0 ? (
            <p className="px-5 py-8 text-sm text-ink-muted">No assignments yet. Check back later.</p>
          ) : (
            <ul className="divide-y divide-line/60">
              {deliveries.slice(0, 10).map((d) => (
                <li key={d.id}>
                  <Link to={`/delivery/assignments/${d.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-surface-muted/60 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-ink">{d.orderNumber}</p>
                      <p className="text-[11px] text-ink-muted truncate">{d.customerName} · {d.city}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <DeliveryStatusBadge status={d.status} />
                      <CollectionStatusBadge status={d.collectionStatus} />
                    </div>
                    {d.paymentMethod === "pod" && (
                      <MoneyDisplay value={d.amountToCollect} className="font-medium w-24 text-right" />
                    )}
                    <span className="text-[11px] text-ink-muted hidden sm:block w-20 text-right">{formatDate(d.scheduledFor)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
