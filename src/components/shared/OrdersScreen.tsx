import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { FilterBar } from "@/components/ui/filter-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/orders/status-badges";
import { MoneyDisplay } from "@/components/ui/money";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/features/orders/useOrders";
import { PaginationFooter } from "@/components/ui/pagination-footer";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { formatDate } from "@/lib/format";
import { ORDER_STATUS_OPTIONS } from "@/lib/constants";
import type { AdminOrder } from "@/types/order";

interface OrdersScreenProps {
  rolePath: string;
  defaultStatus?: string;
  title?: string;
  description?: string;
  eyebrow?: string;
  allowedStatuses?: readonly string[];
}

export function OrdersScreen({
  rolePath,
  defaultStatus,
  title = "Orders",
  description = "Search, verify, fulfil and reconcile every order.",
  eyebrow = "Operations",
  allowedStatuses = ORDER_STATUS_OPTIONS,
}: OrdersScreenProps) {
  const [params] = useSearchParams();
  const urlStatus = params.get("status");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>(urlStatus ?? defaultStatus ?? "all");
  const [paymentMethod, setPaymentMethod] = useState<string>("all");
  const [deliveryMethod, setDeliveryMethod] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useOrders({
    q,
    status: status === "all" ? undefined : status,
    paymentMethod: paymentMethod === "all" ? undefined : paymentMethod,
    deliveryMethod: deliveryMethod === "all" ? undefined : deliveryMethod,
    page,
    limit: DEFAULT_PAGE_SIZE,
  });

  useEffect(() => {
    setPage(1);
  }, [q, status, paymentMethod, deliveryMethod]);

  const columns: DataTableColumn<AdminOrder>[] = useMemo(
    () => [
      {
        key: "number",
        header: "Order",
        render: (o) => (
          <div>
            <Link to={`${rolePath}/orders/${o.id}`} className="text-[13px] font-medium text-ink hover:text-accent">
              {o.number}
            </Link>
            <p className="text-[11px] text-ink-muted">{o.deliveryMethod === "pickup" ? "Pickup" : "Home delivery"} · {o.items.length} item{o.items.length === 1 ? "" : "s"}</p>
          </div>
        ),
      },
      {
        key: "customer",
        header: "Customer",
        render: (o) => (
          <div>
            <p className="data-cell">{o.customerName}</p>
            <p className="data-muted">{o.customerEmail}</p>
          </div>
        ),
      },
      {
        key: "payment",
        header: "Payment",
        render: (o) => (
          <div className="flex flex-col gap-1">
            <Badge variant={o.paymentMethod === "paystack" ? "info" : "warn"}>
              {o.paymentMethod === "paystack" ? "Paystack" : "POD"}
            </Badge>
            <PaymentStatusBadge status={o.paymentStatus} />
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (o) => <OrderStatusBadge status={o.status} />,
      },
      {
        key: "total",
        header: "Total",
        align: "right",
        render: (o) => <MoneyDisplay value={o.total} className="font-medium" />,
      },
      {
        key: "date",
        header: "Date",
        align: "right",
        render: (o) => <span className="data-muted">{formatDate(o.createdAt)}</span>,
      },
    ],
    [rolePath],
  );

  const statusOptions = allowedStatuses;

  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <FilterBar
        searchValue={q}
        onSearchChange={setQ}
        searchPlaceholder="Search order number or customer…"
        className="mb-4"
      >
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44 h-9 text-[12px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>{s.replace(/-/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger className="w-36 h-9 text-[12px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payments</SelectItem>
            <SelectItem value="paystack">Paystack</SelectItem>
            <SelectItem value="pod">Payment on delivery</SelectItem>
          </SelectContent>
        </Select>
        <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
          <SelectTrigger className="w-36 h-9 text-[12px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Home + pickup</SelectItem>
            <SelectItem value="home">Home delivery</SelectItem>
            <SelectItem value="pickup">Pickup station</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      <p className="text-[12px] text-ink-muted mb-3">
        {data ? `${data.total} order${data.total === 1 ? "" : "s"}` : "Loading…"}
      </p>

      <DataTable
        rows={data?.items}
        columns={columns}
        loading={isLoading}
        rowKey={(o) => o.id}
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <ShoppingBag className="h-5 w-5 text-ink-muted" />
            <span>No orders match these filters.</span>
          </div>
        }
      />
      <PaginationFooter meta={data?.meta} page={page} loading={isLoading} itemLabel="orders" onPageChange={setPage} />
    </div>
  );
}
