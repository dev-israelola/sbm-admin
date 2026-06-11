import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { useMovements } from "@/features/products/useProducts";
import { MOVEMENT_LABEL, type InventoryMovement } from "@/types/inventory";
import { formatDateTime } from "@/lib/format";

const VARIANT: Record<InventoryMovement["type"], any> = {
  "stock-added": "success",
  "stock-reserved": "info",
  "reservation-released": "neutral",
  "stock-sold": "soft",
  "stock-returned": "warn",
  "stock-damaged": "danger",
  "stock-adjusted": "neutral",
};

export function InventoryMovementsScreen({ rolePath }: { rolePath: string }) {
  const { data, isLoading } = useMovements();

  const columns: DataTableColumn<InventoryMovement>[] = [
    {
      key: "type",
      header: "Movement",
      render: (m) => <Badge variant={VARIANT[m.type]}>{MOVEMENT_LABEL[m.type]}</Badge>,
    },
    { key: "product", header: "Product", render: (m) => <span className="data-cell">{m.productName} <span className="text-ink-muted">({m.sku})</span></span> },
    { key: "qty", header: "Qty", align: "right", render: (m) => <span className={`tabular-nums ${m.quantity < 0 ? "text-danger" : "text-ink"}`}>{m.quantity > 0 ? "+" : ""}{m.quantity}</span> },
    { key: "reason", header: "Reason", render: (m) => <span className="data-muted">{m.reason ?? "—"}</span> },
    { key: "ref", header: "Reference", render: (m) => <span className="data-muted">{m.orderNumber ?? "—"}</span> },
    { key: "by", header: "By", render: (m) => <span className="data-muted">{m.by}</span> },
    { key: "at", header: "When", align: "right", render: (m) => <span className="data-muted">{formatDateTime(m.at)}</span> },
  ];

  return (
    <div>
      <Link to={`${rolePath}/inventory`} className="inline-flex items-center gap-1 text-[12px] text-ink-muted hover:text-ink">
        <ChevronLeft className="h-3.5 w-3.5" /> Inventory
      </Link>
      <div className="mt-2">
        <PageHeader title="Movement log" description="Every change to inventory, in order." eyebrow="Catalog" />
        <DataTable rows={data} columns={columns} loading={isLoading} rowKey={(m) => m.id} dense />
      </div>
    </div>
  );
}
