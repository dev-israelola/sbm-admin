import { useState } from "react";
import { Ticket, Plus } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CouponDialog } from "@/components/coupons/CouponDialog";
import { useCoupons, useUpdateCoupon, useDeleteCoupon, type AdminCoupon } from "@/features/coupons/useCoupons";
import { formatNaira } from "@/lib/format";

function statusOf(c: AdminCoupon): { label: string; variant: "success" | "warn" } {
  if (!c.isActive) return { label: "Inactive", variant: "warn" };
  if (c.expiresAt && new Date(c.expiresAt).getTime() < Date.now()) return { label: "Expired", variant: "warn" };
  if (c.usedCount >= c.usageLimit) return { label: "Used up", variant: "warn" };
  return { label: "Active", variant: "success" };
}

export function CouponsScreen() {
  const { data, isLoading } = useCoupons();
  const update = useUpdateCoupon();
  const remove = useDeleteCoupon();
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteFor, setDeleteFor] = useState<AdminCoupon | null>(null);

  const columns: DataTableColumn<AdminCoupon>[] = [
    {
      key: "code",
      header: "Code",
      render: (c) => (
        <div>
          <p className="text-[13px] font-medium text-ink">{c.code}</p>
          {c.source && <p className="data-muted capitalize">{c.source}</p>}
        </div>
      ),
    },
    {
      key: "discount",
      header: "Discount",
      render: (c) => <span className="tabular-nums">{c.type === "PERCENT" ? `${c.value}%` : formatNaira(c.value / 100)}</span>,
    },
    {
      key: "usage",
      header: "Used",
      align: "right",
      render: (c) => <span className="tabular-nums text-ink-muted">{c.usedCount}/{c.usageLimit}</span>,
    },
    {
      key: "min",
      header: "Min order",
      align: "right",
      render: (c) => <span className="tabular-nums text-ink-muted">{c.minOrderKobo > 0 ? formatNaira(c.minOrderKobo / 100) : "—"}</span>,
    },
    {
      key: "expires",
      header: "Expires",
      render: (c) => <span className="data-muted">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "—"}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (c) => {
        const s = statusOf(c);
        return <Badge variant={s.variant}>{s.label}</Badge>;
      },
    },
    {
      key: "act",
      header: "",
      align: "right",
      render: (c) => (
        <div className="flex justify-end gap-2">
          <Button
            size="xs"
            variant="outline"
            disabled={update.isPending}
            onClick={() => update.mutate({ id: c.id, isActive: !c.isActive })}
          >
            {c.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button size="xs" variant="ghost" onClick={() => setDeleteFor(c)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Marketing"
        title="Coupons"
        description="Create and manage discount codes. Birthday gifts are issued automatically."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> New coupon
          </Button>
        }
      />
      <DataTable
        rows={data}
        columns={columns}
        loading={isLoading}
        rowKey={(c) => c.id}
        dense
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <Ticket className="h-5 w-5 text-ink-muted" />
            <span>No coupons yet.</span>
          </div>
        }
      />

      <CouponDialog open={createOpen} onOpenChange={setCreateOpen} />

      <ConfirmDialog
        open={!!deleteFor}
        onOpenChange={(v) => !v && setDeleteFor(null)}
        title={`Delete coupon ${deleteFor?.code ?? ""}?`}
        description="This removes the code permanently. Past orders that used it are unaffected."
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          if (deleteFor) await remove.mutateAsync(deleteFor.id);
        }}
      />
    </div>
  );
}
