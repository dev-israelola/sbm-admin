import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Truck } from "lucide-react";
import { FilterBar } from "@/components/ui/filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { MoneyDisplay } from "@/components/ui/money";
import { Badge } from "@/components/ui/badge";
import { DeliveryStatusBadge, CollectionStatusBadge } from "@/components/delivery/status-badge";
import { useDeliveries } from "@/features/delivery/useDeliveries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/format";
import type { DeliveryAssignment } from "@/types/delivery";

export function DeliveryScreen({
  rolePath,
  assigneeId,
  title = "Delivery",
  description = "Assign and track delivery across internal riders and third-party logistics.",
  embedded = false,
}: {
  rolePath: string;
  assigneeId?: string;
  title?: string;
  description?: string;
  embedded?: boolean;
}) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const { data, isLoading } = useDeliveries({
    assigneeId,
    status: status === "all" ? undefined : status,
  });

  const filtered = useMemo(() => {
    if (!data) return undefined;
    const search = q.toLowerCase();
    return data.filter((d) =>
      !search || `${d.orderNumber} ${d.customerName} ${d.city}`.toLowerCase().includes(search),
    );
  }, [data, q]);

  const columns: DataTableColumn<DeliveryAssignment>[] = [
    {
      key: "order",
      header: "Order",
      render: (d) => (
        <div>
          <Link to={`${rolePath}/delivery/${d.id}`} className="text-[13px] font-medium text-ink hover:text-accent">
            {d.orderNumber}
          </Link>
          <p className="data-muted">{d.customerName}</p>
        </div>
      ),
    },
    {
      key: "loc",
      header: "Destination",
      render: (d) => <span className="data-cell">{d.city}, {d.state}</span>,
    },
    {
      key: "type",
      header: "Type",
      render: (d) => (
        <div className="flex flex-col gap-1">
          <Badge variant={d.type === "internal" ? "soft" : "info"}>
            {d.type === "internal" ? "Internal rider" : d.provider ?? "3PL"}
          </Badge>
          {d.trackingNumber && <span className="font-mono text-[10px] text-ink-muted">{d.trackingNumber}</span>}
        </div>
      ),
    },
    {
      key: "assignee",
      header: "Assignee",
      render: (d) => <span className="data-cell">{d.assigneeName ?? "-"}</span>,
    },
    { key: "status", header: "Status", render: (d) => <DeliveryStatusBadge status={d.status} /> },
    {
      key: "pay",
      header: "Pay",
      render: (d) => (
        <div className="flex flex-col gap-1">
          <Badge variant={d.paymentMethod === "paystack" ? "info" : "warn"}>
            {d.paymentMethod === "paystack" ? "Paystack" : "POD"}
          </Badge>
          <CollectionStatusBadge status={d.collectionStatus} />
        </div>
      ),
    },
    {
      key: "amt",
      header: "Amount to collect",
      align: "right",
      render: (d) => <MoneyDisplay value={d.amountToCollect} />,
    },
    {
      key: "date",
      header: "Scheduled",
      align: "right",
      render: (d) => <span className="data-muted">{formatDate(d.scheduledFor)}</span>,
    },
  ];

  return (
    <div>
      {!embedded && <PageHeader eyebrow="Operations" title={title} description={description} />}
      <FilterBar
        searchValue={q}
        onSearchChange={setQ}
        searchPlaceholder="Search order or destination..."
        className="mb-4"
      >
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-9 w-full text-[12px] sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending-assignment">Pending assignment</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="picked-up">Picked up</SelectItem>
            <SelectItem value="in-transit">In transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed-delivery">Failed</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>
      <DataTable
        rows={filtered}
        columns={columns}
        loading={isLoading}
        rowKey={(d) => d.id}
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <Truck className="h-5 w-5 text-ink-muted" />
            <span>No deliveries match these filters.</span>
          </div>
        }
      />
    </div>
  );
}
