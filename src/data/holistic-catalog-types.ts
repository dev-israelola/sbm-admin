export type ProductCategory =
  | "gut-digestion"
  | "womens-health"
  | "mens-wellness"
  | "detox-cleanses"
  | "immunity-relief"
  | "superfoods-wellness";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  blurb?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: ProductCategory;
  blurb: string;
  image: string;
  productCount: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  brandSlug: string;
  category: ProductCategory;
  retailPrice: number;
  rating: number;
  reviewCount: number;
  description: string;
  benefits: string[];
  ingredients: string[];
  howToUse: string[];
  images: string[];
  availableStock: number;
  reservedStock: number;
  soldStock: number;
  damagedStock: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  skinConcern: string[];
  tags: string[];
  reviews?: Review[];
}
