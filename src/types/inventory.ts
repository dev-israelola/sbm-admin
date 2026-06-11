export type InventoryMovementType =
  | "stock-added"
  | "stock-reserved"
  | "reservation-released"
  | "stock-sold"
  | "stock-returned"
  | "stock-damaged"
  | "stock-adjusted";

export const MOVEMENT_LABEL: Record<InventoryMovementType, string> = {
  "stock-added": "Stock added",
  "stock-reserved": "Reserved",
  "reservation-released": "Reservation released",
  "stock-sold": "Sold",
  "stock-returned": "Returned",
  "stock-damaged": "Damaged",
  "stock-adjusted": "Adjusted",
};

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: InventoryMovementType;
  quantity: number;
  reason?: string;
  orderNumber?: string;
  by: string;
  at: string;
}
