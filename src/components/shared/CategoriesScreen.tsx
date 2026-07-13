import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Tags, Plus, Edit, Trash2 } from "lucide-react";
import { FilterBar } from "@/components/ui/filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/features/products/useProducts";
import { useDeleteCategory } from "@/features/categories/useCategoriesAdmin";
import { PLATFORM_CONFIG } from "@/types/platform";
import { useAuthStore } from "@/store/auth-store";

export function CategoriesScreen({ rolePath }: { rolePath: string }) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const platform = PLATFORM_CONFIG[activePlatform];
  const [q, setQ] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const categories = useCategories();
  const deleteMutation = useDeleteCategory();

  const filtered = useMemo(() => {
    if (!categories.data) return [];
    if (!q) return categories.data;
    return categories.data.filter((c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.slug.toLowerCase().includes(q.toLowerCase())
    );
  }, [categories.data, q]);

  const columns: DataTableColumn<any>[] = useMemo(
    () => [
      {
        key: "img",
        header: "",
        width: "64px",
        render: (c) => (
          c.image ? (
            <img src={c.image} alt="" className="h-12 w-12 rounded-md object-cover border border-line bg-surface-muted" loading="lazy" />
          ) : (
            <div className="h-12 w-12 rounded-md border border-line bg-surface-muted flex items-center justify-center">
              <Tags className="h-4 w-4 text-ink-muted opacity-50" />
            </div>
          )
        ),
      },
      {
        key: "name",
        header: "Category",
        render: (c) => (
          <div>
            <Link to={`${rolePath}/categories/${c.slug}/edit`} className="text-[13px] font-medium text-ink hover:text-accent">
              {c.name}
            </Link>
            <p className="font-mono text-[11px] text-ink-muted">/{c.slug}</p>
          </div>
        ),
      },
      {
        key: "products",
        header: "Products",
        align: "right",
        render: (c) => (
          <span className="tabular-nums font-medium text-[13px]">{c.productCount ?? 0}</span>
        ),
      },
      {
        key: "actions",
        header: "",
        align: "right",
        render: (c) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 text-ink-muted hover:text-ink">
              <Link to={`${rolePath}/categories/${c.slug}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-ink-muted hover:text-red-500"
              onClick={() => setDeleteTarget(c)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [rolePath, deleteMutation]
  );

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Categories"
        description={`Manage category structures spanning the ${platform.storefrontLabel} storefront.`}
        actions={
          <Button asChild size="sm">
            <Link to={`${rolePath}/categories/new`}><Plus className="h-3.5 w-3.5" /> New category</Link>
          </Button>
        }
      />

      <FilterBar searchValue={q} onSearchChange={setQ} searchPlaceholder="Search categories..." className="mb-4" />

      <p className="text-[12px] text-ink-muted mb-3">
        {filtered ? `${filtered.length} categor${filtered.length === 1 ? "y" : "ies"}` : "Loading..."}
      </p>

      <DataTable
        rows={filtered}
        columns={columns}
        loading={categories.isLoading}
        rowKey={(c) => c.id}
        dense
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <Tags className="h-5 w-5 text-ink-muted" />
            <span>No categories match these filters.</span>
          </div>
        }
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={deleteTarget ? `Delete ${deleteTarget.name}?` : "Delete Category"}
        description="This action cannot be undone. This will NOT delete any products associated with this category."
        confirmLabel="Delete Category"
        destructive
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteMutation.mutateAsync(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
