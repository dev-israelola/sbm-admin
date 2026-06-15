import { useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, Warehouse } from "lucide-react";
import { FilterBar } from "@/components/ui/filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { InventoryStatusBadge } from "@/components/inventory/status-badge";
import { Button } from "@/components/ui/button";
import { InventoryAdjustDialog } from "@/components/inventory/InventoryAdjustDialog";
import { useInventory } from "@/features/products/useProducts";
import { PaginationFooter } from "@/components/ui/pagination-footer";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { PRODUCT_CATEGORY_LABEL } from "@/types/product";
import type { Product } from "@/types/product";

export function InventoryScreen({ rolePath }: { rolePath: string }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useInventory({ q, page, limit: DEFAULT_PAGE_SIZE });
  const [adjustFor, setAdjustFor] = useState<Product | null>(null);

  const columns: DataTableColumn<Product>[] = [
    {
      key: "product",
      header: "Product",
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-line bg-surface-muted">
            {p.images?.[0] ? (
              <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="grid h-full w-full place-items-center text-ink-muted">
                <Boxes className="h-4 w-4" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <Link to={`${rolePath}/products/${p.id}/edit`} className="text-[13px] font-medium text-ink hover:text-accent">
              {p.name}
            </Link>
            <p className="data-muted">SKU {p.sku} · {PRODUCT_CATEGORY_LABEL[p.category] ?? p.category}</p>
          </div>
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
      <FilterBar
        searchValue={q}
        onSearchChange={(value) => {
          setQ(value);
          setPage(1);
        }}
        searchPlaceholder="Search product or SKU…"
        className="mb-4"
      />
      <DataTable
        rows={data?.items}
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
      <PaginationFooter
        meta={data?.meta}
        page={page}
        loading={isLoading}
        itemLabel="inventory items"
        onPageChange={setPage}
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
