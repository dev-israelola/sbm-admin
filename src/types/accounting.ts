export type ExpenseCategory =
  | "product-cost"
  | "packaging"
  | "delivery-cost"
  | "marketing"
  | "staff"
  | "platform"
  | "gateway-fee"
  | "refund-loss"
  | "damaged-loss"
  | "misc";

export const EXPENSE_CATEGORY_LABEL: Record<ExpenseCategory, string> = {
  "product-cost": "Product cost",
  packaging: "Packaging",
  "delivery-cost": "Delivery cost",
  marketing: "Marketing",
  staff: "Staff",
  platform: "Platform charges",
  "gateway-fee": "Payment gateway",
  "refund-loss": "Refund loss",
  "damaged-loss": "Damaged stock",
  misc: "Miscellaneous",
};

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  vendor?: string;
  paymentMethod: "Cash" | "Bank Transfer" | "Card" | "Paystack";
  note?: string;
  receiptFile?: string;
  recordedBy: string;
  createdAt: string;
}

export type AccountingStatus = "open" | "reconciled" | "discrepancy";

export interface SalesRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  paymentMethod: "paystack" | "pod";
  paymentStatus: "pending" | "paid" | "refunded" | "partially-refunded";
  orderStatus: string;
  grossAmount: number;
  discount: number;
  netAmount: number;
  costOfGoods: number;
  gatewayFee: number;
  deliveryFeeCharged: number;
  deliveryFeeActual: number;
  packagingCost: number;
  accountingStatus: AccountingStatus;
  date: string;
}

export type ReconciliationStatus =
  | "unreconciled"
  | "pending-review"
  | "reconciled"
  | "discrepancy";

export interface ReconciliationRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  amountExpected: number;
  amountCollected: number;
  difference: number;
  collectionMethod: "cash" | "bank-transfer" | "pos";
  collectedBy: string;
  collectedAt: string;
  status: ReconciliationStatus;
  reconciledBy?: string;
  reconciledAt?: string;
  note?: string;
}

export interface AccountingSummary {
  grossSales: number;
  netSales: number;
  discounts: number;
  refunds: number;
  cogs: number;
  deliveryFeesCharged: number;
  deliveryFeesActual: number;
  packagingCosts: number;
  gatewayFees: number;
  expenses: number;
  estimatedProfit: number;
  cashCollected: number;
  unreconciledPod: number;
}

export interface ProfitLossReport {
  currency?: string;
  grossSales: number;
  discounts: number;
  rewardDiscounts: number;
  refunds: number;
  netSales: number;
  deliveryFeesCharged: number;
  tax: number;
  cogs: number;
  gatewayFees: number;
  expensesTotal: number;
  expensesByCategory: { category: ExpenseCategory | string; amount: number }[];
  estimatedProfit: number;
}
