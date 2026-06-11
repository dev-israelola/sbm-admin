import { QueryClient } from "@tanstack/react-query";
import type { Platform } from "@/types/platform";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: { retry: 0 },
  },
});

export const qk = {
  summary: (platform: Platform) => ["admin-summary", platform] as const,
  orders: (platform: Platform, params?: unknown) => ["orders", platform, params ?? {}] as const,
  order: (platform: Platform, id: string) => ["order", platform, id] as const,
  products: (platform: Platform, params?: unknown) => ["products", platform, params ?? {}] as const,
  product: (platform: Platform, id: string) => ["product", platform, id] as const,
  inventory: (platform: Platform) => ["inventory", platform] as const,
  movements: (platform: Platform) => ["inventory-movements", platform] as const,
  customers: (platform: Platform) => ["customers", platform] as const,
  customer: (platform: Platform, id: string) => ["customer", platform, id] as const,
  refunds: (platform: Platform) => ["refunds", platform] as const,
  refund: (platform: Platform, id: string) => ["refund", platform, id] as const,
  consultations: (platform: Platform) => ["consultations", platform] as const,
  consultation: (platform: Platform, id: string) => ["consultation", platform, id] as const,
  recommendation: (platform: Platform, id: string) => ["recommendation", platform, id] as const,
  deliveries: (platform: Platform, params?: unknown) => ["deliveries", platform, params ?? {}] as const,
  delivery: (platform: Platform, id: string) => ["delivery", platform, id] as const,
  pickupHandoffs: (platform: Platform, params?: unknown) => ["pickup-handoffs", platform, params ?? {}] as const,
  pickupStations: (platform: Platform) => ["pickup-stations", platform] as const,
  deliveryOptions: (platform: Platform) => ["delivery-options", platform] as const,
  accountingSummary: (platform: Platform) => ["accounting-summary", platform] as const,
  sales: (platform: Platform) => ["sales", platform] as const,
  expenses: (platform: Platform) => ["expenses", platform] as const,
  reconciliation: (platform: Platform) => ["reconciliation", platform] as const,
  rewards: (platform: Platform) => ["rewards", platform] as const,
  customerRewards: (platform: Platform, id: string) => ["rewards", platform, id] as const,
  reports: (platform: Platform, type?: string) => ["reports", platform, type ?? "all"] as const,
  users: (platform: Platform) => ["users", platform] as const,
};
