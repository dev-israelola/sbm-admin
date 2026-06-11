import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Plus } from "lucide-react";
import { FilterBar } from "@/components/ui/filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoneyDisplay } from "@/components/ui/money";
import { useProducts } from "@/features/products/useProducts";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PRODUCT_CATEGORIES_BY_PLATFORM, PRODUCT_CATEGORY_LABEL, type Product } from "@/types/product";
import { PLATFORM_CONFIG } from "@/types/platform";
import { formatDate } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";

export function ProductsScreen({ rolePath }: { rolePath: string }) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const platform = PLATFORM_CONFIG[activePlatform];
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const categoryOptions = PRODUCT_CATEGORIES_BY_PLATFORM[activePlatform];
  const { data, isLoading } = useProducts({
    q,
    category: category === "all" ? undefined : category,
    status: status === "all" ? undefined : status,
  });

  const columns: DataTableColumn<Product>[] = useMemo(
    () => [
      {
        key: "img",
        header: "",
        width: "48px",
        render: (p) => (
          <img src={p.images[0]} alt="" className="h-9 w-9 rounded-md object-cover bg-surface-muted" loading="lazy" />
        ),
      },
      {
        key: "name",
        header: "Product",
        render: (p) => (
          <div>
            <Link to={`${rolePath}/products/${p.id}/edit`} className="text-[13px] font-medium text-ink hover:text-accent">
              {p.name}
            </Link>
            <p className="data-muted">{p.brand} · {PRODUCT_CATEGORY_LABEL[p.category]}</p>
          </div>
        ),
      },
      { key: "sku", header: "SKU", render: (p) => <span className="font-mono text-[11px] text-ink-muted">{p.sku}</span> },
      { key: "retail", header: "Price", align: "right", render: (p) => <MoneyDisplay value={p.retailPrice} /> },
      { key: "stock", header: "Available", align: "right", render: (p) => <span className="tabular-nums">{p.availableStock}</span> },
      {
        key: "status",
        header: "Status",
        render: (p) => (
          <Badge variant={p.status === "active" ? "success" : p.status === "draft" ? "warn" : "neutral"}>
            {p.status}
          </Badge>
        ),
      },
      { key: "date", header: "Added", align: "right", render: (p) => <span className="data-muted">{formatDate(p.createdAt)}</span> },
    ],
    [rolePath],
  );

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        description={`Manage what appears on the ${platform.storefrontLabel} storefront and at what price.`}
        actions={
          <Button asChild size="sm">
            <Link to={`${rolePath}/products/new`}><Plus className="h-3.5 w-3.5" /> New product</Link>
          </Button>
        }
      />

      <FilterBar searchValue={q} onSearchChange={setQ} searchPlaceholder="Search name or SKU…" className="mb-4">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-44 h-9 text-[12px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categoryOptions.map((c) => (
              <SelectItem key={c} value={c}>{PRODUCT_CATEGORY_LABEL[c]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-36 h-9 text-[12px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      <p className="text-[12px] text-ink-muted mb-3">
        {data ? `${data.total} product${data.total === 1 ? "" : "s"}` : "Loading…"}
      </p>

      <DataTable
        rows={data?.items}
        columns={columns}
        loading={isLoading}
        rowKey={(p) => p.id}
        dense
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <Package className="h-5 w-5 text-ink-muted" />
            <span>No products match these filters.</span>
          </div>
        }
      />
    </div>
  );
}
