import { useMemo, useState } from "react";
import { Gift } from "lucide-react";
import { FilterBar } from "@/components/ui/filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRewards } from "@/features/rewards/useRewards";
import { PaginationFooter } from "@/components/ui/pagination-footer";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { RewardAdjustDialog } from "@/components/rewards/RewardAdjustDialog";
import { formatRelative } from "@/lib/format";
import type { CustomerRewardsSummary } from "@/types/rewards";

export function RewardsScreen() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useRewards({ page, limit: DEFAULT_PAGE_SIZE });
  const [adjustFor, setAdjustFor] = useState<CustomerRewardsSummary | null>(null);
  const handleSearchChange = (value: string) => {
    setQ(value);
    setPage(1);
  };

  const filtered = useMemo(() => {
    if (!data?.items) return undefined;
    const s = q.toLowerCase();
    return data.items.filter((r) => !s || `${r.customerName} ${r.customerEmail}`.toLowerCase().includes(s));
  }, [data, q]);

  const columns: DataTableColumn<CustomerRewardsSummary>[] = [
    {
      key: "name",
      header: "Customer",
      render: (r) => (
        <div>
          <p className="text-[13px] font-medium text-ink">{r.customerName}</p>
          <p className="data-muted">{r.customerEmail}</p>
        </div>
      ),
    },
    { key: "current", header: "Current", align: "right", render: (r) => <span className="font-display tabular-nums">{r.current}</span> },
    { key: "lifetime", header: "Lifetime", align: "right", render: (r) => <span className="tabular-nums text-ink-muted">{r.lifetime}</span> },
    { key: "redeemed", header: "Redeemed", align: "right", render: (r) => <span className="tabular-nums text-ink-muted">{r.redeemed}</span> },
    { key: "last", header: "Last activity", render: (r) => <span className="data-muted">{r.lastActivity ? formatRelative(r.lastActivity) : "—"}</span> },
    { key: "status", header: "Status", render: (r) => <Badge variant={r.status === "active" ? "success" : "warn"}>{r.status}</Badge> },
    {
      key: "act",
      header: "",
      align: "right",
      render: (r) => (
        <Button size="xs" variant="outline" onClick={() => setAdjustFor(r)}>Adjust</Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader eyebrow="Loyalty" title="Customer rewards" description="Manage point balances and audit adjustments." />
      <FilterBar searchValue={q} onSearchChange={handleSearchChange} searchPlaceholder="Search customer or email…" className="mb-4" />
      <DataTable
        rows={filtered}
        columns={columns}
        loading={isLoading}
        rowKey={(r) => r.customerId}
        dense
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <Gift className="h-5 w-5 text-ink-muted" />
            <span>No rewards yet.</span>
          </div>
        }
      />
      <PaginationFooter meta={data?.meta} page={page} loading={isLoading} itemLabel="reward wallets" onPageChange={setPage} />

      {adjustFor && (
        <RewardAdjustDialog
          open={!!adjustFor}
          onOpenChange={(v) => !v && setAdjustFor(null)}
          customerId={adjustFor.customerId}
          customerName={adjustFor.customerName}
        />
      )}
    </div>
  );
}
