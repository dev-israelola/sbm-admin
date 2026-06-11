import type { Expense, ExpenseCategory } from "@/types/accounting";

interface Seed {
  title: string;
  category: ExpenseCategory;
  amount: number;
  daysAgo: number;
  vendor?: string;
  method?: Expense["paymentMethod"];
  note?: string;
}

const seeds: Seed[] = [
  { title: "Bulk turmeric extract", category: "product-cost", amount: 180000, daysAgo: 2, vendor: "BotanicalSource Ltd", method: "Bank Transfer" },
  { title: "Glass amber bottles 100ml", category: "packaging", amount: 64000, daysAgo: 3, vendor: "Lagos Packaging Co.", method: "Bank Transfer" },
  { title: "Internal rider weekly stipend", category: "delivery-cost", amount: 32000, daysAgo: 5, vendor: "Musa Ibrahim", method: "Bank Transfer" },
  { title: "Internal rider weekly stipend", category: "delivery-cost", amount: 32000, daysAgo: 12, vendor: "Musa Ibrahim", method: "Bank Transfer" },
  { title: "GIG logistics invoice — May wk2", category: "delivery-cost", amount: 41500, daysAgo: 7, vendor: "GIG Logistics", method: "Bank Transfer" },
  { title: "Instagram ad campaign", category: "marketing", amount: 85000, daysAgo: 9, vendor: "Meta", method: "Card" },
  { title: "Influencer partnership — Adaeze K.", category: "marketing", amount: 120000, daysAgo: 14, vendor: "Adaeze K.", method: "Bank Transfer" },
  { title: "Studio rent — May", category: "platform", amount: 220000, daysAgo: 12, vendor: "Lekki Studio Hub", method: "Bank Transfer" },
  { title: "Paystack gateway fees — April", category: "gateway-fee", amount: 38400, daysAgo: 8, vendor: "Paystack", method: "Card" },
  { title: "Damaged inventory writeoff", category: "damaged-loss", amount: 14500, daysAgo: 6, note: "Sun salve batch — 3 broken on transit." },
  { title: "Refund: HRB-1098 (Calendula Cleanser)", category: "refund-loss", amount: 9800, daysAgo: 5, vendor: "Customer", method: "Paystack", note: "Approved refund." },
  { title: "Lab third-party potency tests", category: "platform", amount: 75000, daysAgo: 17, vendor: "AgriLabs NG", method: "Bank Transfer" },
  { title: "Staff salaries — May (consultant)", category: "staff", amount: 240000, daysAgo: 1, vendor: "Ifeoma Nweke", method: "Bank Transfer" },
  { title: "Staff salaries — May (manager)", category: "staff", amount: 320000, daysAgo: 1, vendor: "Tope Bamidele", method: "Bank Transfer" },
  { title: "Bulk shea butter", category: "product-cost", amount: 95000, daysAgo: 10, vendor: "Olulami Farms", method: "Bank Transfer" },
  { title: "Bulk hibiscus flowers", category: "product-cost", amount: 42000, daysAgo: 11, vendor: "Northern Co-op", method: "Cash" },
  { title: "Cardboard mailers", category: "packaging", amount: 23000, daysAgo: 16, vendor: "PackHub", method: "Bank Transfer" },
  { title: "Tissue paper and stickers", category: "packaging", amount: 14500, daysAgo: 17, vendor: "PackHub", method: "Card" },
  { title: "Domain renewal", category: "platform", amount: 6500, daysAgo: 20, vendor: "Namecheap", method: "Card" },
  { title: "Email marketing platform", category: "marketing", amount: 18000, daysAgo: 22, vendor: "ConvertKit", method: "Card" },
  { title: "Bulk amla oil", category: "product-cost", amount: 64000, daysAgo: 24, vendor: "Kuru Apothecary", method: "Bank Transfer" },
  { title: "Refund: HRB-1085 (Body butter)", category: "refund-loss", amount: 9500, daysAgo: 19, vendor: "Customer", method: "Paystack" },
  { title: "Office utilities — May", category: "platform", amount: 28000, daysAgo: 4, method: "Bank Transfer" },
  { title: "Photography session — new arrivals", category: "marketing", amount: 95000, daysAgo: 26, vendor: "Yemi Photographs", method: "Bank Transfer" },
  { title: "Damaged inventory writeoff", category: "damaged-loss", amount: 8200, daysAgo: 21, note: "Calendula cleansers leaked in storage." },
  { title: "Misc supplies", category: "misc", amount: 6800, daysAgo: 13, vendor: "Konga", method: "Card" },
  { title: "Lawyer consultation — supplier contract", category: "platform", amount: 65000, daysAgo: 28, vendor: "Bola & Co.", method: "Bank Transfer" },
  { title: "Refund: HRB-0998", category: "refund-loss", amount: 9800, daysAgo: 23, vendor: "Customer", method: "Paystack", note: "Damaged on arrival." },
  { title: "Bulk peppermint and fennel", category: "product-cost", amount: 38000, daysAgo: 27, vendor: "Northern Co-op", method: "Cash" },
  { title: "Hosting + analytics", category: "platform", amount: 15500, daysAgo: 30, vendor: "Vercel", method: "Card" },
];

export const MOCK_EXPENSES: Expense[] = seeds.map((s, i) => ({
  id: `exp_${String(i + 1).padStart(3, "0")}`,
  title: s.title,
  category: s.category,
  amount: s.amount,
  date: new Date(Date.now() - s.daysAgo * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  vendor: s.vendor,
  paymentMethod: s.method ?? "Bank Transfer",
  note: s.note,
  receiptFile: i % 4 === 0 ? `receipt_${i}.pdf` : undefined,
  recordedBy: "Nneka Eze",
  createdAt: new Date(Date.now() - s.daysAgo * 24 * 60 * 60 * 1000).toISOString(),
}));
