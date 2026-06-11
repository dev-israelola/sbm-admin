import type { Platform } from "./platform";

export type ProductCategory =
  | "herbal-medicare"
  | "herbal-wellness"
  | "natural-health"
  | "herbal-remedies"
  | "supplements"
  | "organic-support"
  | "traditional-medicine"
  | "gut-digestion"
  | "womens-health"
  | "mens-wellness"
  | "detox-cleanses"
  | "immunity-relief"
  | "superfoods-wellness";

export const PRODUCT_CATEGORY_LABEL: Record<ProductCategory, string> = {
  "herbal-medicare": "Herbal Medicare",
  "herbal-wellness": "Herbal wellness",
  "natural-health": "Natural health",
  "herbal-remedies": "Herbal remedies",
  supplements: "Supplements",
  "organic-support": "Organic support",
  "traditional-medicine": "Traditional medicine",
  "gut-digestion": "Gut & digestion",
  "womens-health": "Women's health",
  "mens-wellness": "Men's wellness",
  "detox-cleanses": "Detox & cleanses",
  "immunity-relief": "Immunity & relief",
  "superfoods-wellness": "Superfoods & daily wellness",
};

export const PRODUCT_CATEGORIES_BY_PLATFORM: Record<Platform, ProductCategory[]> = {
  harbs: [
    "herbal-medicare",
    "herbal-wellness",
    "natural-health",
    "herbal-remedies",
    "supplements",
    "organic-support",
    "traditional-medicine",
  ],
  holistic: [
    "gut-digestion",
    "womens-health",
    "mens-wellness",
    "detox-cleanses",
    "immunity-relief",
    "superfoods-wellness",
  ],
};

export type ProductStatus = "draft" | "active" | "archived";

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  category: ProductCategory;
  description: string;
  shortDescription: string;
  benefits: string[];
  ingredients: string[];
  howToUse: string[];
  images: string[];
  retailPrice: number;
  costPrice: number;
  availableStock: number;
  reservedStock: number;
  soldStock: number;
  returnedStock: number;
  damagedStock: number;
  lowStockThreshold: number;
  status: ProductStatus;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export type InventoryStatus = "in-stock" | "low-stock" | "out-of-stock";

export function inventoryStatus(p: Pick<Product, "availableStock" | "lowStockThreshold">): InventoryStatus {
  if (p.availableStock <= 0) return "out-of-stock";
  if (p.availableStock <= p.lowStockThreshold) return "low-stock";
  return "in-stock";
}
