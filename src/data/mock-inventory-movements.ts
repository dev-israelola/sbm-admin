import type { InventoryMovement, InventoryMovementType } from "@/types/inventory";
import { MOCK_PRODUCTS } from "./mock-products";

const TYPES: InventoryMovementType[] = [
  "stock-added",
  "stock-reserved",
  "reservation-released",
  "stock-sold",
  "stock-returned",
  "stock-damaged",
  "stock-adjusted",
];

const reasons: Record<InventoryMovementType, string> = {
  "stock-added": "Restock batch received from supplier.",
  "stock-reserved": "Order placed by customer.",
  "reservation-released": "Order cancelled.",
  "stock-sold": "Order completed.",
  "stock-returned": "Customer return — verified good.",
  "stock-damaged": "Damaged in transit / storage.",
  "stock-adjusted": "Stocktake adjustment.",
};

export const MOCK_INVENTORY_MOVEMENTS: InventoryMovement[] = Array.from({ length: 40 }).map((_, i) => {
  const product = MOCK_PRODUCTS[i % MOCK_PRODUCTS.length];
  const type = TYPES[i % TYPES.length];
  return {
    id: `mov_${String(i + 1).padStart(3, "0")}`,
    productId: product.id,
    productName: product.name,
    sku: product.sku,
    type,
    quantity:
      type === "stock-added"
        ? 24 + (i % 36)
        : type === "stock-reserved"
          ? 1 + (i % 4)
          : type === "stock-sold"
            ? 1 + (i % 3)
            : type === "stock-damaged"
              ? 1 + (i % 2)
              : type === "stock-adjusted"
                ? (i % 2 === 0 ? -2 : 4)
                : 1 + (i % 3),
    reason: reasons[type],
    orderNumber: ["stock-reserved", "stock-sold", "reservation-released", "stock-returned"].includes(type)
      ? `HRB-${1000 + (i % 80)}`
      : undefined,
    by:
      type === "stock-added"
        ? "Adaeze Okafor"
        : type === "stock-adjusted"
          ? "Tope Bamidele"
          : type === "stock-damaged"
            ? "Musa Ibrahim"
            : "system",
    at: new Date(Date.now() - (i + 1) * 6 * 60 * 60 * 1000).toISOString(),
  };
});
