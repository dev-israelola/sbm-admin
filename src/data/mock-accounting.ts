import type { SalesRecord, AccountingSummary } from "@/types/accounting";
import { MOCK_ORDERS } from "./mock-orders";

export const MOCK_SALES_RECORDS: SalesRecord[] = MOCK_ORDERS
  .filter((o) => !["cancelled", "pending-verification", "pending-payment"].includes(o.status))
  .map((o, i) => {
    const isPaid = o.paymentStatus === "paid" || o.paymentStatus === "partially-refunded" || o.paymentStatus === "refunded";
    return {
      id: `sale_${o.id}`,
      orderId: o.id,
      orderNumber: o.number,
      customerName: o.customerName,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus === "failed" ? "pending" : o.paymentStatus,
      orderStatus: o.status,
      grossAmount: o.subtotal,
      discount: o.discount,
      netAmount: o.subtotal - o.discount,
      costOfGoods: o.costOfGoods,
      gatewayFee: o.paystackPayment?.gatewayFee ?? 0,
      deliveryFeeCharged: o.deliveryFee,
      deliveryFeeActual: Math.round(o.deliveryFee * 0.85),
      packagingCost: 350 + ((i % 5) * 80),
      accountingStatus:
        o.paymentMethod === "pod"
          ? o.podCollection?.status === "reconciled"
            ? "reconciled"
            : "open"
          : isPaid
            ? "reconciled"
            : "open",
      date: o.createdAt,
    };
  });

export function computeSummary(): AccountingSummary {
  const last30 = MOCK_SALES_RECORDS.filter(
    (s) => Date.now() - Date.parse(s.date) < 30 * 24 * 60 * 60 * 1000,
  );
  const grossSales = last30.reduce((acc, s) => acc + s.grossAmount, 0);
  const netSales = last30.reduce((acc, s) => acc + s.netAmount, 0);
  const discounts = last30.reduce((acc, s) => acc + s.discount, 0);
  const cogs = last30.reduce((acc, s) => acc + s.costOfGoods, 0);
  const deliveryFeesCharged = last30.reduce((acc, s) => acc + s.deliveryFeeCharged, 0);
  const deliveryFeesActual = last30.reduce((acc, s) => acc + s.deliveryFeeActual, 0);
  const packagingCosts = last30.reduce((acc, s) => acc + s.packagingCost, 0);
  const gatewayFees = last30.reduce((acc, s) => acc + s.gatewayFee, 0);
  const refunds = MOCK_ORDERS
    .filter((o) => o.status === "refunded" || o.status === "partially-refunded")
    .reduce((acc, o) => acc + o.total * (o.status === "partially-refunded" ? 0.5 : 1), 0);
  const expenses = 480000; // approximated from mock-expenses
  const cashCollected = MOCK_ORDERS
    .filter((o) => o.paymentMethod === "pod" && o.podCollection?.status === "reconciled")
    .reduce((acc, o) => acc + o.total, 0);
  const unreconciledPod = MOCK_ORDERS
    .filter((o) => o.paymentMethod === "pod" && o.podCollection && o.podCollection.status !== "reconciled")
    .reduce((acc, o) => acc + o.total, 0);
  const estimatedProfit =
    netSales - cogs - deliveryFeesActual - packagingCosts - gatewayFees - refunds - expenses;
  return {
    grossSales,
    netSales,
    discounts,
    refunds,
    cogs,
    deliveryFeesCharged,
    deliveryFeesActual,
    packagingCosts,
    gatewayFees,
    expenses,
    estimatedProfit,
    cashCollected,
    unreconciledPod,
  };
}
