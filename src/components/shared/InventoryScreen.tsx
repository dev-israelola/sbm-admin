import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, Warehouse } from "lucide-react";
import { FilterBar } from "@/components/ui/filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { InventoryStatusBadge } from "@/components/inventory/status-badge";
import { Button } from "@/components/ui/button";
import { InventoryAdjustDialog } from "@/components/inventory/InventoryAdjustDialog";
import { useInventory } from "@/features/products/useProducts";
import { PRODUCT_CATEGORY_LABEL } from "@/types/product";
import type { Product } from "@/types/product";

export function InventoryScreen({ rolePath }: { rolePath: string }) {
  const { data, isLoading } = useInventory();
  const [q, setQ] = useState("");
  const [adjustFor, setAdjustFor] = useState<Product | null>(null);

  const rows = useMemo(() => {
    if (!data) return undefined;
    const search = q.toLowerCase();
    return data.filter((p) => !search || `${p.name} ${p.sku}`.toLowerCase().includes(search));
  }, [data, q]);

  const columns: DataTableColumn<Product>[] = [
    {
      key: "product",
      header: "Product",
      render: (p) => (
        <div>
          <Link to={`${rolePath}/products/${p.id}/edit`} className="text-[13px] font-medium text-ink hover:text-accent">
            {p.name}
          </Link>
          <p className="data-muted">SKU {p.sku} · {PRODUCT_CATEGORY_LABEL[p.category]}</p>
        </div>
      ),
    },
    { key: "avail", header: "Available", align: "right", render: (p) => <span className="data-cell tabular-nums">{p.availableStock}</span> },
    { key: "res", header: "Reserved", align: "right", render: (p) => <span className="data-cell tabular-nums text-ink-muted">{p.reservedStock}</span> },
    { key: "sold", header: "Sold", align: "right", render: (p) => <span className="data-cell tabular-nums text-ink-muted">{p.soldStock}</span> },
    { key: "dmg", header: "Damaged", align: "right", render: (p) => <span className="data-cell tabular-nums text-ink-muted">{p.damagedStock}</span> },
    { key: "thr", header: "Threshold", align: "right", render: (p) => <span className="data-muted tabular-nums">{p.lowStockThreshold}</span> },
    { key: "status", header: "Status", render: (p) => <InventoryStatusBadge product={p} /> },
    {
      key: "act",
      header: "",
      align: "right",
      render: (p) => (
        <Button size="xs" variant="outline" onClick={() => setAdjustFor(p)}>Adjust</Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Inventory"
        description="Available stock, reservations, and movements across all SKUs."
        actions={
          <Button asChild size="sm" variant="outline">
            <Link to={`${rolePath}/inventory/movements`}>
              <Boxes className="h-3.5 w-3.5" /> Movement log
            </Link>
          </Button>
        }
      />
      <FilterBar searchValue={q} onSearchChange={setQ} searchPlaceholder="Search product or SKU…" className="mb-4" />
      <DataTable
        rows={rows}
        columns={columns}
        loading={isLoading}
        rowKey={(p) => p.id}
        dense
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <Warehouse className="h-5 w-5 text-ink-muted" />
            <span>No inventory yet.</span>
          </div>
        }
      />

      {adjustFor && (
        <InventoryAdjustDialog
          open={!!adjustFor}
          onOpenChange={(v) => !v && setAdjustFor(null)}
          productId={adjustFor.id}
          productName={adjustFor.name}
        />
      )}
    </div>
  );
}
