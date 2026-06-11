import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, MapPin } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { FilterBar } from "@/components/ui/filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoneyDisplay } from "@/components/ui/money";
import { useAuthStore } from "@/store/auth-store";
import { usePickupHandoffs, useMarkPickupCollected, usePickupStations } from "@/features/pickup/usePickup";
import { formatDate } from "@/lib/format";
import type { PickupHandoff } from "@/types/delivery";

const STATUS_LABEL: Record<PickupHandoff["status"], string> = {
  "awaiting-arrival": "Awaiting station arrival",
  "ready-for-pickup": "Ready for pickup",
  "picked-up": "Picked up",
  expired: "Expired",
};

const STATUS_VARIANT: Record<PickupHandoff["status"], "warn" | "success" | "neutral" | "danger"> = {
  "awaiting-arrival": "warn",
  "ready-for-pickup": "success",
  "picked-up": "neutral",
  expired: "danger",
};

export function PickupHandoffsScreen({
  rolePath,
  embedded = false,
}: {
  rolePath: string;
  embedded?: boolean;
}) {
  const user = useAuthStore((s) => s.user);
  const [stationId, setStationId] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const { data: stations } = usePickupStations();
  const { data, isLoading } = usePickupHandoffs({
    status: status === "all" ? undefined : status,
    stationId: stationId === "all" ? undefined : stationId,
  });
  const collect = useMarkPickupCollected();

  const columns: DataTableColumn<PickupHandoff>[] = useMemo(
    () => [
      {
        key: "order",
        header: "Order",
        render: (h) => (
          <div>
            <Link to={`${rolePath}/orders/${h.orderId}`} className="text-[13px] font-medium text-ink hover:text-accent">
              {h.orderNumber}
            </Link>
            <p className="text-[11px] text-ink-muted">Code - {h.pickupCode}</p>
          </div>
        ),
      },
      {
        key: "customer",
        header: "Customer",
        render: (h) => (
          <div>
            <p className="data-cell">{h.customerName}</p>
            <p className="data-muted">{h.customerPhone}</p>
          </div>
        ),
      },
      {
        key: "station",
        header: "Station",
        render: (h) => (
          <div>
            <p className="data-cell">{h.stationName}</p>
            <p className="data-muted">{h.stationCity}, {h.stationState}</p>
          </div>
        ),
      },
      {
        key: "payment",
        header: "Payment",
        render: (h) => (
          <div className="flex flex-col gap-1">
            <Badge variant={h.paymentMethod === "paystack" ? "info" : "warn"}>
              {h.paymentMethod === "paystack" ? "Paystack" : "POD"}
            </Badge>
            {h.amountToCollect > 0 && <MoneyDisplay value={h.amountToCollect} className="text-[12px]" />}
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (h) => <Badge variant={STATUS_VARIANT[h.status]}>{STATUS_LABEL[h.status]}</Badge>,
      },
      {
        key: "updated",
        header: "Updated",
        align: "right",
        render: (h) => <span className="data-muted">{formatDate(h.updatedAt)}</span>,
      },
      {
        key: "action",
        header: "",
        align: "right",
        render: (h) =>
          h.status === "ready-for-pickup" ? (
            <Button
              size="xs"
              onClick={() =>
                collect.mutate(
                  { id: h.id, by: user?.fullName ?? "Station staff" },
                  { onSuccess: () => toast.success(`${h.orderNumber} marked picked up`) },
                )
              }
              disabled={collect.isPending}
            >
              <Check className="h-3 w-3" /> Mark picked up
            </Button>
          ) : null,
      },
    ],
    [rolePath, collect, user?.fullName],
  );

  return (
    <div>
      {!embedded && (
        <PageHeader
          eyebrow="Operations"
          title="Pickup handoffs"
          description="Orders held at a pickup station awaiting customer collection."
        />
      )}

      <FilterBar searchValue="" onSearchChange={() => {}} searchPlaceholder="" className="mb-4">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-9 w-full text-[12px] sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="awaiting-arrival">Awaiting arrival</SelectItem>
            <SelectItem value="ready-for-pickup">Ready for pickup</SelectItem>
            <SelectItem value="picked-up">Picked up</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Select value={stationId} onValueChange={setStationId}>
          <SelectTrigger className="h-9 w-full text-[12px] sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stations</SelectItem>
            {stations?.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterBar>

      <DataTable
        rows={data}
        columns={columns}
        loading={isLoading}
        rowKey={(h) => h.id}
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <MapPin className="h-5 w-5 text-ink-muted" />
            <span>No pickup handoffs match the filters.</span>
          </div>
        }
      />
    </div>
  );
}
