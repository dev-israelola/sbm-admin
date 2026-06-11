import type { ReconciliationRecord, ReconciliationStatus } from "@/types/accounting";
import { MOCK_ORDERS } from "./mock-orders";

const STATUS_FOR: (i: number) => ReconciliationStatus = (i) => {
  if (i % 9 === 0) return "discrepancy";
  if (i % 5 === 0) return "pending-review";
  if (i % 2 === 0) return "reconciled";
  return "unreconciled";
};

export const MOCK_RECONCILIATION: ReconciliationRecord[] = MOCK_ORDERS
  .filter((o) => o.paymentMethod === "pod" && o.podCollection)
  .map((o, i) => {
    const status = STATUS_FOR(i);
    const difference = status === "discrepancy" ? -(1000 + (i % 5) * 500) : 0;
    return {
      id: `recon_${o.id}`,
      orderId: o.id,
      orderNumber: o.number,
      customerName: o.customerName,
      amountExpected: o.total,
      amountCollected: o.total + difference,
      difference,
      collectionMethod: o.podCollection!.method,
      collectedBy: o.podCollection!.collectedBy,
      collectedAt: o.podCollection!.collectedAt,
      status,
      reconciledBy: status === "reconciled" ? "Nneka Eze" : undefined,
      reconciledAt: status === "reconciled" ? new Date(Date.parse(o.podCollection!.collectedAt) + 24 * 60 * 60 * 1000).toISOString() : undefined,
      note:
        status === "discrepancy"
          ? "Short by recorded amount — flagged for follow-up with rider."
          : undefined,
    };
  });
