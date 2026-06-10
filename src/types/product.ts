export type ProductCategory =
  | 'superfoods'
  | 'energy-mixes'
  | 'herbal-drinks'
  | 'nutrition-drink'
  | 'healthy-snacks'
  | 'seeds-mixes'
  | 'dates';

export interface Ingredient {
  name: string;
  description: string;
  icon: string;
  benefits: string[];
  percentage?: number;
}

export interface NutritionInfo {
  servingSize: string;
  servingsPerContainer: number;
  calories: number;
  labCertified?: boolean;
  labReport?: string;
  nutrients: {
    name: string;
    amount: string;
    dailyValue?: string;
  }[];
}

export interface HealthBenefit {
  title: string;
  description: string;
  icon: string;
  category: 'heart' | 'immunity' | 'digestive' | 'energy' | 'wellness';
}

export interface UsageInstruction {
  step: number;
  instruction: string;
  image?: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  structuredData: object;
}

export interface ProductVariant {
  label: string;
  weight: string;
  price: number;
  inStock: boolean;
  packCount?: number;
  imageScale?: number; // 1 = normal, >1 = bigger
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  tags?: string[];
  description: string;
  longDescription: string;
  price: number;
  currency: string;
  category: ProductCategory;
  images: {
    thumbnail: string;
    main: string;
    gallery: string[];
    model3D?: string;
  };
  ingredients: Ingredient[];
  nutrition: NutritionInfo;
  benefits: HealthBenefit[];
  usage: UsageInstruction[];
  inStock: boolean;
  featured: boolean;
  variants?: ProductVariant[];
  seo: SEOMetadata;
}
