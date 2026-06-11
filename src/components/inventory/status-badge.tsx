import { Badge } from "@/components/ui/badge";
import { inventoryStatus, type Product } from "@/types/product";

export function InventoryStatusBadge({ product }: { product: Pick<Product, "availableStock" | "lowStockThreshold"> }) {
  const s = inventoryStatus(product);
  if (s === "out-of-stock") return <Badge variant="danger">Out of stock</Badge>;
  if (s === "low-stock") return <Badge variant="warn">Low stock</Badge>;
  return <Badge variant="success">In stock</Badge>;
}
