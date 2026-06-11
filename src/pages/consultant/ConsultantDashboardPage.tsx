import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, Sparkles, Clock } from "lucide-react";
import { useConsultations } from "@/features/consultations/useConsultations";
import { useAuthStore } from "@/store/auth-store";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/ui/metric-card";
import { ChartCard } from "@/components/ui/chart-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";

export default function ConsultantDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data } = useConsultations();

  const mine = useMemo(() => (data ?? []).filter((c) => c.consultantId === user?.id), [data, user]);
  const open = mine.filter((c) => c.status === "scheduled" || c.status === "pending");
  const sent = mine.filter((c) => c.status === "recommendation-sent" || c.status === "completed");

  return (
    <div>
      <PageHeader
        eyebrow="Consultations"
        title={`Hi ${user?.fullName?.split(" ")[0] ?? ""}, here's today.`}
        description="Open consultations, recent recommendations, and where to go next."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <MetricCard label="Open consultations" value={open.length} icon={Clock} tone="accent" sub="Awaiting recommendation" />
        <MetricCard label="Sent this month" value={sent.length} icon={Sparkles} tone="success" />
        <MetricCard label="Customers in my care" value={new Set(mine.map((c) => c.customerId)).size} icon={MessageSquare} />
      </div>

      <div className="mt-4">
        <ChartCard
          title="Open consultations"
          description="Build and send a protocol when ready"
          bodyClassName="p-0"
          actions={
            <Button asChild size="sm" variant="ghost">
              <Link to="/consultant/consultations">All consultations <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          }
        >
          {open.length === 0 ? (
            <p className="px-5 py-8 text-sm text-ink-muted">No open consultations right now.</p>
          ) : (
            <ul className="divide-y divide-line/60">
              {open.slice(0, 8).map((c) => (
                <li key={c.id}>
                  <Link to={`/consultant/consultations/${c.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-surface-muted/60">
                    <div>
                      <p className="text-[13px] font-medium text-ink">{c.customerName}</p>
                      <p className="text-[11px] text-ink-muted">{c.primaryConcern} · {formatDate(c.preferredDate)} {c.preferredTime}</p>
                    </div>
                    <Badge variant={c.status === "scheduled" ? "info" : "warn"}>{c.status.replace("-", " ")}</Badge>
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
